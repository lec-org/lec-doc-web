import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlashMenuGroupedItemsType, SlashMenuItemType } from "./types";
import { ActionIcon, Group, Paper, ScrollArea, Text, UnstyledButton, VisuallyHidden } from "@mantine/core";
import classes from "./slash-menu.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const CommandList = ({ items, command }: {
  items: SlashMenuGroupedItemsType;
  command: (item: SlashMenuItemType) => void;
  editor: any;
  range: any;
}) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [countAnnouncement, setCountAnnouncement] = useState("");
  const [selectionAnnouncement, setSelectionAnnouncement] = useState("");
  const flatItems = useMemo(() => Object.values(items).flat(), [items]);
  const selectItem = useCallback((index: number) => {
    const item = flatItems[index];
    if (item) command(item);
  }, [command, flatItems]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowUp") setSelectedIndex((selectedIndex + flatItems.length - 1) % flatItems.length);
      if (event.key === "ArrowDown") setSelectedIndex((selectedIndex + 1) % flatItems.length);
      if (event.key === "Enter") selectItem(selectedIndex);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [flatItems.length, selectedIndex, selectItem]);

  useEffect(() => setSelectedIndex(0), [flatItems]);
  useEffect(() => {
    setCountAnnouncement(flatItems.length ? t("{{count}} command available", { count: flatItems.length }) : "");
  }, [flatItems.length, t]);
  useEffect(() => {
    const item = flatItems[selectedIndex];
    setSelectionAnnouncement(item ? `${t(item.title)}, ${t(item.description)}` : "");
  }, [selectedIndex, flatItems, t]);
  useEffect(() => {
    viewportRef.current?.querySelector(`[data-item-index="${selectedIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!flatItems.length) return null;
  let flatIndex = -1;
  return (
    <Paper id="slash-command" shadow="md" p="xs" withBorder role="listbox" aria-label={t("Slash commands")} aria-activedescendant={`slash-command-option-${selectedIndex}`}>
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">{countAnnouncement}</VisuallyHidden>
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">{selectionAnnouncement}</VisuallyHidden>
      <ScrollArea viewportRef={viewportRef} h={350} w={270} scrollbarSize={8} overscrollBehavior="contain">
        {Object.entries(items).map(([category, categoryItems]) => (
          <div key={category} role="group" aria-label={category}>
            <Text c="dimmed" mb={4} fw={500} tt="capitalize">{category}</Text>
            {categoryItems.map((item) => {
              flatIndex += 1;
              const itemIndex = flatIndex;
              return (
                <UnstyledButton
                  key={itemIndex}
                  data-item-index={itemIndex}
                  id={`slash-command-option-${itemIndex}`}
                  role="option"
                  aria-selected={itemIndex === selectedIndex}
                  onClick={() => selectItem(itemIndex)}
                  className={clsx(classes.menuBtn, { [classes.selectedItem]: itemIndex === selectedIndex })}
                >
                  <Group wrap="nowrap">
                    <ActionIcon variant="default" component="div" aria-hidden="true"><item.icon size={18} /></ActionIcon>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>{t(item.title)}</Text>
                      <Text c="dimmed" size="xs">{t(item.description)}</Text>
                    </div>
                  </Group>
                </UnstyledButton>
              );
            })}
          </div>
        ))}
      </ScrollArea>
    </Paper>
  );
};

export default CommandList;
