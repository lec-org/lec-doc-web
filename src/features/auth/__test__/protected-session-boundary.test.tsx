import { act, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProtectedSessionBoundary } from "../protected-session-boundary";
import { clearProtectedState } from "../protected-session";

it("清理开始时立即卸载受保护视图，清理失败也不恢复原正文", async () => {
  Object.defineProperty(window, "indexedDB", {
    configurable: true,
    value: {
      databases: async () => {
        throw new Error("disk unavailable");
      },
    },
  });
  render(
    <ProtectedSessionBoundary>
      <div>不应继续展示的私密正文</div>
    </ProtectedSessionBoundary>,
  );
  expect(screen.getByText("不应继续展示的私密正文")).toBeDefined();
  await act(async () => {
    await expect(clearProtectedState()).rejects.toThrow("disk unavailable");
  });
  expect(screen.queryByText("不应继续展示的私密正文")).toBeNull();
  expect(screen.getByRole("heading", { name: "访问状态已变化" })).toBeDefined();
});
