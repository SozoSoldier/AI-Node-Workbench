import { NextResponse } from "next/server";

// Handles GET requests sent to /api/framework-registry
export async function GET() {
  console.log(
    "--- NEXT.JS API: Received a GET request for framework registry entries ---",
  );

  // The mock database array matching the structure your frontend expects
  const mockFrameworks = {
    results: [
      { name: "DeepSeek-R1-Core" },
      { name: "Claude-3.5-Sonnet-Node" },
      { name: "GPT-4o-Mini-Agent" },
      { name: "Llama-3.3-Instruct" },
      { name: "Mistral-Large-2" },
    ],
  };

  return NextResponse.json(mockFrameworks);
}
