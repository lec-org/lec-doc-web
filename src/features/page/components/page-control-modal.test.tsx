import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import PageControlModal, { PageControlAction } from "./page-control-modal";

const mutations = {
  classify: vi.fn(),
  "transfer-owner": vi.fn(),
  "revoke-grant": vi.fn(),
  "request-access": vi.fn(),
  "review-access": vi.fn(),
  "revoke-access": vi.fn(),
};

const mutation = (mutateAsync: ReturnType<typeof vi.fn>) => ({
  mutateAsync,
  reset: vi.fn(),
  isPending: false,
  isSuccess: false,
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("@/features/page/queries/page-query", () => ({
  useClassifyPageMutation: () => mutation(mutations.classify),
  useTransferPageOwnerMutation: () => mutation(mutations["transfer-owner"]),
  useRevokePageGrantMutation: () => mutation(mutations["revoke-grant"]),
  useRequestPageAccessMutation: () => mutation(mutations["request-access"]),
  useReviewPageAccessMutation: () => mutation(mutations["review-access"]),
  useRevokePageAccessMutation: () => mutation(mutations["revoke-access"]),
}));

const pageId = "10000000-0000-4000-8000-000000000001";
const operationId = "20000000-0000-4000-8000-000000000001";
const targetId = "30000000-0000-4000-8000-000000000001";

function renderControl(action: PageControlAction) {
  return render(
    <MantineProvider>
      <PageControlModal action={action} pageId={pageId} onClose={vi.fn()} />
    </MantineProvider>,
  );
}

function fillControl() {
  fireEvent.change(screen.getByLabelText(/^Expected resource version/), {
    target: { value: "7" },
  });
}

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  Object.values(mutations).forEach((mock) =>
    mock.mockReset().mockResolvedValue({ resource_version: 8 }),
  );
  vi.spyOn(crypto, "randomUUID").mockReturnValue(operationId);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("submits classification L1-L5 with the concurrency fields", async () => {
  renderControl("classify");

  fireEvent.change(
    screen.getByRole("combobox", { name: "Page classification" }),
    {
      target: { value: "5" },
    },
  );
  fillControl();
  fireEvent.click(
    screen.getByRole("button", { name: "Set page classification" }),
  );

  await waitFor(() =>
    expect(mutations.classify).toHaveBeenCalledWith({
      pageId,
      classification: 5,
      expectedVersion: 7,
      operationId,
    }),
  );
});

it.each([
  [
    "transfer-owner",
    "New owner user UUID",
    "Transfer page owner",
    "ownerUserId",
  ],
  ["revoke-grant", "Grant UUID", "Revoke page grant", "grantId"],
  [
    "revoke-access",
    "Access request UUID",
    "Revoke page access",
    "accessRequestId",
  ],
] as const)(
  "submits the %s UUID contract",
  async (action, label, button, field) => {
    renderControl(action);

    fireEvent.change(screen.getByLabelText(new RegExp(`^${label}`)), {
      target: { value: targetId },
    });
    fillControl();
    fireEvent.click(screen.getByRole("button", { name: button }));

    await waitFor(() =>
      expect(mutations[action]).toHaveBeenCalledWith({
        pageId,
        expectedVersion: 7,
        operationId,
        [field]: targetId,
      }),
    );
  },
);

it("submits a trimmed access reason without control concurrency fields", async () => {
  renderControl("request-access");

  fireEvent.change(screen.getByLabelText(/^Access reason/), {
    target: { value: "  Need the project brief  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Request page access" }));

  await waitFor(() =>
    expect(mutations["request-access"]).toHaveBeenCalledWith({
      pageId,
      reason: "Need the project brief",
    }),
  );
});

it("requires a future expiry for approval and sends its ISO value", async () => {
  renderControl("review-access");

  fireEvent.change(screen.getByLabelText(/^Access request UUID/), {
    target: { value: targetId },
  });
  fillControl();
  fireEvent.click(
    screen.getByRole("button", { name: "Review access request" }),
  );
  expect(
    await screen.findByText("Approval expiration must be in the future"),
  ).toBeDefined();
  expect(mutations["review-access"]).not.toHaveBeenCalled();

  fireEvent.change(screen.getByLabelText(/^Approval expiration/), {
    target: { value: "2030-01-01T10:30" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Review access request" }),
  );

  await waitFor(() =>
    expect(mutations["review-access"]).toHaveBeenCalledWith({
      pageId,
      accessRequestId: targetId,
      decision: "APPROVE",
      expiresAt: new Date("2030-01-01T10:30").toISOString(),
      expectedVersion: 7,
      operationId,
    }),
  );
});

it("rejects an access request without an expiration", async () => {
  renderControl("review-access");

  fireEvent.change(screen.getByLabelText(/^Access request UUID/), {
    target: { value: targetId },
  });
  fireEvent.click(screen.getByLabelText("Reject"));
  fillControl();
  fireEvent.click(
    screen.getByRole("button", { name: "Review access request" }),
  );

  await waitFor(() =>
    expect(mutations["review-access"]).toHaveBeenCalledWith({
      pageId,
      accessRequestId: targetId,
      decision: "REJECT",
      expectedVersion: 7,
      operationId,
    }),
  );
});
