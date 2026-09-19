import React from "react";
import { Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconBrush,
  IconBuilding,
  IconLayoutGrid,
  IconSettings,
  IconShare3,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useUserRole from "@/hooks/use-user-role";
import { useSettingsNavigation } from "@/hooks/use-settings-navigation";
import classes from "./settings.module.css";

type Item = { label: string; icon: React.ElementType; path: string; admin?: boolean };
const groups: { heading: string; items: Item[] }[] = [
  {
    heading: "Personal",
    items: [
      { label: "Profile", icon: IconUser, path: "/settings/account/profile" },
      { label: "Preferences", icon: IconBrush, path: "/settings/account/preferences" },
    ],
  },
  {
    heading: "Workspace",
    items: [
      { label: "General", icon: IconBuilding, path: "/settings/workspace" },
      { label: "Members", icon: IconUsers, path: "/settings/members" },
      { label: "Groups", icon: IconUsersGroup, path: "/settings/groups" },
      { label: "Spaces", icon: IconLayoutGrid, path: "/settings/spaces" },
      { label: "Sharing", icon: IconShare3, path: "/settings/sharing", admin: true },
    ],
  },
];

export default function SettingsSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { goBack } = useSettingsNavigation();
  const { isAdmin } = useUserRole();

  return (
    <aside className={classes.navbar}>
      <button className={classes.back} type="button" onClick={goBack}>
        <IconArrowLeft size={16} /><span>{t("Back to workspace")}</span>
      </button>
      <div className={classes.title}><IconSettings size={17} /><Text fw={650} size="sm">{t("Settings")}</Text></div>
      {groups.map((group) => (
        <nav key={group.heading} className={classes.group} aria-label={t(group.heading)}>
          <div className={classes.linkHeader}>{t(group.heading)}</div>
          {group.items.map((item) => item.admin && !isAdmin ? null : (
            <Link
              className={classes.link}
              data-active={pathname === item.path || pathname.startsWith(`${item.path}/`) || undefined}
              key={item.path}
              to={item.path}
            >
              <item.icon className={classes.linkIcon} stroke={1.8} />
              <span>{t(item.label)}</span>
            </Link>
          ))}
        </nav>
      ))}
    </aside>
  );
}
