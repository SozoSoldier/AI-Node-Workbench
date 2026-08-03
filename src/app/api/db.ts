// 1. Declare a explicit type layout mapping for the server configuration state
interface ApiDatabaseModel {
  modelName: string;
  temperature: number;
  systemPrompt: string;
  isMaxTokensEnabled: boolean;
  maxTokens: number | ""; // Allows true numbers or empty strings
}

// 2. Apply the interface to your live state variables
export let aiDatabaseConfig: ApiDatabaseModel = {
  modelName: "DeepSeek-R1-NextJS-Edition",
  temperature: 0.7,
  systemPrompt:
    "You are an advanced software engineer assistant running natively on Next.js.",
  isMaxTokensEnabled: true,
  maxTokens: 4096,
};

// 3. Keep your configuration update helper fully synchronized
export const updateDatabaseConfig = (newData: ApiDatabaseModel) => {
  aiDatabaseConfig = newData;
};
