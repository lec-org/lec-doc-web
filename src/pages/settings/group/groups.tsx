import { Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import GroupList from "@/features/group/components/group-list";
import CreateGroupModal from "@/features/group/components/create-group-modal";
import SettingsTitle from "@/components/settings/settings-title";
import useUserRole from "@/hooks/use-user-role";
import { DocumentTitle } from "@/components/ui/document-title";

export default function Groups() {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();
  return (
    <>
      <DocumentTitle title={t("Groups")} />
      <SettingsTitle title={t("Groups")} description={t("Organize workspace members for easier space access management.")} />
      <Group mb="md" justify="flex-end">{isAdmin && <CreateGroupModal />}</Group>
      <div className="lec-card" style={{ padding: 16 }}><GroupList /></div>
    </>
  );
}
