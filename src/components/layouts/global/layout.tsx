import { UserProvider } from "@/features/user/user-provider.tsx";
import { Outlet, useParams } from "react-router-dom";
import { useHotkeys } from "@mantine/hooks";
import GlobalAppShell from "@/components/layouts/global/global-app-shell.tsx";
import { SearchSpotlight } from "@/features/search/components/search-spotlight.tsx";
import { searchSpotlight } from "@/features/search/constants";
import { useGetSpaceBySlugQuery } from "@/features/space/queries/space-query.ts";

export default function Layout() {
  const { spaceSlug } = useParams();
  const { data: space } = useGetSpaceBySlugQuery(spaceSlug);

  useHotkeys([["mod+K", searchSpotlight.open]]);

  return (
    <UserProvider>
      <GlobalAppShell>
        <Outlet />
      </GlobalAppShell>
      <SearchSpotlight spaceId={space?.id} />
    </UserProvider>
  );
}
