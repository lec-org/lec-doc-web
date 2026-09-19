import { useTranslation } from "react-i18next";
import { DocumentTitle } from "@/components/ui/document-title";
import { PageListView } from "@/features/page/components/page-list-view";
import { useRecentChangesQuery } from "@/features/page/queries/page-query";

export default function RecentPage() {
  const { t } = useTranslation();
  const query = useRecentChangesQuery();
  const pages = query.data?.pages.flatMap((page) => page.items) ?? [];
  return (
    <div className="lec-page lec-page--narrow">
      <DocumentTitle title={t("Recently updated")} />
      <header className="lec-page-header">
        <div><h1 className="lec-page-title">{t("Recently updated")}</h1><p className="lec-page-description">{t("Continue from the documents your team updated most recently.")}</p></div>
      </header>
      <PageListView
        pages={pages}
        loading={query.isLoading}
        emptyTitle={t("No recently updated documents")}
        emptyDescription={t("Documents updated by your team will appear here.")}
        hasNextPage={query.hasNextPage}
        fetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => query.fetchNextPage()}
      />
    </div>
  );
}
