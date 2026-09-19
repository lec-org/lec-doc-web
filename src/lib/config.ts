import bytes from "bytes";
import { castToBoolean } from "@/lib/utils.tsx";
import { AvatarIconType } from "@/features/attachments/types/attachment.types.ts";
import { sanitizeUrl } from "@lec/doc-editor";
import { getLecDocRuntime } from "@/lib/runtime";

export type { LecDocRuntimeConfig } from "@/lib/runtime";
export { configureLecDocRuntime, getLecDocRuntime, isDesktopMode } from "@/lib/runtime";

declare global {
  interface Window {
    CONFIG?: Record<string, string>;
  }
}

function normalizedRuntimeUrl(value?: string): string | undefined {
  if (!value) return undefined;
  return value.replace(/\/$/, "");
}

export function getAppName(): string {
  return "Lec Doc";
}

export function getAppUrl(): string {
  return (
    normalizedRuntimeUrl(getLecDocRuntime().appUrl) ||
    `${window.location.protocol}//${window.location.host}`
  );
}

export function getBackendUrl(): string {
  return (
    normalizedRuntimeUrl(getLecDocRuntime().backendUrl) ||
    getAppUrl() + "/api"
  );
}

export function getCollaborationUrl(): string {
  const baseUrl =
    getLecDocRuntime().collaborationUrl ||
    getConfigValue("COLLAB_URL") ||
    (import.meta.env.DEV ? process.env.APP_URL : getAppUrl());

  const collabUrl = new URL("/collab", baseUrl);
  collabUrl.protocol = collabUrl.protocol === "https:" ? "wss:" : "ws:";
  return collabUrl.toString();
}

export function isCloud(): boolean {
  return castToBoolean(getConfigValue("CLOUD"));
}

export function isBetaPublicSpaces(): boolean {
  return castToBoolean(getConfigValue("BETA_PUBLIC_SPACES"));
}

export function getAvatarUrl(
  avatarUrl: string,
  type: AvatarIconType = AvatarIconType.AVATAR,
) {
  if (!avatarUrl) return null;
  if (avatarUrl?.startsWith("http")) return avatarUrl;

  return getBackendUrl() + `/attachments/img/${type}/` + encodeURI(avatarUrl);
}

export function getSpaceUrl(spaceSlug: string) {
  return "/s/" + spaceSlug;
}

export function getSocketUrl(): string | undefined {
  return normalizedRuntimeUrl(getLecDocRuntime().socketUrl);
}

export function getAssetUrl(path: string): string {
  const base = normalizedRuntimeUrl(getLecDocRuntime().assetBaseUrl);
  return base ? `${base}/${path.replace(/^\//, "")}` : path;
}

export function getFileUrl(src: string) {
  if (!src) return src;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/api/")) {
    // Remove the '/api' prefix
    return getBackendUrl() + src.substring(4);
  }
  if (src.startsWith("/files/")) {
    return getBackendUrl() + src;
  }
  return sanitizeUrl(src);
}

export function getFileUploadSizeLimit() {
  const limit = getConfigValue("FILE_UPLOAD_SIZE_LIMIT", "50mb");
  return bytes(limit);
}

export function getFileImportSizeLimit() {
  const limit = getConfigValue("FILE_IMPORT_SIZE_LIMIT", "200mb");
  return bytes(limit);
}

export function getDrawioUrl() {
  return getConfigValue("DRAWIO_URL", "https://embed.diagrams.net");
}

function getConfigValue(key: string, defaultValue: string = undefined): string {
  const rawValue = import.meta.env.DEV
    ? process?.env?.[key]
    : window?.CONFIG?.[key];
  return rawValue ?? defaultValue;
}
