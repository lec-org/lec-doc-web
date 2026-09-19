import { Button, Divider, Modal, SegmentedControl, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { cloneElement, ReactElement, useState } from "react";
import { CreateSpaceForm } from "@/features/space/components/create-space-form.tsx";
import { useTranslation } from "react-i18next";
import useUserRole from "@/hooks/use-user-role";

export default function CreateSpaceModal({
  trigger,
}: {
  trigger?: ReactElement<{ onClick?: () => void }>;
}) {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();
  const [kind, setKind] = useState<"personal" | "team">(
    isAdmin ? "team" : "personal",
  );
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {trigger ? cloneElement(trigger, { onClick: open }) : (
        <Button onClick={open}>{t("Create space")}</Button>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={t("Create space")}
        closeButtonProps={{ "aria-label": t("Close") }}
      >
        <Divider size="xs" mb="xs" />
        <Stack gap="sm">
          {isAdmin && (
            <SegmentedControl
              value={kind}
              onChange={(value) => setKind(value as "personal" | "team")}
              data={[
                { value: "team", label: t("Team space") },
                { value: "personal", label: t("Personal space") },
              ]}
            />
          )}
          <CreateSpaceForm kind={kind} />
        </Stack>
      </Modal>
    </>
  );
}
