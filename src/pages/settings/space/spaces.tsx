import { Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import SettingsTitle from "@/components/settings/settings-title";
import SpaceList from "@/features/space/components/space-list";
import CreateSpaceModal from "@/features/space/components/create-space-modal";
import useUserRole from "@/hooks/use-user-role";
import { DocumentTitle } from "@/components/ui/document-title";

export default function Spaces() {
  const { t } = useTranslation();
  const { isAdmin } = useUserRole();
  return (
    <>
      <DocumentTitle title={t("Spaces")} />
      <SettingsTitle title={t("Spaces")} description={t("Manage project and team knowledge spaces.")} />
      <Group mb="md" justify="flex-end">{isAdmin && <CreateSpaceModal />}</Group>
      <div className="lec-card" style={{ padding: 16 }}><SpaceList /></div>
    </>
  );
}
