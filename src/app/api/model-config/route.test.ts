import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("Next.js API Route Telemetry Test Suite", () => {
  it("should return a valid JSON payload accompanied by a 200 HTTP handshake status", async () => {
    // Invoke the functional backend GET wrapper natively
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("modelName");
    expect(data).toHaveProperty("temperature");
    expect(typeof data.temperature).toBe("number");
  });
});
