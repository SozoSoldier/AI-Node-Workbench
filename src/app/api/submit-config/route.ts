import { NextRequest, NextResponse } from "next/server";
import { updateDatabaseConfig } from "../db";

// Handles POST requests sent to /api/submit-config
export async function POST(request: NextRequest) {
  console.log("--- NEXT.JS API: Received a POST payload from React Form ---");

  try {
    const body = await request.json();
    console.log("Incoming Payload Data:", body);

    // Backend Validation Guard Check
    if (!body.modelName) {
      return NextResponse.json(
        { error: "Server rejection: Model Name cannot be blank." },
        { status: 400 },
      );
    }

    // Persist the clean incoming data types into our shared database state
    updateDatabaseConfig({
      modelName: body.modelName,
      temperature: Number(body.temperature),
      systemPrompt: body.systemPrompt,
      isMaxTokensEnabled: body.isMaxTokensEnabled,
      maxTokens: body.maxTokens !== "" ? Number(body.maxTokens) : "",
    });

    return NextResponse.json({
      success: true,
      message:
        "Configuration successfully written to Next.js native backend API layers!",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON payload received" },
      { status: 400 },
    );
  }
}
