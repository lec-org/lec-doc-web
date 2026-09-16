import React, { useEffect, useState } from "react";
import { Group, Text, ScrollArea, ActionIcon } from "@mantine/core";
import {
  IconUser,
  IconSettings,
  IconUsers,
  IconArrowLeft,
  IconUsersGroup,
  IconSpaces,
  IconBrush,
  IconWorld,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import classes from "./settings.module.css";
import { useTranslation } from "react-i18next";
import useUserRole from "@/hooks/use-user-role.tsx";
import { useAtom } from "jotai";
import {
  prefetchGroups,
  prefetchShares,
  prefetchSpaces,
  prefetchWorkspaceMembers,
} from "@/components/settings/settings-queries.tsx";
import AppVersion from "@/components/settings/app-version.tsx";
import { mobileSidebarAtom } from "@/components/layouts/global/hooks/atoms/sidebar-atom.ts";
import { useToggleSidebar } from "@/components/layouts/global/hooks/hooks/use-toggle-sidebar.ts";
import { useSettingsNavigation } from "@/hooks/use-settings-navigation";

type DataItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  role?: "admin";
};

const groupedData: { heading: string; items: DataItem[] }[] = [
  {
    heading: "Account",
    items: [
      { label: "Profile", icon: IconUser, path: "/settings/account/profile" },
      { label: "Preferences", icon: IconBrush, path: "/settings/account/preferences" },
    ],
  },
  {
    heading: "Workspace",
    items: [
      { label: "General", icon: IconSettings, path: "/settings/workspace" },
      { label: "Members", icon: IconUsers, path: "/settings/members" },
      { label: "Groups", icon: IconUsersGroup, path: "/settings/groups" },
      { label: "Spaces", icon: IconSpaces, path: "/settings/spaces" },
      { label: "Public sharing", icon: IconWorld, path: "/settings/sharing", role: "admin" },
    ],
  },
];

export default function SettingsSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const { goBack } = useSettingsNavigation();
  const { isAdmin } = useUserRole();
  const [mobileSidebarOpened] = useAtom(mobileSidebarAtom);
  const toggleMobileSidebar = useToggleSidebar(mobileSidebarAtom);

  useEffect(() => setActive(location.pathname), [location.pathname]);

  const prefetch = (label: string) => {
    if (label === "Members") return prefetchWorkspaceMembers;
    if (label === "Spaces") return prefetchSpaces;
    if (label === "Groups") return prefetchGroups;
    if (label === "Public sharing") return prefetchShares;
    return undefined;
  };

  return (
    <div className={classes.navbar}>
      <Group className={classes.title} justify="flex-start">
        <ActionIcon
          onClick={() => {
            goBack();
            if (mobileSidebarOpened) toggleMobileSidebar();
          }}
          variant="transparent"
          c="gray"
          aria-label={t("Back")}
        >
          <IconArrowLeft stroke={2} />
        </ActionIcon>
        <Text fw={500}>{t("Settings")}</Text>
      </Group>

      <ScrollArea w="100%">
        {groupedData.map((group) => (
          <div key={group.heading}>
            <Text c="dimmed" className={classes.linkHeader}>{t(group.heading)}</Text>
            {group.items.map((item) =>
              item.role === "admin" && !isAdmin ? null : (
                <Link
                  onMouseEnter={prefetch(item.label)}
                  className={classes.link}
                  data-active={active.startsWith(item.path) || undefined}
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    if (mobileSidebarOpened) toggleMobileSidebar();
                  }}
                >
                  <item.icon className={classes.linkIcon} stroke={2} />
                  <span>{t(item.label)}</span>
                </Link>
              ),
            )}
          </div>
        ))}
      </ScrollArea>

      <AppVersion />
    </div>
  );
}
