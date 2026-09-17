import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  NativeSelect,
  Radio,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useClassifyPageMutation,
  useRequestPageAccessMutation,
  useReviewPageAccessMutation,
  useRevokePageAccessMutation,
  useRevokePageGrantMutation,
  useTransferPageOwnerMutation,
} from "@/features/page/queries/page-query";

export type PageControlAction =
  | "classify"
  | "transfer-owner"
  | "revoke-grant"
  | "request-access"
  | "review-access"
  | "revoke-access";

interface PageControlModalProps {
  action: PageControlAction | null;
  pageId: string;
  onClose: () => void;
}

interface FormValues {
  classification: string;
  ownerUserId: string;
  grantId: string;
  reason: string;
  accessRequestId: string;
  decision: "APPROVE" | "REJECT";
  expiresAt: string;
  expectedVersion: number | string;
  operationId: string;
}

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const managedActions: PageControlAction[] = [
  "classify",
  "transfer-owner",
  "revoke-grant",
  "review-access",
  "revoke-access",
];

const initialValues = (): FormValues => ({
  classification: "1",
  ownerUserId: "",
  grantId: "",
  reason: "",
  accessRequestId: "",
  decision: "APPROVE",
  expiresAt: "",
  expectedVersion: 1,
  operationId: crypto.randomUUID(),
});

