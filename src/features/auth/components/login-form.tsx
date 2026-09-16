import { Box, Button, Container, Text, Title } from "@mantine/core";
import { AuthLayout } from "./auth-layout";
import classes from "./auth.module.css";

export function LoginForm() {
  return (
    <AuthLayout>
      <Container size={420} className={classes.container}>
        <Box p="xl" className={classes.containerBox}>
          <Title order={1} size="h2" ta="center" mb="md">
            登录 Lec Doc
          </Title>
          <Text c="dimmed" ta="center" mb="xl">
            使用 Lec 账号访问组织文档。
          </Text>
          <Button component="a" href="/api/auth/oidc/login" fullWidth>
            使用 LecSSO 登录
          </Button>
        </Box>
      </Container>
    </AuthLayout>
  );
}
