import { Modal, Button, Group, Text, Select, Switch, Divider } from "@mantine/core";
import { exportPage } from "@/features/page/services/page-service.ts";
import { useState } from "react";
import { ExportFormat } from "@/features/page/types/page.types.ts";
import { notifications } from "@mantine/notifications";
import { exportSpace } from "@/features/space/services/space-service";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api-error.ts";

interface ExportModalProps {
  id: string;
  type: "space" | "page";
  open: boolean;
  onClose: () => void;
}

export default function ExportModal({ id, type, open, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.Markdown);
  const [includeChildren, setIncludeChildren] = useState(false);
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (type === "page") {
        await exportPage({ pageId: id, format, includeChildren, includeAttachments });
      } else {
        await exportSpace({ spaceId: id, format, includeAttachments });
      }
      notifications.show({ message: t("Export successful") });
      onClose();
    } catch (err) {
      notifications.show({ message: getApiErrorMessage(err, t("Export failed")), color: "red" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal.Root opened={open} onClose={onClose} size={500} padding="xl" yOffset="10vh" xOffset={0} mah={400} onClick={(e) => e.stopPropagation()}>
      <Modal.Overlay />
      <Modal.Content style={{ overflow: "hidden" }}>
        <Modal.Header py={0}>
          <Modal.Title fw={500}>{t(`Export ${type}`)}</Modal.Title>
          <Modal.CloseButton aria-label={t("Close")} />
        </Modal.Header>
        <Modal.Body>
          <Group justify="space-between" wrap="nowrap">
            <Text size="md">{t("Format")}</Text>
            <Select
              data={[
                { value: ExportFormat.Markdown, label: "Markdown" },
                { value: ExportFormat.HTML, label: "HTML" },
              ]}
              defaultValue={format}
              onChange={(value) => setFormat(value as ExportFormat)}
              styles={{ wrapper: { maxWidth: 140 } }}
              comboboxProps={{ width: 200 }}
              allowDeselect={false}
              withCheckIcon={false}
              aria-label={t("Select export format")}
            />
          </Group>

          {type === "page" && (
            <>
              <Divider my="sm" />
              <Group justify="space-between" wrap="nowrap">
                <Text size="md">{t("Include subpages")}</Text>
                <Switch onChange={(event) => setIncludeChildren(event.currentTarget.checked)} checked={includeChildren} />
              </Group>
              <Group justify="space-between" wrap="nowrap" mt="md">
                <Text size="md">{t("Include attachments")}</Text>
                <Switch onChange={(event) => setIncludeAttachments(event.currentTarget.checked)} checked={includeAttachments} />
              </Group>
            </>
          )}

          {type === "space" && (
            <>
              <Divider my="sm" />
              <Group justify="space-between" wrap="nowrap">
                <Text size="md">{t("Include attachments")}</Text>
                <Switch onChange={(event) => setIncludeAttachments(event.currentTarget.checked)} checked={includeAttachments} />
              </Group>
            </>
          )}

          <Group justify="center" mt="md">
            <Button onClick={onClose} variant="default">{t("Cancel")}</Button>
            <Button onClick={handleExport} loading={isExporting}>{t("Export")}</Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
