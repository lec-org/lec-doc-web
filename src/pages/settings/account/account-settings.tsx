import { Group, Stack, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import SettingsTitle from "@/components/settings/settings-title";
import { DocumentTitle } from "@/components/ui/document-title";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { currentUserAtom } from "@/features/user/atoms/current-user-atom";
import SessionList from "@/features/session/components/session-list";

export default function AccountSettings() {
  const { t } = useTranslation();
  const user = useAtomValue(currentUserAtom)?.user;
  return (
    <>
      <DocumentTitle title={t("My Profile")} />
      <SettingsTitle title={t("My Profile")} description={t("Your identity is synchronized from Lec Core.")} />
      {user && (
        <section className="lec-card" style={{ padding: 20 }}>
          <Group align="flex-start" gap="lg" wrap="nowrap">
            <CustomAvatar avatarUrl={user.avatarUrl} name={user.name} size={64} radius={16} />
            <Stack gap={12} style={{ minWidth: 0 }}>
              <div><Text size="xs" c="dimmed" fw={600}>{t("Name")}</Text><Text fw={550}>{user.name}</Text></div>
              <div><Text size="xs" c="dimmed" fw={600}>{t("Email")}</Text><Text>{user.email}</Text></div>
              <Text size="xs" c="dimmed">{t("Profile is synced from Lec Core. Change your name and avatar in LecIM Desktop.")}</Text>
            </Stack>
          </Group>
        </section>
      )}
      <section className="lec-section"><div className="lec-section-heading"><h2 className="lec-section-title">{t("Sessions")}</h2></div><div className="lec-card" style={{ padding: 16 }}><SessionList /></div></section>
    </>
  );
}
