import { expect, it, vi } from "vitest";
import api from "@/lib/api-client";
import { clearProtectedState } from "../protected-session";

vi.mock("../protected-session", () => ({
  clearProtectedState: vi.fn().mockResolvedValue(undefined),
}));

it("任意 API 403 都触发共享清理，同时保留失败给调用方", async () => {
  const denied = { response: { status: 403, data: { message: "无权限" } } };
  const previous = api.defaults.adapter;
  api.defaults.adapter = async () => {
    throw denied;
  };
  try {
    await expect(
      api.post("/pages/info", { pageId: "private-page" }),
    ).rejects.toBe(denied);
    expect(clearProtectedState).toHaveBeenCalledTimes(1);
  } finally {
    api.defaults.adapter = previous;
  }
});
