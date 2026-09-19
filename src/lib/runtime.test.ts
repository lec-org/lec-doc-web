import { beforeEach, describe, expect, it } from "vitest";
import {
  configureLecDocRuntime,
  getLecDocRuntime,
  isDesktopMode,
} from "./runtime";

describe("Lec Doc runtime", () => {
  beforeEach(() => {
    delete window.LEC_DOC_RUNTIME;
  });

  it("defaults to web and exposes one host-provided global", () => {
    expect(getLecDocRuntime()).toEqual({ mode: "web" });
    expect(isDesktopMode()).toBe(false);

    configureLecDocRuntime({ mode: "desktop", backendUrl: "https://doc.test/api" });
    expect(window.LEC_DOC_RUNTIME).toEqual({ mode: "desktop", backendUrl: "https://doc.test/api" });
    expect(isDesktopMode()).toBe(true);
  });

  it("accepts an identical render but rejects changing hosts", () => {
    configureLecDocRuntime({ mode: "desktop" });
    expect(() => configureLecDocRuntime({ mode: "desktop" })).not.toThrow();
    expect(() => configureLecDocRuntime({ mode: "web" })).toThrow("already configured");
  });
});
