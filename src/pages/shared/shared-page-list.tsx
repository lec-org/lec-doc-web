import { Badge, Group, Skeleton, Text } from "@mantine/core";
import { IconShare3 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DocumentTitle } from "@/components/ui/document-title";
import { EmptyState } from "@/components/ui/empty-state";
import { PageListIcon } from "@/components/common/page-list-icon";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { useGetSharesQuery } from "@/features/share/queries/share-query";
import { buildPageUrl } from "@/features/page/page.utils";
import { formattedDate } from "@/lib/time";

export default function SharedPageList() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetSharesQuery({ limit: 50 });
  const shares = data?.items ?? [];
  return (
    <div className="lec-page lec-page--narrow">
      <DocumentTitle title={t("Shared")} />
      <header className="lec-page-header">
        <div><h1 className="lec-page-title">{t("Shared")}</h1><p className="lec-page-description">{t("Public links created from spaces you can access.")}</p></div>
      </header>
      {isLoading ? (
        <div className="lec-card" style={{ display: "grid", gap: 10, padding: 16 }}>{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} h={36} />)}</div>
      ) : shares.length ? (
        <div className="lec-card">
          {shares.map((share) => (
            <Link key={share.id} className="lec-list-row" to={buildPageUrl(share.space.slug, share.page.slugId, share.page.title)}>
              <Group gap={10} wrap="nowrap"><PageListIcon icon={share.page.icon} /><Text size="sm" fw={550} truncate>{share.page.title || t("Untitled")}</Text></Group>
              <Badge size="sm" radius="sm" variant="light" color="gray">{share.space.name}</Badge>
              <Group gap={8} justify="flex-end" wrap="nowrap"><CustomAvatar name={share.creator.name} avatarUrl={share.creator.avatarUrl} size={22} /><Text size="xs" c="dimmed">{formattedDate(new Date(share.updatedAt))}</Text></Group>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={IconShare3} title={t("Nothing shared yet")} description={t("Shared documents will appear here.")} />
      )}
    </div>
  );
}
