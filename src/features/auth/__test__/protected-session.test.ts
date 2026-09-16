import { beforeEach, expect, it, vi } from "vitest";
import { queryClient } from "@/lib/query-client";
import {
  clearProtectedState,
  registerProtectedCleanup,
  protectedDocumentCacheName,
} from "../protected-session";

beforeEach(() => {
  queryClient.clear();
  Object.defineProperty(window, "indexedDB", {
    configurable: true,
    value: { databases: async () => [] },
  });
});

it("多个撤权入口共享一次清理，先关闭活动文档再清除查询缓存", async () => {
  queryClient.setQueryData(["pages", "private-page"], { content: "私密正文" });
  let release!: () => void;
  const close = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      }),
  );
  const unregister = registerProtectedCleanup(close);
  const first = clearProtectedState();
  const second = clearProtectedState();
  await Promise.resolve();
  expect(close).toHaveBeenCalledTimes(1);
  release();
  await Promise.all([first, second]);
  expect(queryClient.getQueryData(["pages", "private-page"])).toBeUndefined();
  unregister();
});

it("同一页面按账号与本次登录隔离，缺少会话标记不读取离线文档", () => {
  document.cookie = `lecCsrf=${"a".repeat(43)}.${"b".repeat(43)}; path=/`;
  const first = protectedDocumentCacheName("workspace-1", "user-1", "page-1");
  const second = protectedDocumentCacheName("workspace-1", "user-2", "page-1");
  expect(first).not.toBe(second);
  document.cookie = `lecCsrf=${"c".repeat(43)}.${"b".repeat(43)}; path=/`;
  expect(
    protectedDocumentCacheName("workspace-1", "user-1", "page-1"),
  ).not.toBe(first);
  document.cookie = "lecCsrf=; Max-Age=0; path=/";
  expect(() =>
    protectedDocumentCacheName("workspace-1", "user-1", "page-1"),
  ).toThrow();
});

it("只删除当前产品的文档数据库，并等待删除完成", async () => {
  const deleted: string[] = [];
  const requests: Array<{ onsuccess?: () => void }> = [];
  Object.defineProperty(window, "indexedDB", {
    configurable: true,
    value: {
      databases: async () => [
        { name: "lec-doc:old-session:page" },
        { name: "page.00000000-0000-0000-0000-000000000001" },
        { name: "unrelated-app" },
      ],
      deleteDatabase: (name: string) => {
        deleted.push(name);
        const request = {};
        requests.push(request);
        return request;
      },
    },
  });
  let finished = false;
  const clearing = clearProtectedState().then(() => {
    finished = true;
  });
  await vi.waitFor(() => expect(deleted).toHaveLength(2));
  expect(finished).toBe(false);
  requests.forEach((request) => request.onsuccess?.());
  await clearing;
  expect(deleted).not.toContain("unrelated-app");
});

it("浏览器拒绝本地存储时仍关闭连接、删除正文并保持页面锁定", async () => {
  const close = vi.fn();
  const unregister = registerProtectedCleanup(close);
  queryClient.setQueryData(["private"], "正文");
  const writes = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("storage denied");
    });
  const removals = vi
    .spyOn(Storage.prototype, "removeItem")
    .mockImplementation(() => {
      throw new Error("storage denied");
    });
  const databases = vi.fn(async () => []);
  Object.defineProperty(window, "indexedDB", {
    configurable: true,
    value: { databases },
  });
  try {
    await expect(
      Promise.resolve().then(() => clearProtectedState()),
    ).rejects.toThrow();
    expect(close).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(["private"])).toBeUndefined();
    expect(databases).toHaveBeenCalledOnce();
  } finally {
    writes.mockRestore();
    removals.mockRestore();
    unregister();
  }
});
