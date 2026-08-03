import { NextResponse } from "next/server";
import { aiDatabaseConfig } from "../db";

// Handles GET requests sent to /api/model-config
export async function GET() {
  console.log(
    "--- NEXT.JS API: Received a GET request for config parameters ---",
  );
  return NextResponse.json(aiDatabaseConfig);
}
