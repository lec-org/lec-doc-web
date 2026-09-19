import React from "react";
import { Group, Text } from "@mantine/core";
import classes from "./auth.module.css";
import { getAssetUrl } from "@/lib/config";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Group justify="center" gap={8} className={classes.logo}>
        <img
          src={getAssetUrl("/icons/lec-doc.svg")}
          alt="Lec Doc"
          width={22}
          height={22}
        />
        <Text size="28px" fw={700} style={{ userSelect: "none" }}>
          Lec Doc
        </Text>
      </Group>
      <main>{children}</main>
    </>
  );
}
