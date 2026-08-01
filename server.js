import express from "express";
// 1. Import the Zod library engine
import { z } from "zod";

const app = express();
const PORT = 3000;

app.use(express.json());

let aiDatabaseConfig = {
  modelName: "DeepSeek-R1-Node-Edition",
  temperature: 0.7,
  systemPrompt:
    "You are an advanced software engineer assistant running on Node.js.",
  isMaxTokensEnabled: true,
  maxTokens: 4096,
};

// 2. Define your backend Validation Schema (Structural constraints checklist)
const ModelConfigSchema = z
  .object({
    modelName: z
      .string()
      .min(3, {
        message:
          "Model name structural length must span at least 3 characters.",
      })
      .max(50, { message: "Model name cannot exceed 50 characters." }),

    temperature: z
      .number()
      .min(0, { message: "Temperature minimum floor constraint is 0.0" })
      .max(2, { message: "Temperature maximum ceiling boundary is 2.0" }),

    systemPrompt: z.string().min(10, {
      message:
        "System instruction prompts must span at least 10 characters long.",
    }),

    isMaxTokensEnabled: z.boolean(),

    // Custom conditional allowance: permit empty strings or numbers
    maxTokens: z.union([z.number().min(1).max(32000), z.literal("")]),
  })
  .refine(
    (data) => {
      // 3. Complex Multi-Field Validation Rule (Like an Angular custom validator)
      // If caps are enabled, maxTokens cannot be left as an empty string
      if (data.isMaxTokensEnabled && data.maxTokens === "") {
        return false;
      }
      return true;
    },
    {
      message:
        "Backend Rejection: A numeric token assignment is strictly required when cap limits are enabled.",
      path: ["maxTokens"], // Attaches the error flag specifically to the maxTokens target attribute
    },
  );

app.get("/api/model-config", (req, res) => {
  res.status(200).json(aiDatabaseConfig);
});

// Updated POST handler leveraging our new schemas
app.post("/api/submit-config", (req, res) => {
  console.log(
    "--- NODE API: Verifying incoming payload against Zod parameters ---",
  );

  // 4. Safely parse the object without crashing the server execution loop
  const validationResult = ModelConfigSchema.safeParse(req.body);

  // 5. Intercept failures and return an HTTP 400 Bad Request error stack layout back to React
  if (!validationResult.success) {
    console.log("❌ Validation Fault Intercepted on Backend Layer!");

    // Extract Zod's formatted structural error listings layout array
    const errorDetails = validationResult.error.flatten().fieldErrors;

    return res.status(400).json({
      success: false,
      error: "Structural Schema Rejection",
      details: errorDetails,
    });
  }

  // 6. Extraction: grab the verified, clean data object out of the parser container
  const cleanData = validationResult.data;

  // Persist clean types safely in server database memory state
  aiDatabaseConfig = {
    modelName: cleanData.modelName,
    temperature: cleanData.temperature,
    systemPrompt: cleanData.systemPrompt,
    isMaxTokensEnabled: cleanData.isMaxTokensEnabled,
    maxTokens: cleanData.maxTokens !== "" ? Number(cleanData.maxTokens) : "",
  };

  console.log(
    "✅ Success: Data saved to Node memory store database configuration matrix.",
  );
  res.status(200).json({
    success: true,
    message:
      "Configuration successfully validated and updated inside Node backend database parameters!",
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Production-ready validation Node.js API active at http://localhost:${PORT}`,
  );
});
