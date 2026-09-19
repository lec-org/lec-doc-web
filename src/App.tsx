import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/layouts/global/layout.tsx";
import { Error404 } from "@/components/ui/error-404.tsx";
import { useTrackOrigin } from "@/hooks/use-track-origin";

const LoginPage = lazy(() => import("@/pages/auth/login"));
const Home = lazy(() => import("@/pages/dashboard/home"));
const Page = lazy(() => import("@/pages/page/page"));
const AccountSettings = lazy(
  () => import("@/pages/settings/account/account-settings"),
);
const WorkspaceMembers = lazy(
  () => import("@/pages/settings/workspace/workspace-members"),
);
const WorkspaceSettings = lazy(
  () => import("@/pages/settings/workspace/workspace-settings"),
);
const Groups = lazy(() => import("@/pages/settings/group/groups"));
const GroupInfo = lazy(() => import("./pages/settings/group/group-info"));
const Spaces = lazy(() => import("@/pages/settings/space/spaces.tsx"));
const AccountPreferences = lazy(
  () => import("@/pages/settings/account/account-preferences.tsx"),
);
const SpaceHome = lazy(() => import("@/pages/space/space-home.tsx"));
const SharedPage = lazy(() => import("@/pages/share/shared-page.tsx"));
const Shares = lazy(() => import("@/pages/settings/shares/shares.tsx"));
const ShareLayout = lazy(
  () => import("@/features/share/components/share-layout.tsx"),
);
const ShareRedirect = lazy(() => import("@/pages/share/share-redirect.tsx"));
const PublicSpacePage = lazy(
  () => import("@/pages/public-space/public-space-page.tsx"),
);
const PublicSpaceLayout = lazy(
  () => import("@/features/public-space/components/public-space-layout.tsx"),
);
const PublicSpaceDirectoryPage = lazy(
  () => import("@/pages/public-space/public-space-directory-page.tsx"),
);
const SpacesPage = lazy(() => import("@/pages/spaces/spaces.tsx"));
const SpaceTrash = lazy(() => import("@/pages/space/space-trash.tsx"));
const FavoritesPage = lazy(() => import("@/pages/favorites/favorites-page"));
const RecentPage = lazy(() => import("@/pages/recent/recent-page"));
const SharedPageList = lazy(() => import("@/pages/shared/shared-page-list"));
const SearchPage = lazy(() => import("@/pages/search/search-page"));
const LabelPage = lazy(() => import("@/pages/label/label-page"));

export default function App() {
  useTrackOrigin();

  useEffect(() => {
    const timer = setTimeout(() => import("@/pages/page/page"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/invites/:invitationId"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/forgot-password"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/password-reset"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/setup/register"
          element={<Navigate to="/login" replace />}
        />

        <Route element={<ShareLayout />}>
          <Route path="/share/:shareId/p/:pageSlug" element={<SharedPage />} />
          <Route path="/share/p/:pageSlug" element={<SharedPage />} />
        </Route>

        <Route path="/docs" element={<PublicSpaceDirectoryPage />} />
        <Route element={<PublicSpaceLayout />}>
          <Route path="/docs/:spaceSlug" element={<PublicSpacePage />} />
          <Route
            path="/docs/:spaceSlug/:pageSlug"
            element={<PublicSpacePage />}
          />
        </Route>

        <Route path="/share/:shareId" element={<ShareRedirect />} />

        <Route element={<Layout />}>
          <Route path="/wiki/:pageSlug" element={<Page />} />
          <Route path="/home" element={<Home />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/shared" element={<SharedPageList />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/labels/:labelName" element={<LabelPage />} />
          <Route path="/s/:spaceSlug" element={<SpaceHome />} />
          <Route path="/s/:spaceSlug/trash" element={<SpaceTrash />} />

          <Route path="/settings">
            <Route index element={<Navigate to="account/profile" replace />} />
            <Route path="account/profile" element={<AccountSettings />} />
            <Route
              path="account/preferences"
              element={<AccountPreferences />}
            />
            <Route path="workspace" element={<WorkspaceSettings />} />
            <Route path="members" element={<WorkspaceMembers />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:groupId" element={<GroupInfo />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="sharing" element={<Shares />} />
          </Route>
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
}
