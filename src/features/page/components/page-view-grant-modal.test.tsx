import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import PageViewGrantModal from "./page-view-grant-modal";

const mutateAsync = vi.fn();
const reset = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("@/features/page/queries/page-query", () => ({
  useGrantPageViewMutation: () => ({
    mutateAsync,
    reset,
    isPending: false,
    isSuccess: false,
  }),
}));

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  mutateAsync.mockReset().mockResolvedValue({
    operationId: "60000000-0000-4000-8000-000000000001",
    status: "DONE",
  });
  reset.mockReset();
  vi.spyOn(crypto, "randomUUID").mockReturnValue(
    "60000000-0000-4000-8000-000000000001",
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("submits the server grant contract and omits an empty expiration", async () => {
  render(
    <MantineProvider>
      <PageViewGrantModal
        pageId="10000000-0000-4000-8000-000000000001"
        open
        onClose={vi.fn()}
      />
    </MantineProvider>,
  );

  fireEvent.change(screen.getByLabelText(/^OIDC issuer/), {
    target: { value: "https://sso.example.test/realms/lec" },
  });
  fireEvent.change(screen.getByLabelText(/^OIDC subject/), {
    target: { value: "recipient-subject" },
  });
  fireEvent.change(screen.getByLabelText(/^Expected resource version/), {
    target: { value: "7" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Grant view access" }));

  await waitFor(() =>
    expect(mutateAsync).toHaveBeenCalledWith({
      pageId: "10000000-0000-4000-8000-000000000001",
      subjectIssuer: "https://sso.example.test/realms/lec",
      subject: "recipient-subject",
      expectedVersion: 7,
      operationId: "60000000-0000-4000-8000-000000000001",
    }),
  );
});

it("exposes accessible validation errors before submitting", async () => {
  render(
    <MantineProvider>
      <PageViewGrantModal pageId="page" open onClose={vi.fn()} />
    </MantineProvider>,
  );

  fireEvent.change(screen.getByLabelText(/^OIDC issuer/), {
    target: { value: "http://insecure.example.test" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Grant view access" }));

  const issuerError = await screen.findByText("OIDC issuer must use HTTPS");
  const subjectError = screen.getByText("OIDC subject is required");
  expect(issuerError.getAttribute("role")).toBe("alert");
  expect(subjectError.getAttribute("role")).toBe("alert");
  expect(mutateAsync).not.toHaveBeenCalled();
});
