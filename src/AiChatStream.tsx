import React, { useState } from "react";

export const AiChatStream: React.FC = () => {
  // 1. Local state for the user's prompt and the streaming response text
  const [prompt, setPrompt] = useState<string>("");
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // A hardcoded mock response to simulate a streaming chunk delivery
  const mockAiOutput =
    "I can certainly help you transition to React! Because you already understand TypeScript and components, you are already halfway there. Focus on mastering hooks next.";

  // 2. The core streaming function (Simulating chunked API data)
  const simulateAiStream = () => {
    // Reset previous response and lock the button
    setDisplayedResponse("");
    setIsStreaming(true);

    const words = mockAiOutput.split(" ");
    let currentWordIndex = 0;
    let accumulatedText = "";

    // Simulate an interval fetching chunks of text from a stream
    const intervalId = setInterval(() => {
      if (currentWordIndex < words.length) {
        accumulatedText +=
          (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];

        // Update React state with the newly appended text chunk
        setDisplayedResponse(accumulatedText);
        currentWordIndex++;
      } else {
        // Clear interval when stream concludes
        clearInterval(intervalId);
        setIsStreaming(false);
      }
    }, 120); // Adds a new word roughly every 120 milliseconds
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isStreaming) return;
    simulateAiStream();
  };

  return (
    <div className="w-full max-w-xl p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl text-slate-100">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">
        AI Streaming Assistant
      </h2>

      {/* 3. Output display panel */}
      <div className="min-h-[120px] p-4 mb-4 bg-slate-900 rounded-lg border border-slate-700 text-sm leading-relaxed">
        {displayedResponse ? (
          <p>
            {displayedResponse}
            <span
              className={`inline-block w-2 h-4 ml-1 bg-emerald-400 ${isStreaming ? "animate-pulse" : "hidden"}`}
            >
              |
            </span>
          </p>
        ) : (
          <p className="text-slate-500 italic">
            Ask a question below to see a streaming response...
          </p>
        )}
      </div>

      {/* 4. Form and controls */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something about React..."
          disabled={isStreaming}
          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !prompt.trim()}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {isStreaming ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};
