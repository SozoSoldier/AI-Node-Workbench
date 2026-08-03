import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

// 1. Define your GraphQL Type Definitions (Schema)
// This strictly types what queries (GETs) and mutations (POSTs) the client can make
const typeDefs = `#graphql
  type ChatMessage {
    id: ID!
    sender: String!
    text: String!
  }

  type Query {
    getThreadMessages(threadId: ID!): [ChatMessage]
  }

  type Mutation {
    sendMessage(threadId: ID!, text: String!, sender: String!): ChatMessage
  }
`;

// In-memory mock database tracking separate conversation logs
const mockGraphQLDatabase: Record<
  string,
  Array<{ id: string; sender: string; text: string }>
> = {
  "thread-default": [
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your new Next.js GraphQL service layer node!",
    },
  ],
};

// 2. Define your Resolvers (The code that actually fetches or updates the data)
const resolvers = {
  Query: {
    getThreadMessages: (_: any, { threadId }: { threadId: string }) => {
      return mockGraphQLDatabase[threadId] || [];
    },
  },
  Mutation: {
    sendMessage: (
      _: any,
      {
        threadId,
        text,
        sender,
      }: { threadId: string; text: string; sender: string },
    ) => {
      const newMessage = { id: `msg-${Date.now()}`, sender, text };

      if (!mockGraphQLDatabase[threadId]) {
        mockGraphQLDatabase[threadId] = [];
      }

      mockGraphQLDatabase[threadId].push(newMessage);
      return newMessage;
    },
  },
};

// 3. Initialize the Apollo GraphQL Server inside the Next.js runtime environment
const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler<NextRequest>(server);

// Export GET and POST handlers to listen to the incoming client graph requests
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
