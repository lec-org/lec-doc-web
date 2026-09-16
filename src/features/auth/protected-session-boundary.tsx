import { ReactNode, useSyncExternalStore } from "react";
import {
  isProtectedStateCleared,
  subscribeProtectedState,
} from "./protected-session";

/** 先卸载文档再清缓存，避免 401/403 后旧 React/Yjs 内容继续显示。 */
export function ProtectedSessionBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const cleared = useSyncExternalStore(
    subscribeProtectedState,
    isProtectedStateCleared,
  );
  if (!cleared) return children;
  return (
    <main
      role="status"
      style={{ maxWidth: 480, margin: "15vh auto", padding: 24 }}
    >
      <h1>访问状态已变化</h1>
      <p>
        文档已关闭。请重新验证权限；若本地数据无法清理，请关闭其他 Lec Doc
        标签页后重试。
      </p>
      <button type="button" onClick={() => window.location.reload()}>
        重新验证权限
      </button>
      <p>
        <a href="/api/auth/oidc/login">使用 LecSSO 登录</a>
      </p>
    </main>
  );
}