export default function PageControlModal({
  action,
  pageId,
  onClose,
}: PageControlModalProps) {
  const { t } = useTranslation();
  const mutations = {
    classify: useClassifyPageMutation(),
    "transfer-owner": useTransferPageOwnerMutation(),
    "revoke-grant": useRevokePageGrantMutation(),
    "request-access": useRequestPageAccessMutation(),
    "review-access": useReviewPageAccessMutation(),
    "revoke-access": useRevokePageAccessMutation(),
  };
  const mutation = action ? mutations[action] : null;
  const [submitError, setSubmitError] = useState("");
  const form = useForm<FormValues>({
    initialValues: initialValues(),
    validate: {
      ownerUserId: (value) =>
        action === "transfer-owner" && !UUID.test(value.trim())
          ? t("Enter a valid owner user UUID")
          : null,
      grantId: (value) =>
        action === "revoke-grant" && !UUID.test(value.trim())
          ? t("Enter a valid grant UUID")
          : null,
      reason: (value) => {
        if (action !== "request-access") return null;
        const reason = value.trim();
        if (!reason) return t("Access reason is required");
        return [...reason].length > 1000
          ? t("Access reason must be 1000 characters or fewer")
          : null;
      },
      accessRequestId: (value) =>
        ["review-access", "revoke-access"].includes(action ?? "") &&
        !UUID.test(value.trim())
          ? t("Enter a valid access request UUID")
          : null,
      expectedVersion: (value) =>
        action &&
        managedActions.includes(action) &&
        (!Number.isSafeInteger(Number(value)) ||
          Number(value) < 1 ||
          Number(value) >= Number.MAX_SAFE_INTEGER)
          ? t("Expected resource version must be a positive integer")
          : null,
      operationId: (value) =>
        action && managedActions.includes(action) && !UUID.test(value.trim())
          ? t("Enter a valid operation UUID")
          : null,
      expiresAt: (value, values) =>
        action === "review-access" &&
        values.decision === "APPROVE" &&
        (!value || new Date(value).getTime() <= Date.now())
          ? t("Approval expiration must be in the future")
          : null,
    },
  });

  useEffect(() => {
    if (action) {
      form.setValues(initialValues());
      form.clearErrors();
      mutation?.reset();
      setSubmitError("");
    }
  }, [action]);

  if (!action || !mutation) return null;

  const titles: Record<PageControlAction, string> = {
    classify: t("Set page classification"),
    "transfer-owner": t("Transfer page owner"),
    "revoke-grant": t("Revoke page grant"),
    "request-access": t("Request page access"),
    "review-access": t("Review access request"),
    "revoke-access": t("Revoke page access"),
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitError("");
    const control = {
      pageId,
      operationId: values.operationId.trim(),
      expectedVersion: Number(values.expectedVersion),
    };
    try {
      if (action === "classify") {
        await mutations.classify.mutateAsync({
          ...control,
          classification: Number(values.classification),
        });
      } else if (action === "transfer-owner") {
        await mutations["transfer-owner"].mutateAsync({
          ...control,
          ownerUserId: values.ownerUserId.trim(),
        });
      } else if (action === "revoke-grant") {
        await mutations["revoke-grant"].mutateAsync({
          ...control,
          grantId: values.grantId.trim(),
        });
      } else if (action === "request-access") {
        await mutations["request-access"].mutateAsync({
          pageId,
          reason: values.reason.trim(),
        });
      } else if (action === "review-access") {
        await mutations["review-access"].mutateAsync({
          ...control,
          accessRequestId: values.accessRequestId.trim(),
          decision: values.decision,
          ...(values.decision === "APPROVE"
            ? { expiresAt: new Date(values.expiresAt).toISOString() }
            : {}),
        });
      } else {
        await mutations["revoke-access"].mutateAsync({
          ...control,
          accessRequestId: values.accessRequestId.trim(),
        });
      }
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, t("Page control operation failed")),
      );
    }
  });

  const close = () => {
    if (!mutation.isPending) onClose();
  };

  return (
    <Modal.Root opened onClose={close} size={520} yOffset="10vh">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title fw={500}>{titles[action]}</Modal.Title>
          <Modal.CloseButton
            aria-label={t("Close")}
            disabled={mutation.isPending}
          />
        </Modal.Header>
        <Modal.Body>
          {mutation.isSuccess ? (
            <Stack>
              <Alert color="green" role="status">
                {t("Page control operation completed")}
              </Alert>
              <Group justify="flex-end">
                <Button onClick={onClose}>{t("Close")}</Button>
              </Group>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Stack>
                {action === "classify" && (
                  <NativeSelect
                    label={t("Page classification")}
                    data={[1, 2, 3, 4, 5].map((level) => ({
                      value: String(level),
                      label: `L${level}`,
                    }))}
                    disabled={mutation.isPending}
                    {...form.getInputProps("classification")}
                  />
                )}
                {action === "transfer-owner" && (
                  <TextInput
                    withAsterisk
                    label={t("New owner user UUID")}
                    disabled={mutation.isPending}
                    errorProps={{ role: "alert" }}
                    {...form.getInputProps("ownerUserId")}
                  />
                )}
                {action === "revoke-grant" && (
                  <TextInput
                    withAsterisk
                    label={t("Grant UUID")}
                    disabled={mutation.isPending}
                    errorProps={{ role: "alert" }}
                    {...form.getInputProps("grantId")}
                  />
                )}
                {action === "request-access" && (
                  <Textarea
                    withAsterisk
                    label={t("Access reason")}
                    minRows={3}
                    maxLength={1000}
                    disabled={mutation.isPending}
                    errorProps={{ role: "alert" }}
                    {...form.getInputProps("reason")}
                  />
                )}
                {["review-access", "revoke-access"].includes(action) && (
                  <TextInput
                    withAsterisk
                    label={t("Access request UUID")}
                    disabled={mutation.isPending}
                    errorProps={{ role: "alert" }}
                    {...form.getInputProps("accessRequestId")}
                  />
                )}
                {action === "review-access" && (
                  <>
                    <Radio.Group
                      label={t("Review decision")}
                      {...form.getInputProps("decision")}
                    >
                      <Group mt="xs">
                        <Radio value="APPROVE" label={t("Approve")} />
                        <Radio value="REJECT" label={t("Reject")} />
                      </Group>
                    </Radio.Group>
                    {form.values.decision === "APPROVE" && (
                      <TextInput
                        withAsterisk
                        label={t("Approval expiration")}
                        type="datetime-local"
                        disabled={mutation.isPending}
                        errorProps={{ role: "alert" }}
                        {...form.getInputProps("expiresAt")}
                      />
                    )}
                  </>
                )}
                {managedActions.includes(action) && (
                  <>
                    <NumberInput
                      withAsterisk
                      label={t("Expected resource version")}
                      min={1}
                      step={1}
                      allowDecimal={false}
                      allowNegative={false}
                      disabled={mutation.isPending}
                      errorProps={{ role: "alert" }}
                      {...form.getInputProps("expectedVersion")}
                    />
                    <TextInput
                      withAsterisk
                      label={t("Operation UUID")}
                      disabled={mutation.isPending}
                      errorProps={{ role: "alert" }}
                      {...form.getInputProps("operationId")}
                    />
                  </>
                )}
                {submitError && (
                  <Alert color="red" role="alert">
                    {submitError}
                  </Alert>
                )}
              </Stack>
              <Text size="xs" c="dimmed" mt="md">
                {t(
                  "The server verifies your permission and the expected resource version.",
                )}
              </Text>
              <Group justify="flex-end" mt="md">
                <Button
                  variant="default"
                  onClick={close}
                  disabled={mutation.isPending}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" loading={mutation.isPending}>
                  {titles[action]}
                </Button>
              </Group>
            </form>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
