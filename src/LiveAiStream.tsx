import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "./store";
import Markdown from "react-markdown";

export const LiveAiStream: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pull multi-session properties from Zustand
  const { threads, activeThreadId, addMessageToActiveThread } = useChatStore();

  // Find the exact active thread object matching our active tracking pointer ID
  const currentThread = threads.find((t) => t.id === activeThreadId);
  const activeMessages = currentThread ? currentThread.messages : [];

  // Automatically scroll the chat container down every time a new message gets appended
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, isAiThinking]);

  // Replace handleFormSubmit function inside src/LiveAiStream.tsx with GraphQL request layout:
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !activeThreadId || isAiThinking) return;

    const userPromptText = userInput;
    setUserInput("");

    // 1. Instantly update local state for the user's view layer
    addMessageToActiveThread({
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: userPromptText,
    });

    setIsAiThinking(true);

    try {
      // 2. Fire an explicit GraphQL Mutation payload directly to the Next.js backend endpoint
      const graphQLMutation = {
        query: `
        mutation PushUserPrompt($threadId: ID!, $text: String!, $sender: String!) {
          sendMessage(threadId: $threadId, text: $text, sender: $sender) {
            id
            text
          }
        }
      `,
        variables: {
          threadId: activeThreadId,
          text: userPromptText,
          sender: "user",
        },
      };

      // Execute the network request directly to Next.js route
      await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphQLMutation),
      });

      // 3. Trigger mock AI response loop after the GraphQL handshake completes
      setTimeout(() => {
        addMessageToActiveThread({
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: `Next.js GraphQL operational layer check successful! Your query data successfully parsed through Apollo Server schemas.`,
        });
        setIsAiThinking(false);
      }, 1000);
    } catch (error) {
      console.error("GraphQL Data Sync Fault:", error);
      setIsAiThinking(false);
    }
  };

  if (!activeThreadId) {
    return (
      <div className="flex-1 text-center py-20 text-slate-500 italic text-sm">
        Please click "Open New Chat" in the sidebar layout parameters menu to
        initialize an execution thread workspace.
      </div>
    );
  }

  return (
    // HIGHLIGHT: Changed 'p-4 md:p-6' and added 'h-full w-full' to fluidly scale with the parent responsive boundaries
    <div className="flex-1 bg-slate-800 text-slate-100 flex flex-col h-full w-full p-2 md:p-4 min-w-0 overflow-hidden">
      {/* Subheading status row line adapts font sizes */}
      <div className="pb-2 border-b border-slate-700/60 flex items-center justify-between text-[10px] md:text-xs text-slate-400 mb-3 flex-shrink-0">
        <div className="truncate max-w-[180px] md:max-w-none">
          <span className="text-slate-500">Target:</span>{" "}
          <span className="text-indigo-400 font-semibold">
            {currentThread?.title}
          </span>
        </div>
        <div className="font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700/50">
          Active Node
        </div>
      </div>

      {/* Message Logs Box: Adjusted chat log bubbles 'max-w-[90%] md:max-w-[85%]' */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 mb-3 p-3 bg-slate-900 rounded-xl border border-slate-950 custom-scrollbar flex flex-col min-h-0 text-[11px] md:text-xs"
      >
        {activeMessages.map((m) => (
          <div
            key={m.id}
            className={`p-2.5 md:p-3.5 rounded-2xl max-w-[90%] md:max-w-[85%] shadow-sm leading-relaxed border animate-fadeIn ${
              m.sender === "user"
                ? "bg-indigo-600 text-white border-indigo-500/30 ml-auto rounded-tr-none"
                : "bg-slate-800 text-slate-200 border-slate-700/50 rounded-tl-none"
            }`}
          >
            <div className="font-bold text-[8px] uppercase tracking-wider mb-1 opacity-40 select-none">
              {m.sender === "user" ? "Operator" : "Neural Node AI"}
            </div>
            <div className="prose prose-invert max-w-none text-slate-200 text-xs break-words">
              <Markdown>{m.text}</Markdown>
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="p-2.5 bg-slate-800/40 border border-slate-700/30 rounded-2xl rounded-tl-none text-[11px] max-w-[60%] md:max-w-[40%] text-slate-500 flex items-center gap-2 animate-pulse">
            <span className="flex gap-1 flex-shrink-0">
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            </span>
            <span className="truncate">Synthesizing...</span>
          </div>
        )}
      </div>

      {/* Form submission inputs row bar */}
      <form
        onSubmit={handleFormSubmit}
        className="flex gap-1.5 flex-shrink-0 pb-1"
      >
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isAiThinking}
          placeholder={
            isAiThinking ? "Processing..." : "Submit prompt instructions..."
          }
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-40 transition-colors"
        />
        <button
          type="submit"
          disabled={isAiThinking || !userInput.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 text-xs font-bold rounded-xl transition-all disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );

  // return (
  //   <div className="flex-1 bg-slate-800 text-slate-100 flex flex-col h-full p-4 md:p-6 min-w-0">
  //     {/* Current Thread Status Subheading Bar */}
  //     <div className="pb-3 border-b border-slate-700/60 flex items-center justify-between text-xs text-slate-400 mb-4 flex-shrink-0">
  //       <div>
  //         <span className="text-slate-500">Active Workspace Target:</span>{" "}
  //         <span className="text-indigo-400 font-semibold">
  //           {currentThread?.title}
  //         </span>
  //       </div>
  //       <div className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700/50">
  //         Thread ID: {activeThreadId}
  //       </div>
  //     </div>

  //     {/* Main Streaming Chronological Conversation Window */}
  //     <div
  //       ref={scrollRef}
  //       className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-900 rounded-xl border border-slate-950 custom-scrollbar flex flex-col min-h-0"
  //     >
  //       {activeMessages.map((m) => (
  //         <div
  //           key={m.id}
  //           className={`p-3.5 rounded-2xl text-xs max-w-[85%] shadow-sm leading-relaxed border animate-fadeIn ${
  //             m.sender === "user"
  //               ? "bg-indigo-600 text-white border-indigo-500/30 ml-auto rounded-tr-none"
  //               : "bg-slate-800 text-slate-200 border-slate-700/50 rounded-tl-none"
  //           }`}
  //         >
  //           <div className="font-bold text-[9px] uppercase tracking-wider mb-1 opacity-40 select-none">
  //             {m.sender === "user" ? "Operator" : "Neural Node AI"}
  //           </div>
  //           <div className="prose prose-invert max-w-none text-slate-200">
  //             <Markdown>{m.text}</Markdown>
  //           </div>
  //         </div>
  //       ))}

  //       {/* Animated AI Thinking status tracker line indicator */}
  //       {isAiThinking && (
  //         <div className="p-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl rounded-tl-none text-xs max-w-[40%] text-slate-500 flex items-center gap-2 animate-pulse">
  //           <span className="flex gap-1">
  //             <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
  //             <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
  //             <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
  //           </span>
  //           <span>Synthesizing response chunks...</span>
  //         </div>
  //       )}

  //       {activeMessages.length === 0 && !isAiThinking && (
  //         <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-600 select-none">
  //           <span className="text-3xl mb-2">⚡</span>
  //           <p className="text-xs italic font-medium">
  //             Session pipeline initialized and awaiting core query prompt
  //             execution sequences...
  //           </p>
  //         </div>
  //       )}
  //     </div>

  //     {/* Input controls form panel strip */}
  //     <form onSubmit={handleFormSubmit} className="flex gap-2 flex-shrink-0">
  //       <input
  //         value={userInput}
  //         onChange={(e) => setUserInput(e.target.value)}
  //         disabled={isAiThinking}
  //         placeholder={
  //           isAiThinking
  //             ? "AI cluster engine processing..."
  //             : "Submit prompt instructions to model..."
  //         }
  //         className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 disabled:opacity-40 transition-colors shadow-inner"
  //       />
  //       <button
  //         type="submit"
  //         disabled={isAiThinking || !userInput.trim()}
  //         className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 border border-indigo-500/20 text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 disabled:opacity-40 flex items-center gap-1.5"
  //       >
  //         {isAiThinking ? "Thinking" : "Transmit"}
  //       </button>
  //     </form>
  //   </div>
  // );
};
