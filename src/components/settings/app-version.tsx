import classes from "@/components/settings/settings.module.css";
import { Text } from "@mantine/core";

export default function AppVersion() {
  return (
    <div className={classes.text}>
      <Text size="sm" c="dimmed">
        {APP_VERSION ? `Lec Doc v${APP_VERSION}` : "Lec Doc"}{" · "}
        <a
          href={`https://github.com/lec-org/lec-doc-web/tree/${encodeURIComponent(APP_SOURCE_REF)}`}
          target="_blank"
          rel="noreferrer"
        >
          AGPL source
        </a>
      </Text>
    </div>
  );
}
