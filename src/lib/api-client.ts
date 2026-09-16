import axios, { AxiosInstance } from "axios";
import APP_ROUTE from "@/lib/app-route.ts";
import { clearProtectedState } from "@/features/auth/protected-session";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  xsrfCookieName: "lecCsrf",
  xsrfHeaderName: "x-lec-csrf",
});

api.interceptors.response.use(
  (response) => {
    // we need the response headers for these endpoints
    const exemptEndpoints = ["/api/pages/export", "/api/spaces/export"];
    if (response.request.responseURL) {
      const path = new URL(response.request.responseURL)?.pathname;
      if (path && exemptEndpoints.includes(path)) {
        return response;
      }
    }

    return response.data;
  },
  async (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      const publicPage = /^\/(login|docs|share)(\/|$)/.test(
        window.location.pathname,
      );
      const anonymousProbe =
        status === 401 &&
        publicPage &&
        !document.cookie
          .split(";")
          .some((cookie) => cookie.trim().startsWith("lecCsrf="));
      if (!anonymousProbe) {
        try {
          await clearProtectedState();
          if (status === 401) redirectToLogin();
        } catch {
          // 清理失败时保留锁定界面，不重新显示缓存文档。
        }
      }
    }
    return Promise.reject(error);
  },
);

function redirectToLogin() {
  const exemptPaths = [
    APP_ROUTE.AUTH.LOGIN,
    APP_ROUTE.AUTH.SIGNUP,
    APP_ROUTE.AUTH.FORGOT_PASSWORD,
    APP_ROUTE.AUTH.PASSWORD_RESET,
    "/invites",
  ];
  if (!exemptPaths.some((path) => window.location.pathname.startsWith(path))) {
    const redirectTo = window.location.pathname;
    if (redirectTo === APP_ROUTE.HOME) {
      window.location.href = APP_ROUTE.AUTH.LOGIN;
    } else {
      const params = new URLSearchParams({ redirect: redirectTo });
      window.location.href = `${APP_ROUTE.AUTH.LOGIN}?${params.toString()}`;
    }
  }
}

export default api;
