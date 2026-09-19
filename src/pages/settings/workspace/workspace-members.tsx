import { Alert, Space } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import SettingsTitle from "@/components/settings/settings-title";
import { DocumentTitle } from "@/components/ui/document-title";
import WorkspaceMembersTable from "@/features/workspace/components/members/components/workspace-members-table";

export default function WorkspaceMembers() {
  const { t } = useTranslation();
  return (
    <>
      <DocumentTitle title={t("Members")} />
      <SettingsTitle title={t("Members")} description={t("Workspace membership and roles are synchronized from Lec Core.")} />
      <Alert variant="light" color="blue" icon={<IconInfoCircle size={18} />}>
        {t("Manage tenant members and roles in LecIM. Space roles remain managed in Lec Doc.")}
      </Alert>
      <Space h="lg" />
      <div className="lec-card" style={{ padding: 16 }}><WorkspaceMembersTable /></div>
    </>
  );
}
