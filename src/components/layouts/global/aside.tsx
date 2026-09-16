import { ActionIcon, Box, Group, ScrollArea, Title, Tooltip } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import { asideStateAtom } from "@/components/layouts/global/hooks/atoms/sidebar-atom.ts";
import { lazy, ReactNode, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { pageEditorAtom } from "@/features/editor/atoms/editor-atoms.ts";
import { ASIDE_PANEL_ID } from "@/hooks/use-toggle-aside.tsx";

const CommentListWithTabs = lazy(
  () => import("@/features/comment/components/comment-list-with-tabs.tsx"),
);
const TableOfContents = lazy(() =>
  import("@/features/editor/components/table-of-contents/table-of-contents.tsx").then(
    (m) => ({ default: m.TableOfContents }),
  ),
);
const PageDetailsAside = lazy(() =>
  import("@/features/page-details/components/page-details-aside.tsx").then(
    (m) => ({ default: m.PageDetailsAside }),
  ),
);

export default function Aside() {
  const [{ tab, isAsideOpen }, setAsideState] = useAtom(asideStateAtom);
  const { t } = useTranslation();
  const pageEditor = useAtomValue(pageEditorAtom);
  const closeAside = () => setAsideState((state) => ({ ...state, isAsideOpen: false }));

  useEffect(() => {
    if (isAsideOpen) document.getElementById(ASIDE_PANEL_ID)?.focus();
  }, [isAsideOpen, tab]);

  let title: string | null = null;
  let component: ReactNode = null;
  if (tab === "comments") {
    component = <CommentListWithTabs />;
    title = "Comments";
  } else if (tab === "toc") {
    component = <TableOfContents editor={pageEditor} />;
    title = "Table of contents";
  } else if (tab === "details") {
    component = <PageDetailsAside />;
    title = "Details";
  }

  return (
    <Box p="md" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {component && (
        <>
          <Group justify="space-between" wrap="nowrap" mb="md">
            <Title order={2} size="h6" fw={500}>{t(title)}</Title>
            <Tooltip label={t("Close")} withArrow>
              <ActionIcon variant="subtle" color="gray" onClick={closeAside} aria-label={t("Close")}>
                <IconX size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Suspense fallback={null}>
            {tab === "comments" ? component : (
              <ScrollArea style={{ height: "85vh" }} scrollbarSize={5} type="scroll">
                <div style={{ paddingBottom: "200px" }}>{component}</div>
              </ScrollArea>
            )}
          </Suspense>
        </>
      )}
    </Box>
  );
}
