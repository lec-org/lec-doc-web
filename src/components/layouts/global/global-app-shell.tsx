import { AppShell, Container } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SettingsSidebar from "@/components/settings/settings-sidebar";
import {
  asideStateAtom,
  desktopSidebarAtom,
  mobileSidebarAtom,
  sidebarWidthAtom,
} from "@/components/layouts/global/hooks/atoms/sidebar-atom";
import { SpaceSidebar } from "@/features/space/components/sidebar/space-sidebar";
import { AppHeader } from "@/components/layouts/global/app-header";
import Aside from "@/components/layouts/global/aside";
import GlobalSidebar from "@/components/layouts/global/global-sidebar";
import { ASIDE_PANEL_ID } from "@/hooks/use-toggle-aside";
import { MAIN_CONTENT_ID, SkipToMain } from "@/components/ui/skip-to-main";
import classes from "./app-shell.module.css";

export default function GlobalAppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [mobileOpened] = useAtom(mobileSidebarAtom);
  const [desktopOpened] = useAtom(desktopSidebarAtom);
  const [{ isAsideOpen, tab: asideTab }] = useAtom(asideStateAtom);
  const [spaceSidebarWidth, setSpaceSidebarWidth] = useAtom(sidebarWidthAtom);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isSettingsRoute = location.pathname.startsWith("/settings");
  const isSpaceRoute = location.pathname.startsWith("/s/");
  const isPageRoute = location.pathname.includes("/p/");
  const secondaryWidth = isSpaceRoute ? spaceSidebarWidth : 236;

  useEffect(() => {
    const stop = () => setIsResizing(false);
    const resize = (event: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      const left = sidebarRef.current.getBoundingClientRect().left;
      setSpaceSidebarWidth(Math.min(480, Math.max(220, event.clientX - left)));
    };
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stop);
    };
  }, [isResizing, setSpaceSidebarWidth]);

  return (
    <>
      <SkipToMain />
      <AppShell
        className={classes.shell}
        header={{ height: 48 }}
        navbar={{
          width: secondaryWidth,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        aside={
          isPageRoute
            ? {
                width: 350,
                breakpoint: "sm",
                collapsed: { mobile: !isAsideOpen, desktop: !isAsideOpen },
              }
            : undefined
        }
        padding={0}
      >
        <AppShell.Header className={classes.header}>
          <AppHeader />
        </AppShell.Header>
        <AppShell.Navbar
          ref={sidebarRef}
          className={classes.navbar}
          withBorder={false}
          aria-label={
            isSpaceRoute
              ? t("Space navigation")
              : isSettingsRoute
                ? t("Settings navigation")
                : t("Main navigation")
          }
        >
          {isSpaceRoute && (
            <div className={classes.resizeHandle} onMouseDown={() => setIsResizing(true)} />
          )}
          {isSpaceRoute ? (
            <SpaceSidebar />
          ) : isSettingsRoute ? (
            <SettingsSidebar />
          ) : (
            <GlobalSidebar />
          )}
        </AppShell.Navbar>
        <AppShell.Main id={MAIN_CONTENT_ID} tabIndex={-1} className={classes.main}>
          {isSettingsRoute ? (
            <Container size={800} px={0} pb={80}>{children}</Container>
          ) : (
            children
          )}
        </AppShell.Main>
        {isPageRoute && (
          <AppShell.Aside
            id={ASIDE_PANEL_ID}
            tabIndex={-1}
            className={classes.aside}
            p="md"
            withBorder={false}
            aria-label={
              asideTab === "comments"
                ? t("Comments")
                : asideTab === "toc"
                  ? t("Table of contents")
                  : t("Details")
            }
          >
            <Aside />
          </AppShell.Aside>
        )}
      </AppShell>
    </>
  );
}
