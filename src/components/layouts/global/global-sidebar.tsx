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
import { useFavoritesQuery } from "@/features/favorite/queries/favorite-query";
import { getSpaceUrl } from "@/lib/config";
import { platformModifierLabel } from "@/lib";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { AvatarIconType } from "@/features/attachments/types/attachment.types";
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
  const { data } = useFavoritesQuery("space");
  const favorites = (data?.pages.flatMap((page) => page.items) ?? [])
    .filter((favorite) => favorite.space)
    .slice(0, 5);
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
      <div className={classes.sectionHeader}>{t("Pinned spaces")}</div>
      <div className={classes.section}>
        {favorites.length ? (
          favorites.map((favorite) => (
            <Link
              key={favorite.id}
              className={classes.spaceItem}
              to={getSpaceUrl(favorite.space!.slug)}
              onClick={closeMobile}
            >
              <CustomAvatar
                name={favorite.space!.name}
                avatarUrl={favorite.space!.logo}
                type={AvatarIconType.SPACE_ICON}
                color="initials"
                variant="filled"
                size={22}
              />
              <Text size="sm" truncate>{favorite.space!.name}</Text>
            </Link>
          ))
        ) : (
          <Text size="xs" c="dimmed" px={10} py={6}>{t("Favorite spaces appear here")}</Text>
        )}
      </div>
    </aside>
  );
}
