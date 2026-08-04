import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { AiModelForm } from "./AiModelForm";

// Mock Next.js-native routing hook configurations
vi.mock("next/navigation", () => ({
  useRouter() {
    return { push: vi.fn(), replace: vi.fn() };
  },
}));

// Mock global Zustand authentication state models
vi.mock("./store", () => ({
  useChatStore: (selector: any) =>
    selector({ isAuthenticated: true, username: "admin" }),
}));

describe("AiModelForm Validation Suite via Explicit Data Test IDs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Intercept global fetch configurations cleanly to mimic the initial form load data
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        modelName: "Local-DeepSeek-R1",
        temperature: 0.6,
        systemPrompt: "Initial prompt testing sequence.",
        isMaxTokensEnabled: false,
        maxTokens: "",
      }),
    });
  });

  it("should render standard layout form label entries on initialization", async () => {
    render(<AiModelForm />);

    // Explicitly check for the physical field element using its data-testid attribute
    await waitFor(() => {
      expect(screen.getByTestId("model-name-field")).toBeInTheDocument();
    });
  });

  it("should present validation errors immediately if required name strings are emptied", async () => {
    render(<AiModelForm />);

    // 1. Grab the element securely via its explicit data test ID
    let nameInput: HTMLInputElement;
    await waitFor(() => {
      nameInput = screen.getByTestId("model-name-field") as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();
    });

    // 2. Clear out the field to force the validation checker logic
    fireEvent.change(nameInput!, { target: { value: "" } });

    // 3. Fire the submission trigger action button
    const commitButton = screen.getByRole("button", { name: /Commit/i });
    fireEvent.click(commitButton);

    // 4. Assert that the required error banner pops into view layout
    await waitFor(() => {
      expect(screen.getByText(/is strictly required/i)).toBeInTheDocument();
    });
  });

  it("should trigger dynamic visibility layout toggles when checkbox is selected", async () => {
    render(<AiModelForm />);

    // 1. Verify the conditional panel wrapper does not exist yet on initialization
    await waitFor(() => {
      expect(
        screen.queryByTestId("conditional-token-container"),
      ).not.toBeInTheDocument();
    });

    // 2. Grab the toggle checkbox via its data test ID and click it
    const checkbox = screen.getByTestId("token-toggle-field");
    fireEvent.click(checkbox);

    // 3. Verify the wrapper panel successfully mounts into the active browser layout tree
    await waitFor(() => {
      expect(
        screen.getByTestId("conditional-token-container"),
      ).toBeInTheDocument();
    });
  });
});
