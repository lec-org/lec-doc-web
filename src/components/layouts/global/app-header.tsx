import {
  ActionIcon,
  Box,
  Button,
  Group,
  Menu,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronDown,
  IconFilePlus,
  IconLayoutGridAdd,
  IconMenu2,
  IconPlus,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  desktopSidebarAtom,
  mobileSidebarAtom,
} from "@/components/layouts/global/hooks/atoms/sidebar-atom";
import { useToggleSidebar } from "@/components/layouts/global/hooks/hooks/use-toggle-sidebar";
import { searchSpotlight } from "@/features/search/constants";
import { platformModifierLabel } from "@/lib";
import { useGetSpaceBySlugQuery } from "@/features/space/queries/space-query";
import { usePageQuery } from "@/features/page/queries/page-query";
import { useTreeMutation } from "@/features/page/tree/hooks/use-tree-mutation";
import { extractPageSlugId } from "@/lib";
import CreateSpaceModal from "@/features/space/components/create-space-modal";
import { NotificationPopover } from "@/features/notification/components/notification-popover";
import TopMenu from "./top-menu";
import classes from "./app-header.module.css";

const pageNames: Record<string, string> = {
  "/home": "Overview",
  "/spaces": "Spaces",
  "/favorites": "Favorites",
  "/shared": "Shared",
  "/recent": "Recently updated",
  "/search": "Search",
};

export function AppHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { spaceSlug, pageSlug } = useParams();
  const { data: page } = usePageQuery({ pageId: extractPageSlugId(pageSlug) });
  const { data: space } = useGetSpaceBySlugQuery(spaceSlug ?? page?.spaceId);
  const { handleCreate } = useTreeMutation(space?.id ?? "");
  const [mobileOpened] = useAtom(mobileSidebarAtom);
  const [desktopOpened] = useAtom(desktopSidebarAtom);
  const toggleMobile = useToggleSidebar(mobileSidebarAtom);
  const toggleDesktop = useToggleSidebar(desktopSidebarAtom);
  const label = pathname.startsWith("/settings")
    ? t("Settings")
    : space?.name || t(pageNames[pathname] || "Lec Doc");

  return (
    <header className={classes.header}>
      <Group gap={8} wrap="nowrap" className={classes.context}>
        <Tooltip label={t("Sidebar toggle")}>
          <ActionIcon
            variant="subtle"
            size={32}
            onClick={toggleMobile}
            hiddenFrom="sm"
            aria-label={t("Sidebar toggle")}
          >
            <IconMenu2 size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t("Sidebar toggle")}>
          <ActionIcon
            variant="subtle"
            size={32}
            onClick={toggleDesktop}
            visibleFrom="sm"
            aria-label={t("Sidebar toggle")}
            data-opened={desktopOpened}
          >
            <IconMenu2 size={18} />
          </ActionIcon>
        </Tooltip>
        <Text size="sm" fw={600} truncate>{label}</Text>
      </Group>

      <button className={classes.search} type="button" onClick={() => navigate("/search")}>
        <span>{t("Search documents, spaces, or people")}</span>
        <Box component="span" className="lec-kbd">{platformModifierLabel} K</Box>
      </button>

      <Group gap={8} wrap="nowrap" justify="flex-end" className={classes.actions}>
        <Menu position="bottom-end" width={210} shadow="md">
          <Menu.Target>
            <Button
              leftSection={<IconPlus size={16} />}
              rightSection={<IconChevronDown size={14} />}
              size="xs"
              className={classes.createButton}
            >
              {t("Create")}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {space && (
              <Menu.Item
                leftSection={<IconFilePlus size={17} />}
                onClick={() => handleCreate(null)}
              >
                {t("New page")}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconLayoutGridAdd size={17} />} closeMenuOnClick={false}>
              <CreateSpaceModal
                trigger={
                  <Box component="span" style={{ display: "block", width: "100%" }}>
                    {t("Create space")}
                  </Box>
                }
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Box visibleFrom="sm">
          <NotificationPopover />
        </Box>
        <TopMenu />
      </Group>
    </header>
  );
}
