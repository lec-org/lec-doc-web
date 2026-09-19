import { lazy, Suspense } from "react";
import {
  configureLecDocRuntime,
  type LecDocRuntimeConfig,
} from "@/lib/runtime";

const LazyLecDocAppRoot = lazy(async () => {
  const { LecDocAppRoot } = await import("./app-root.tsx");
  return { default: LecDocAppRoot };
});

/**
 * Lec Doc 的源码组件入口。宿主传入运行环境后加载路由、Provider、i18n 和业务模块。
 * 独立的 BrowserRouter/Provider 让 Web main.tsx 与 Desktop renderer 直接复用同一组件。
 */
export function LecDocApp({ runtime }: { runtime: LecDocRuntimeConfig }) {
  configureLecDocRuntime(runtime);
  return (
    <Suspense fallback={null}>
      <LazyLecDocAppRoot />
    </Suspense>
  );
}

