import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { searchPage } from "@/features/search/services/search-service";
import { IPageSearch, IPageSearchParams } from "@/features/search/types/search.types";

export interface UseUnifiedSearchParams extends IPageSearchParams {
  contentType?: string;
}

export function useUnifiedSearch(
  params: UseUnifiedSearchParams,
  enabled: boolean = true,
): UseQueryResult<IPageSearch[], Error> {
  return useQuery({
    queryKey: ["unified-search", "page", params],
    queryFn: async () => {
      const { contentType: _contentType, ...backendParams } = params;
      return searchPage(backendParams);
    },
    enabled:
      (!!params.query || (params.labelIds?.length ?? 0) > 0 || !!params.creatorId) &&
      enabled,
    placeholderData: (previousData) => previousData,
  });
}
