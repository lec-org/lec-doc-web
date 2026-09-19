import { Divider, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import SettingsTitle from "@/components/settings/settings-title";
import { DocumentTitle } from "@/components/ui/document-title";
import AccountLanguage from "@/features/user/components/account-language";
import AccountTheme from "@/features/user/components/account-theme";
import PageWidthPref from "@/features/user/components/page-width-pref";
import PageEditPref from "@/features/user/components/page-state-pref";
import FixedToolbarPref from "@/features/user/components/fixed-toolbar-pref";
import NotificationPref from "@/features/user/components/notification-pref";

export default function AccountPreferences() {
  const { t } = useTranslation();
  return (
    <>
      <DocumentTitle title={t("Preferences")} />
      <SettingsTitle title={t("Preferences")} description={t("Tune the workspace to the way you like to work.")} />
      <Stack className="lec-card" gap={0} p="lg">
        <AccountTheme /><Divider my="md" /><AccountLanguage /><Divider my="md" /><PageWidthPref /><Divider my="md" /><PageEditPref /><Divider my="md" /><FixedToolbarPref /><Divider my="md" /><NotificationPref />
      </Stack>
    </>
  );
}
