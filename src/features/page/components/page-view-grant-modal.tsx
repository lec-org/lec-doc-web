import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGrantPageViewMutation } from "@/features/page/queries/page-query";

interface PageViewGrantModalProps {
  pageId: string;
  open: boolean;
  onClose: () => void;
}

interface GrantFormValues {
  subjectIssuer: string;
  subject: string;
  expectedVersion: number | string;
  expiresAt: string;
  operationId: string;
}

const initialValues = (): GrantFormValues => ({
  subjectIssuer: "",
  subject: "",
  expectedVersion: 1,
  expiresAt: "",
  operationId: crypto.randomUUID(),
});

export default function PageViewGrantModal({
  pageId,
  open,
  onClose,
}: PageViewGrantModalProps) {
  const { t } = useTranslation();
  const grant = useGrantPageViewMutation();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<GrantFormValues>({
    initialValues: initialValues(),
    validate: {
      subjectIssuer: (value) => {
        try {
          return new URL(value).protocol === "https:"
            ? null
            : t("OIDC issuer must use HTTPS");
        } catch {
          return t("Enter a valid OIDC issuer URL");
        }
      },
      subject: (value) => (value.trim() ? null : t("OIDC subject is required")),
      expectedVersion: (value) =>
        Number.isSafeInteger(Number(value)) &&
        Number(value) > 0 &&
        Number(value) < Number.MAX_SAFE_INTEGER
          ? null
          : t("Expected resource version must be a positive integer"),
      expiresAt: (value) =>
        value && new Date(value).getTime() <= Date.now()
          ? t("Expiration must be in the future")
          : null,
      operationId: (value) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value,
        )
          ? null
          : t("Enter a valid operation UUID"),
    },
  });

  useEffect(() => {
    if (open) {
      form.setValues(initialValues());
      form.clearErrors();
      grant.reset();
      setSubmitError("");
    }
  }, [open]);

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitError("");
    try {
      await grant.mutateAsync({
        pageId,
        subjectIssuer: values.subjectIssuer.trim(),
        subject: values.subject.trim(),
        expectedVersion: Number(values.expectedVersion),
        operationId: values.operationId.trim(),
        ...(values.expiresAt
          ? { expiresAt: new Date(values.expiresAt).toISOString() }
          : {}),
      });
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, t("Failed to grant view access")),
      );
    }
  });

  const close = () => {
    if (!grant.isPending) onClose();
  };

  return (
    <Modal.Root opened={open} onClose={close} size={520} yOffset="10vh">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={500}>{t("Grant view access")}</Modal.Title>
          <Modal.CloseButton
            aria-label={t("Close")}
            disabled={grant.isPending}
          />
        </Modal.Header>
        <Modal.Body>
          {grant.isSuccess ? (
            <Stack>
              <Alert color="green" role="status">
                {t("View access granted")}
              </Alert>
              <Text size="sm">
                {t("Operation UUID")}: {grant.data.operationId}
              </Text>
              <Group justify="flex-end">
                <Button onClick={onClose}>{t("Close")}</Button>
              </Group>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Text size="sm" c="dimmed" mb="md">
                {t(
                  "Grant this LecSSO identity view-only access to the current page.",
                )}
              </Text>
              <Stack>
                <TextInput
                  withAsterisk
                  label={t("OIDC issuer")}
                  placeholder="https://sso.example/oidc"
                  autoComplete="url"
                  disabled={grant.isPending}
                  errorProps={{ role: "alert" }}
                  {...form.getInputProps("subjectIssuer")}
                />
                <TextInput
                  withAsterisk
                  label={t("OIDC subject")}
                  autoComplete="off"
                  disabled={grant.isPending}
                  errorProps={{ role: "alert" }}
                  {...form.getInputProps("subject")}
                />
                <NumberInput
                  withAsterisk
                  label={t("Expected resource version")}
                  min={1}
                  step={1}
                  allowDecimal={false}
                  allowNegative={false}
                  disabled={grant.isPending}
                  errorProps={{ role: "alert" }}
                  {...form.getInputProps("expectedVersion")}
                />
                <TextInput
                  label={t("Expiration (optional)")}
                  type="datetime-local"
                  disabled={grant.isPending}
                  errorProps={{ role: "alert" }}
                  {...form.getInputProps("expiresAt")}
                />
                <TextInput
                  withAsterisk
                  label={t("Operation UUID")}
                  autoComplete="off"
                  disabled={grant.isPending}
                  errorProps={{ role: "alert" }}
                  {...form.getInputProps("operationId")}
                />
                {submitError && (
                  <Alert color="red" role="alert">
                    {submitError}
                  </Alert>
                )}
              </Stack>
              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={close}
                  disabled={grant.isPending}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" loading={grant.isPending}>
                  {t("Grant view access")}
                </Button>
              </Group>
            </form>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
