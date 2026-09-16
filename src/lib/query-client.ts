import { QueryClient } from "@tanstack/react-query";

// 全应用共享同一缓存；导入数据层不应触发 React 根节点挂载。
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

