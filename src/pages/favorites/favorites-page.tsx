import { Badge, Button, Group, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DocumentTitle } from "@/components/ui/document-title";
import { EmptyState } from "@/components/ui/empty-state";
import { PageListIcon } from "@/components/common/page-list-icon";
import { useFavoritesQuery } from "@/features/favorite/queries/favorite-query";
import { buildPageUrl, getPageTitle } from "@/features/page/page.utils";
import { formattedDate } from "@/lib/time";

export default function FavoritesPage() {
  const { t } = useTranslation();
  const query = useFavoritesQuery("page");
  const favorites = query.data?.pages.flatMap((page) => page.items) ?? [];
  const visible = favorites.filter((favorite) => favorite.page);

  return (
    <div className="lec-page lec-page--narrow">
      <DocumentTitle title={t("Favorites")} />
      <header className="lec-page-header"><div><h1 className="lec-page-title">{t("Favorites")}</h1><p className="lec-page-description">{t("Your pinned documents, always one click away.")}</p></div></header>
      {visible.length ? (
        <>
          <div className="lec-card">
            {visible.map((favorite) => (
              <Link key={favorite.id} className="lec-list-row" to={buildPageUrl(favorite.space?.slug, favorite.page!.slugId, favorite.page!.title)}>
                <Group gap={10} wrap="nowrap"><PageListIcon icon={favorite.page!.icon} /><Text size="sm" fw={550} truncate>{getPageTitle(favorite.page!.title, false, t)}</Text></Group>
                <Badge size="sm" color="gray" variant="light">{favorite.space?.name}</Badge>
                <Text size="xs" c="dimmed" ta="right">{formattedDate(new Date(favorite.createdAt))}</Text>
              </Link>
            ))}
          </div>
          {query.hasNextPage && <Button variant="subtle" fullWidth mt="sm" loading={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{t("Load more")}</Button>}
        </>
      ) : query.isLoading ? null : (
        <EmptyState icon={IconStar} title={t("No favorite pages")} description={t("Pages you favorite will show up here.")} />
      )}
    </div>
  );
}
