import { Text } from "@mantine/core";

export default function SettingsTitle({ title, description }: { title: string; description?: string }) {
  return (
    <header className="lec-page-header" style={{ marginTop: 40 }}>
      <div>
        <h1 className="lec-page-title">{title}</h1>
        {description && <Text className="lec-page-description">{description}</Text>}
      </div>
    </header>
  );
}
