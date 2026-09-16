import { render, screen, cleanup } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, expect, it, vi } from "vitest";
import { LoginForm } from "../login-form";

vi.mock("@/features/auth/hooks/use-redirect-if-authenticated.ts", () => ({
  useRedirectIfAuthenticated: () => {},
}));
vi.mock("@/features/workspace/queries/workspace-query.ts", () => ({
  useWorkspacePublicDataQuery: () => ({ data: {}, isLoading: false }),
}));
vi.mock("@/features/auth/hooks/use-auth", () => ({
  default: () => ({ signIn: vi.fn(), isLoading: false }),
}));
afterEach(cleanup);

it("登录页只提供 LecSSO 跳转，不要求在 Doc 再次输入密码", () => {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  render(
    <MantineProvider>
      <LoginForm />
    </MantineProvider>,
  );
  expect(
    screen.getByRole("link", { name: "使用 LecSSO 登录" }).getAttribute("href"),
  ).toBe("/api/auth/oidc/login");
  expect(document.querySelector('input[type="password"]')).toBeNull();
});
