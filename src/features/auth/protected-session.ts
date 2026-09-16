import { getDefaultStore } from "jotai";
import { queryClient } from "@/lib/query-client";
import { currentUserAtom } from "@/features/user/atoms/current-user-atom";
import Cookies from "js-cookie";

export const PROTECTED_STATE_CLEARING = "lec-doc:session-clearing";
const RESET_KEY = "lec-doc:session-reset";
const cleanups = new Set<() => void | Promise<void>>();
let clearing: Promise<void> | undefined;
let protectedStateCleared = false;

export function protectedDocumentCacheName(
  workspaceId: string,
  userId: string,
  pageId: string,
): string {
  const csrf = Cookies.get("lecCsrf") ?? "";
  if (
    !workspaceId ||
    !userId ||
    !pageId ||
    !/^[A-Za-z0-9_-]{43}\.[A-Za-z0-9_-]{43}$/.test(csrf)
  ) {
    throw new Error("需要有效登录态才能读取本地文档");
  }
  // 随机会话 nonce 只用于命名空间，不在浏览器判断权限。
  return `lec-doc:${[workspaceId, userId, csrf.split(".")[0], `page.${pageId}`].map(encodeURIComponent).join(":")}`;
}

export const isProtectedStateCleared = () => protectedStateCleared;
export function subscribeProtectedState(listener: () => void): () => void {
  window.addEventListener(PROTECTED_STATE_CLEARING, listener);
  return () => window.removeEventListener(PROTECTED_STATE_CLEARING, listener);
}

/** 全页面共用撤权清理锁；编辑器、Socket 和多个失败请求不能各自清理一半状态。 */
export function registerProtectedCleanup(
  cleanup: () => void | Promise<void>,
): () => void {
  cleanups.add(cleanup);
  return () => {
    cleanups.delete(cleanup);
  };
}

export function clearProtectedState(broadcast = true): Promise<void> {
  if (clearing) return clearing;
  const activeCleanups = [...cleanups];
  protectedStateCleared = true;
  // 先占用页面级锁，避免通知导致同步重入；任一存储失败都不能跳过断连。
  clearing = Promise.resolve()
    .then(async () => {
      const results = await Promise.allSettled([
        ...activeCleanups.map(async (close) => close()),
        (async () => {
          try {
            await queryClient.cancelQueries();
          } finally {
            queryClient.clear();
            getDefaultStore().set(currentUserAtom, null);
          }
        })(),
        (async () => {
          if (broadcast) localStorage.setItem(RESET_KEY, crypto.randomUUID());
        })(),
        (async () => {
          localStorage.removeItem("currentUser");
        })(),
      ]);
      if (window.indexedDB) {
        const databases = await window.indexedDB.databases();
        await Promise.all(
          databases
            .filter(
              ({ name }) =>
                name?.startsWith("lec-doc:") ||
                /^page\.[0-9a-f-]{36}$/i.test(name ?? ""),
            )
            .map(
              ({ name }) =>
                new Promise<void>((resolve, reject) => {
                  const request = window.indexedDB.deleteDatabase(name!);
                  request.onsuccess = () => resolve();
                  request.onerror = () => reject(new Error("本地文档清理失败"));
                  request.onblocked = () =>
                    reject(new Error("请关闭其他 Lec Doc 标签页后重试"));
                }),
            ),
        );
      }
      if (results.some((result) => result.status === "rejected"))
        throw new Error("文档连接清理失败，请重新打开页面");
    })
    .finally(() => {
      clearing = undefined;
    });
  window.dispatchEvent(new Event(PROTECTED_STATE_CLEARING));
  return clearing;
}

window.addEventListener("storage", (event) => {
  if (event.key === RESET_KEY && event.newValue) {
    // 界面先锁定；清理失败也不能恢复显示旧数据。
    void clearProtectedState(false).catch(() => {});
  }
});
