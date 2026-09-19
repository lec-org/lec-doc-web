import { Badge, Group, Skeleton, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import DOMPurify from "dompurify";
import { useDebouncedValue } from "@mantine/hooks";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DocumentTitle } from "@/components/ui/document-title";
import { EmptyState } from "@/components/ui/empty-state";
import { useUnifiedSearch } from "@/features/search/hooks/use-unified-search";
import { SearchSpotlightFilters } from "@/features/search/components/search-spotlight-filters";
import { buildPageUrl } from "@/features/page/page.utils";
import { getPageIcon } from "@/lib";
import { timeAgo } from "@/lib/time";

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [debounced] = useDebouncedValue(query, 250);
  const [filters, setFilters] = useState<{
    spaceId?: string | null;
    creatorId?: string | null;
    labelIds?: string[];
    titleOnly?: boolean;
  }>({});
  const handleFilters = useCallback((value: typeof filters) => setFilters(value), []);
  const results = useUnifiedSearch({
    query: debounced,
    ...(filters.spaceId ? { spaceId: filters.spaceId } : {}),
    ...(filters.creatorId ? { creatorId: filters.creatorId } : {}),
    ...(filters.labelIds?.length ? { labelIds: filters.labelIds } : {}),
    ...(filters.titleOnly ? { titleOnly: true } : {}),
  });

  return (
    <div className="lec-page lec-page--narrow">
      <DocumentTitle title={t("Search")} />
      <header className="lec-page-header"><div><h1 className="lec-page-title">{t("Search")}</h1><p className="lec-page-description">{t("Search across documents, spaces, and people.")}</p></div></header>
      <TextInput
        size="md"
        radius="md"
        leftSection={<IconSearch size={18} />}
        placeholder={t("Search documents, spaces, or people")}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        autoFocus
      />
      <div style={{ marginTop: 12 }}><SearchSpotlightFilters onFiltersChange={handleFilters} /></div>
      <div className="lec-section">
        {results.isFetching ? (
          <div className="lec-card" style={{ display: "grid", gap: 10, padding: 16 }}>{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} h={42} />)}</div>
        ) : results.data?.length ? (
          <div className="lec-card">
            {results.data.map((result) => (
              <Link className="lec-list-row" key={result.id} to={buildPageUrl(result.space.slug, result.slugId, result.title, undefined, result.matchedText, result.wholeWord)}>
                <Group gap={10} wrap="nowrap"><span>{getPageIcon(result.icon)}</span><div><Text size="sm" fw={550}>{result.title || t("Untitled")}</Text>{result.highlight && <Text size="xs" c="dimmed" lineClamp={1} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.highlight, { ALLOWED_TAGS: ["mark", "em", "strong", "b"], ALLOWED_ATTR: [] }) }} />}</div></Group>
                <Badge size="sm" color="gray" variant="light">{result.space.name}</Badge>
                <Text size="xs" c="dimmed" ta="right">{timeAgo(result.updatedAt)}</Text>
              </Link>
            ))}
          </div>
        ) : query ? (
          <EmptyState icon={IconSearch} title={t("No results found")} description={t("Try a different keyword or filter.")} />
        ) : (
          <EmptyState icon={IconSearch} title={t("Start searching")} description={t("Enter a keyword to find content across your workspace.")} />
        )}
      </div>
    </div>
  );
}
