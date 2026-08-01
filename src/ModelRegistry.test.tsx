import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ModelRegistry } from "./ModelRegistry";
import { BrowserRouter } from "react-router";

// Mock the global global.fetch engine to simulate our proxy network returns safely
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("ModelRegistry Component Sanity Suite", () => {
  it("should present an active loading message on mount initialization", () => {
    // Return an unresolved promise to catch the initial layout
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <ModelRegistry />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Loading framework entries.../i),
    ).toBeInTheDocument();
  });

  it("should format and map proxy payload records into strict list elements cleanly", async () => {
    // Mock a clean successful mock server network transmission wrapper
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ name: "GPT-4o-Turbo" }, { name: "Claude-3.5-Sonnet" }],
      }),
    });

    render(
      <BrowserRouter>
        <ModelRegistry />
      </BrowserRouter>,
    );

    // Wait until the loading frame clears and items load into view
    await waitFor(() => {
      expect(screen.getByText("GPT-4o-Turbo")).toBeInTheDocument();
      expect(screen.getByText("Claude-3.5-Sonnet")).toBeInTheDocument();
    });
  });
});
