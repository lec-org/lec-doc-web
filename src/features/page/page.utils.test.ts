import { describe, expect, it } from "vitest";
import { buildPageUrl } from "./page.utils";

describe("buildPageUrl", () => {
  it("uses a space-independent canonical wiki URL", () => {
    expect(buildPageUrl("personal-space", "abc123", "Renamed page"))
      .toBe("/wiki/abc123");
  });

  it("keeps search and anchor deep links", () => {
    expect(buildPageUrl(undefined, "abc123", undefined, "section-1", ["hello world"], true))
      .toBe("/wiki/abc123?q=hello+world&m=whole#section-1");
  });
});
