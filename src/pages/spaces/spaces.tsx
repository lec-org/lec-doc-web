import { Group, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGetSpacesQuery } from "@/features/space/queries/space-query";
import CreateSpaceModal from "@/features/space/components/create-space-modal";
import { AllSpacesList } from "@/features/space/components/spaces-page";
import FavoriteSpacesGrid from "@/features/space/components/spaces-page/favorite-spaces-grid";
import { usePaginateAndSearch } from "@/hooks/use-paginate-and-search";
import { DocumentTitle } from "@/components/ui/document-title";

export default function Spaces() {
  const { t } = useTranslation();
  const { search, cursor, goNext, goPrev, handleSearch } = usePaginateAndSearch();
  const { data } = useGetSpacesQuery({ cursor, limit: 30, query: search });

  return (
    <div className="lec-page">
      <DocumentTitle title={t("Spaces")} />
      <header className="lec-page-header">
        <div>
          <h1 className="lec-page-title">{t("Spaces")}</h1>
          <p className="lec-page-description">{t("Browse team knowledge areas and project documentation.")}</p>
        </div>
        <CreateSpaceModal />
      </header>
      <FavoriteSpacesGrid />
      <section className="lec-section">
        <div className="lec-section-heading">
          <div><h2 className="lec-section-title">{t("All spaces")}</h2><Text size="xs" c="dimmed">{t("{{count}} spaces", { count: data?.items?.length ?? 0 })}</Text></div>
        </div>
        <div className="lec-card" style={{ padding: 16 }}>
          <AllSpacesList
            spaces={data?.items || []}
            onSearch={handleSearch}
            hasPrevPage={data?.meta?.hasPrevPage}
            hasNextPage={data?.meta?.hasNextPage}
            onNext={() => goNext(data?.meta?.nextCursor)}
            onPrev={goPrev}
          />
        </div>
      </section>
    </div>
  );
}
