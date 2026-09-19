import { useTranslation } from "react-i18next";
import HomeOverview from "@/features/home/components/home-overview";
import { DocumentTitle } from "@/components/ui/document-title";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <DocumentTitle title={t("Overview")} />
      <HomeOverview />
    </>
  );
}
