import { describe, expect, it } from "vitest";
import { downloadFilename } from "./download";

describe("downloadFilename", () => {
  it("uses a safe fallback without Content-Disposition", () => {
    expect(downloadFilename(undefined, "export.zip")).toBe("export.zip");
  });

  it("decodes RFC 5987 filenames", () => {
    expect(
      downloadFilename("attachment; filename*=UTF-8''%E6%96%87%E6%A1%A3.zip", "export.zip"),
    ).toBe("文档.zip");
  });
});
