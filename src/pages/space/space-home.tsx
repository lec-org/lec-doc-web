import { Button, Group, Text } from "@mantine/core";
import { IconFilePlus } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SpaceHomeTabs from "@/features/space/components/space-home-tabs";
import SpacePublicNotice from "@/features/public-space/components/space-public-notice";
import { useGetSpaceBySlugQuery } from "@/features/space/queries/space-query";
import { useTreeMutation } from "@/features/page/tree/hooks/use-tree-mutation";
import { CustomAvatar } from "@/components/ui/custom-avatar";
import { AvatarIconType } from "@/features/attachments/types/attachment.types";
import { DocumentTitle } from "@/components/ui/document-title";

export default function SpaceHome() {
  const { t } = useTranslation();
  const { spaceSlug } = useParams();
  const { data: space } = useGetSpaceBySlugQuery(spaceSlug);
  const { handleCreate } = useTreeMutation(space?.id ?? "");

  return (
    <div className="lec-page lec-page--narrow">
      <DocumentTitle title={space?.name || t("Overview")} />
      {space && <SpacePublicNotice space={space} />}
      <header className="lec-page-header">
        <Group gap={14} wrap="nowrap">
          {space && <CustomAvatar name={space.name} avatarUrl={space.logo} type={AvatarIconType.SPACE_ICON} size={42} radius={10} variant="filled" />}
          <div><h1 className="lec-page-title">{space?.name || t("Overview")}</h1>{space?.description && <Text className="lec-page-description">{space.description}</Text>}</div>
        </Group>
        {space && <Button leftSection={<IconFilePlus size={17} />} onClick={() => handleCreate(null)}>{t("New page")}</Button>}
      </header>
      {space && <SpaceHomeTabs />}
    </div>
  );
}
