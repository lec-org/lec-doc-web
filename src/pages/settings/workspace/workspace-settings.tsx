import { Divider, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import SettingsTitle from "@/components/settings/settings-title";
import { DocumentTitle } from "@/components/ui/document-title";
import WorkspaceNameForm from "@/features/workspace/components/settings/components/workspace-name-form";
import WorkspaceIcon from "@/features/workspace/components/settings/components/workspace-icon";
import WorkspaceDefaultPageEditMode from "@/features/workspace/components/settings/components/workspace-default-page-edit-mode";
import AllowPublicSpaces from "@/features/workspace/components/settings/components/allow-public-spaces";
import { isBetaPublicSpaces } from "@/lib/config";

export default function WorkspaceSettings() {
  const { t } = useTranslation();
  return (
    <>
      <DocumentTitle title={t("Workspace settings")} />
      <SettingsTitle title={t("General")} description={t("Manage workspace identity and document defaults.")} />
      <Stack className="lec-card" gap={0} p="lg">
        <WorkspaceIcon /><Divider my="md" /><WorkspaceNameForm />
        {isBetaPublicSpaces() && <><Divider my="md" /><AllowPublicSpaces /></>}
        <Divider my="md" /><WorkspaceDefaultPageEditMode />
      </Stack>
    </>
  );
}
