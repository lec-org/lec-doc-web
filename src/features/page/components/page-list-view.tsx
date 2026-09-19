import { Badge, Button, Group, Skeleton, Text } from "@mantine/core";
import { IconFiles } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IPage } from "@/features/page/types/page.types";
import { PageListIcon } from "@/components/common/page-list-icon";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { buildPageUrl, getPageTitle } from "@/features/page/page.utils";
import { formattedDate } from "@/lib/time";

export function PageListView({
  pages,
  loading,
  emptyTitle,
  emptyDescription,
  hasNextPage,
  fetchingNextPage,
  onLoadMore,
}: {
  pages: IPage[];
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  hasNextPage?: boolean;
  fetchingNextPage?: boolean;
  onLoadMore?: () => void;
}) {
  const { t } = useTranslation();
  if (loading) {
    return <div className="lec-card" style={{ display: "grid", gap: 10, padding: 16 }}>{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} h={36} />)}</div>;
  }
  if (!pages.length) return <EmptyState icon={IconFiles} title={emptyTitle} description={emptyDescription} />;

  return (
    <>
      <div className="lec-card">
        {pages.map((page) => (
          <Link key={page.id} className="lec-list-row" to={buildPageUrl(page.space.slug, page.slugId, page.title)}>
            <Group gap={10} wrap="nowrap">
              <PageListIcon icon={page.icon} isBase={page.isBase} />
              <Text size="sm" fw={550} truncate>{getPageTitle(page.title, page.isBase, t)}</Text>
            </Group>
            <Badge size="sm" radius="sm" color="gray" variant="light">{page.space.name}</Badge>
            <Group gap={8} justify="flex-end" wrap="nowrap">
              <CustomAvatar name={page.lastUpdatedBy?.name || page.creator?.name || "Lec"} avatarUrl={page.lastUpdatedBy?.avatarUrl || page.creator?.avatarUrl} size={22} />
              <Text size="xs" c="dimmed">{formattedDate(page.updatedAt)}</Text>
            </Group>
          </Link>
        ))}
      </div>
      {hasNextPage && onLoadMore && (
        <Button variant="subtle" fullWidth mt="sm" onClick={onLoadMore} loading={fetchingNextPage}>{t("Load more")}</Button>
      )}
    </>
  );
}
