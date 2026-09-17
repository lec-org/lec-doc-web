import { Link, useParams } from "react-router-dom";
import { usePageQuery } from "@/features/page/queries/page-query";
import { FullEditor } from "@/features/editor/full-editor";
import HistoryModal from "@/features/page-history/components/history-modal";
import PageHeader from "@/features/page/components/header/page-header.tsx";
import { extractPageSlugId } from "@/lib";
import { useGetSpaceBySlugQuery } from "@/features/space/queries/space-query.ts";
import { useTranslation } from "react-i18next";
import React from "react";
import { EmptyState } from "@/components/ui/empty-state.tsx";
import { IconAlertTriangle, IconFileOff } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import PageControlModal, {
  type PageControlAction,
} from "@/features/page/components/page-control-modal";
import { ErrorBoundary } from "react-error-boundary";
import { getPageTitle } from "@/features/page/page.utils";
import { DocumentTitle } from "@/components/ui/document-title.tsx";

const MemoizedFullEditor = React.memo(FullEditor);
const MemoizedPageHeader = React.memo(PageHeader);
const MemoizedHistoryModal = React.memo(HistoryModal);

export default function Page() {
  const { t } = useTranslation();
  const { pageSlug } = useParams();

  return (
    <ErrorBoundary
      resetKeys={[pageSlug]}
      fallbackRender={({ resetErrorBoundary }) => (
        <EmptyState
          icon={IconAlertTriangle}
          title={t("Failed to load page. An error occurred.")}
          action={
            <Button
              variant="default"
              size="sm"
              mt="xs"
              onClick={resetErrorBoundary}
            >
              {t("Try again")}
            </Button>
          }
        />
      )}
    >
      <PageContent pageSlug={pageSlug} />
    </ErrorBoundary>
  );
}

function PageContent({ pageSlug }: { pageSlug: string | undefined }) {
  const { t } = useTranslation();
  const [controlAction, setControlAction] =
    React.useState<PageControlAction | null>(null);
  const {
    data: page,
    isLoading,
    isError,
    error,
  } = usePageQuery({ pageId: extractPageSlugId(pageSlug) });
  const { data: space } = useGetSpaceBySlugQuery(page?.space?.slug);
  const canEdit = !page?.deletedAt && (page?.permissions?.canEdit ?? false);
  const canComment =
    canEdit || space?.settings?.comments?.allowViewerComments === true;

  if (isLoading) return null;

  if (isError || !page) {
    if ([401, 403, 404].includes(error?.["status"])) {
      return (
        <EmptyState
          icon={IconFileOff}
          title={t("Page not found")}
          description={t(
            "This page may have been deleted, moved, or you may not have access.",
          )}
          action={
            error?.["status"] === 403 && extractPageSlugId(pageSlug) ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  mt="xs"
                  onClick={() => setControlAction("request-access")}
                >
                  {t("Request page access")}
                </Button>
                <PageControlModal
                  action={controlAction}
                  pageId={extractPageSlugId(pageSlug)}
                  onClose={() => setControlAction(null)}
                />
              </>
            ) : (
              <Button
                component={Link}
                to="/home"
                variant="default"
                size="sm"
                mt="xs"
              >
                {t("Go to homepage")}
              </Button>
            )
          }
        />
      );
    }
    return (
      <EmptyState icon={IconFileOff} title={t("Error fetching page data.")} />
    );
  }

  if (!space) return null;

  if (page.isBase) {
    return (
      <EmptyState
        icon={IconFileOff}
        title={t("Page not found")}
        description={t("This page type is not available in Lec Doc Community.")}
      />
    );
  }

  return (
    <div>
      <DocumentTitle
        title={`${page.icon || ""}  ${getPageTitle(page.title, false, t)}`}
        withAppName={false}
      />
      <MemoizedPageHeader readOnly={!canEdit} />
      <MemoizedFullEditor
        key={page.id}
        pageId={page.id}
        title={page.title}
        content={page.content}
        slugId={page.slugId}
        spaceSlug={page.space?.slug}
        editable={canEdit}
        creator={page.creator}
        contributors={page.contributors}
        canComment={canComment}
      />
      <MemoizedHistoryModal pageId={page.id} />
    </div>
  );
}
