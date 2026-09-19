import { ActionIcon, Tooltip } from "@mantine/core";
import {
  IconClock,
  IconHome,
  IconLayoutGrid,
  IconSearch,
  IconSettings,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classes from "./icon-sidebar.module.css";
import { getAssetUrl } from "@/lib/config";

const items = [
  { label: "Overview", icon: IconHome, path: "/home" },
  { label: "Spaces", icon: IconLayoutGrid, path: "/spaces" },
  { label: "Favorites", icon: IconStar, path: "/favorites" },
  { label: "Shared", icon: IconUsers, path: "/shared" },
  { label: "Recently updated", icon: IconClock, path: "/recent" },
];

export default function IconSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const activePath = pathname.startsWith("/s/") ? "/spaces" : pathname;

  return (
    <nav className={classes.rail} aria-label={t("Main navigation")}>
      <Link className={classes.logo} to="/home" aria-label="Lec Doc">
        <img src={getAssetUrl("/icons/lec-doc.svg")} width={27} height={27} alt="" />
      </Link>
      <div className={classes.items}>
        {items.map((item) => (
          <Tooltip key={item.path} label={t(item.label)} position="right" withArrow>
            <ActionIcon
              component={Link}
              to={item.path}
              variant="subtle"
              size={38}
              className={classes.item}
              data-active={activePath === item.path || undefined}
              aria-label={t(item.label)}
              aria-current={activePath === item.path ? "page" : undefined}
            >
              <item.icon size={19} stroke={1.8} />
            </ActionIcon>
          </Tooltip>
        ))}
        <Tooltip label={t("Search")} position="right" withArrow>
          <ActionIcon
            component={Link}
            to="/search"
            variant="subtle"
            size={38}
            className={classes.item}
            data-active={activePath === "/search" || undefined}
            aria-label={t("Search")}
          >
            <IconSearch size={19} stroke={1.8} />
          </ActionIcon>
        </Tooltip>
      </div>
      <Tooltip label={t("Settings")} position="right" withArrow>
        <ActionIcon
          component={Link}
          to="/settings/account/profile"
          variant="subtle"
          size={38}
          className={classes.item}
          data-active={pathname.startsWith("/settings") || undefined}
          aria-label={t("Settings")}
        >
          <IconSettings size={19} stroke={1.8} />
        </ActionIcon>
      </Tooltip>
    </nav>
  );
}
