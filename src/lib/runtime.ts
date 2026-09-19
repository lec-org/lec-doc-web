export type LecDocRuntimeConfig = {
  mode: "web" | "desktop";
  appUrl?: string;
  backendUrl?: string;
  collaborationUrl?: string;
  socketUrl?: string;
  assetBaseUrl?: string;
};

declare global {
  interface Window {
    LEC_DOC_RUNTIME?: Readonly<LecDocRuntimeConfig>;
  }
}

const webRuntime = Object.freeze<LecDocRuntimeConfig>({ mode: "web" });

/** 宿主在加载业务模块前注入一次全局运行环境。 */
export function configureLecDocRuntime(config: LecDocRuntimeConfig): void {
  if (window.LEC_DOC_RUNTIME) {
    if (JSON.stringify(window.LEC_DOC_RUNTIME) !== JSON.stringify(config)) {
      throw new Error("Lec Doc runtime is already configured");
    }
    return;
  }
  window.LEC_DOC_RUNTIME = Object.freeze({ ...config });
}

/** Web 与 Desktop 共用的运行时读取入口。 */
export function getLecDocRuntime(): Readonly<LecDocRuntimeConfig> {
  return window.LEC_DOC_RUNTIME ?? webRuntime;
}

export function isDesktopMode(): boolean {
  return getLecDocRuntime().mode === "desktop";
}
