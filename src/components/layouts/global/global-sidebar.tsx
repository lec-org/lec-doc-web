import { Text } from "@mantine/core";
import {
  IconClock,
  IconHome,
  IconLayoutGrid,
  IconSearch,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mobileSidebarAtom } from "./hooks/atoms/sidebar-atom";
import { useToggleSidebar } from "./hooks/hooks/use-toggle-sidebar";
import { platformModifierLabel } from "@/lib";
import { useGetSpacesQuery } from "@/features/space/queries/space-query";
import SpaceTree from "@/features/page/tree/components/space-tree";
import classes from "./global-sidebar.module.css";

const items = [
  { label: "Overview", icon: IconHome, path: "/home" },
  { label: "Spaces", icon: IconLayoutGrid, path: "/spaces" },
  { label: "Favorites", icon: IconStar, path: "/favorites" },
  { label: "Shared", icon: IconUsers, path: "/shared" },
  { label: "Recently updated", icon: IconClock, path: "/recent" },
];

export default function GlobalSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [mobileOpened] = useAtom(mobileSidebarAtom);
  const toggleMobile = useToggleSidebar(mobileSidebarAtom);
  const { data } = useGetSpacesQuery({ limit: 100 });
  const personalSpace = data?.items.find((space) => space.isDefaultPersonal);
  const closeMobile = () => mobileOpened && toggleMobile();

  return (
    <aside className={classes.navbar}>
      <div className={classes.heading}>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Lec Doc</Text>
      </div>
      <nav className={classes.section}>
        {items.map((item) => (
          <Link
            key={item.path}
            className={classes.link}
            data-active={pathname === item.path || undefined}
            to={item.path}
            onClick={closeMobile}
          >
            <item.icon className={classes.linkIcon} stroke={1.8} />
            <span>{t(item.label)}</span>
          </Link>
        ))}
        <Link className={classes.link} to="/search" onClick={closeMobile}>
          <IconSearch className={classes.linkIcon} stroke={1.8} />
          <span>{t("Search")}</span>
          <span className={classes.shortcut}>{platformModifierLabel}K</span>
        </Link>
      </nav>

      <div className={classes.divider} />
      <div className={classes.sectionHeader}>{t("Personal knowledge space")}</div>
      <div className={classes.personalTree} onClick={closeMobile}>
        {personalSpace ? (
          <SpaceTree
            spaceId={personalSpace.id}
            spaceSlug={personalSpace.slug}
            readOnly={false}
          />
        ) : (
          <Text size="xs" c="dimmed" px={10} py={6}>{t("No pages yet")}</Text>
        )}
      </div>
    </aside>
  );
}
