import { expect, it, vi } from "vitest";
import api from "@/lib/api-client";
import { clearProtectedState } from "../protected-session";

vi.mock("../protected-session", () => ({
  clearProtectedState: vi.fn().mockResolvedValue(undefined),
}));

it("资源级 403 保持会话并将失败交给页面", async () => {
  const denied = { response: { status: 403, data: { message: "无权限" } } };
  const previous = api.defaults.adapter;
  api.defaults.adapter = async () => {
    throw denied;
  };
  try {
    await expect(
      api.post("/pages/info", { pageId: "private-page" }),
    ).rejects.toBe(denied);
    expect(clearProtectedState).not.toHaveBeenCalled();
  } finally {
    api.defaults.adapter = previous;
  }
});
