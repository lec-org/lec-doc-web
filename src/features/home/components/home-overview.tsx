import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Skeleton,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconDots,
  IconFileDescription,
  IconFilePlus,
  IconFolderPlus,
  IconLayoutGridAdd,
  IconUpload,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/features/user/atoms/current-user-atom";
import { useRecentChangesQuery } from "@/features/page/queries/page-query";
import { useGetSpacesQuery } from "@/features/space/queries/space-query";
import { buildPageUrl, getPageTitle } from "@/features/page/page.utils";
import { getSpaceUrl } from "@/lib/config";
import { formattedDate } from "@/lib/time";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { PageListIcon } from "@/components/common/page-list-icon";
import CreateSpaceModal from "@/features/space/components/create-space-modal";
import classes from "./home-overview.module.css";

export default function HomeOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentUser] = useAtom(currentUserAtom);
  const recentQuery = useRecentChangesQuery();
  const spacesQuery = useGetSpacesQuery({ limit: 6 });
  const recent = recentQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const spaces = spacesQuery.data?.items ?? [];
  const greeting = currentUser?.user?.name?.trim() || t("there");

  const createFirstPage = () => {
    if (spaces[0]) navigate(getSpaceUrl(spaces[0].slug));
    else navigate("/spaces");
  };

  return (
    <div className={classes.page}>
      <section className={classes.hero}>
        <div>
          <Text className={classes.eyebrow}>{t("Workspace overview")}</Text>
          <h1 className="lec-page-title">{t("Welcome back")}, {greeting}</h1>
          <p className="lec-page-description">
            {t("Pick up where you left off, or start something new.")}
          </p>
        </div>
        <Button leftSection={<IconFilePlus size={17} />} onClick={createFirstPage}>
          {t("New page")}
        </Button>
      </section>

      <section className="lec-section">
        <div className="lec-section-heading">
          <h2 className="lec-section-title">{t("Quick start")}</h2>
        </div>
        <div className={classes.quickGrid}>
          <button className={`${classes.quickCard} lec-card lec-card--interactive`} onClick={createFirstPage}>
            <span className={classes.quickIcon}><IconFileDescription size={20} /></span>
            <span><strong>{t("Blank document")}</strong><small>{t("Start with an empty page")}</small></span>
          </button>
          <button className={`${classes.quickCard} lec-card lec-card--interactive`} onClick={() => navigate("/spaces")}>
            <span className={classes.quickIcon}><IconFolderPlus size={20} /></span>
            <span><strong>{t("Browse spaces")}</strong><small>{t("Find a home for your work")}</small></span>
          </button>
          <button className={`${classes.quickCard} lec-card lec-card--interactive`} onClick={() => navigate("/spaces")}>
            <span className={classes.quickIcon}><IconUpload size={20} /></span>
            <span><strong>{t("Import content")}</strong><small>{t("Import from inside a space")}</small></span>
          </button>
          <CreateSpaceModal
            trigger={
              <button className={`${classes.quickCard} lec-card lec-card--interactive`}>
                <span className={classes.quickIcon}><IconLayoutGridAdd size={20} /></span>
                <span><strong>{t("Create space")}</strong><small>{t("Set up a private knowledge area")}</small></span>
              </button>
            }
          />
        </div>
      </section>

      <section className="lec-section">
        <div className="lec-section-heading">
          <h2 className="lec-section-title">{t("Recent documents")}</h2>
          <Button variant="subtle" size="compact-sm" component={Link} to="/recent">{t("View all")}</Button>
        </div>
        <div className="lec-card">
          {recentQuery.isLoading ? (
            <div className={classes.loading}>{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} h={36} />)}</div>
          ) : recent.length ? (
            recent.slice(0, 8).map((page) => (
              <Link
                className="lec-list-row"
                key={page.id}
                to={buildPageUrl(page.space.slug, page.slugId, page.title)}
              >
                <Group gap={10} wrap="nowrap">
                  <PageListIcon icon={page.icon} isBase={page.isBase} />
                  <Text size="sm" fw={550} truncate>{getPageTitle(page.title, page.isBase, t)}</Text>
                </Group>
                <Badge size="sm" radius="sm" variant="light" color="gray">{page.space.name}</Badge>
                <Group gap={8} justify="flex-end" wrap="nowrap">
                  <CustomAvatar name={page.lastUpdatedBy?.name || page.creator?.name || "Lec"} avatarUrl={page.lastUpdatedBy?.avatarUrl || page.creator?.avatarUrl} size={22} />
                  <Text size="xs" c="dimmed" visibleFrom="sm">{formattedDate(page.updatedAt)}</Text>
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <Tooltip label={t("More")}>
                        <ActionIcon variant="subtle" size={26} onClick={(event) => event.preventDefault()}>
                          <IconDots size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Menu.Target>
                    <Menu.Dropdown><Menu.Item>{t("Open document")}</Menu.Item></Menu.Dropdown>
                  </Menu>
                </Group>
              </Link>
            ))
          ) : (
            <Text size="sm" c="dimmed" p="xl" ta="center">{t("No recent documents yet")}</Text>
          )}
        </div>
      </section>

      <section className="lec-section">
        <div className="lec-section-heading">
          <h2 className="lec-section-title">{t("Spaces")}</h2>
          <Button variant="subtle" size="compact-sm" component={Link} to="/spaces">{t("View all")}</Button>
        </div>
        <div className={classes.spaceGrid}>
          {spaces.map((space) => (
            <Link className={`${classes.spaceCard} lec-card lec-card--interactive`} key={space.id} to={getSpaceUrl(space.slug)}>
              <CustomAvatar name={space.name} avatarUrl={space.logo} size={34} radius={9} variant="filled" />
              <div><Text fw={600} size="sm" truncate>{space.name}</Text><Text size="xs" c="dimmed" lineClamp={2}>{space.description || t("Team knowledge space")}</Text></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
