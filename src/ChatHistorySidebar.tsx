import React from "react";
import { NavLink } from "react-router";
import { useChatStore } from "./store";

export const ChatHistorySidebar: React.FC = () => {
  // Grab session properties out of our store hook
  const {
    threads,
    activeThreadId,
    createNewThread,
    setActiveThread,
    clearAllThreads,
  } = useChatStore();

  return (
    <div className="w-64 bg-slate-900 p-4 border-r border-slate-800 text-slate-300 flex flex-col justify-between h-full flex-shrink-0">
      {/* Sessions Control Panel */}
      <div className="flex flex-col h-1/2 min-h-0 border-b border-slate-800 pb-4">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
            Active Sessions
          </h3>
          <button
            onClick={clearAllThreads}
            className="text-[10px] text-red-400 hover:underline"
          >
            Wipe All
          </button>
        </div>

        {/* 1. NEW CHAT BUTTON TRIGGER */}
        <button
          onClick={() => createNewThread()}
          className="w-full mb-3 py-2 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-xs text-indigo-400 font-semibold rounded-lg text-left flex items-center justify-between transition-all"
        >
          <span>➕ Open New Chat</span>
        </button>

        {/* 2. INTERACTIVE INTERCONNECTED SESSION THREAD SELECTOR LIST */}
        <ul className="space-y-1 text-xs overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {threads.map((thread) => {
            const isSelected = thread.id === activeThreadId;
            return (
              <li
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={`p-2.5 rounded-lg cursor-pointer transition-all border flex items-center justify-between truncate select-none ${
                  isSelected
                    ? "bg-slate-800 text-slate-100 border-indigo-500/40 shadow-md shadow-indigo-950/10"
                    : "bg-slate-950/20 text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{isSelected ? "💬" : "📁"}</span>
                  <span className="font-medium truncate">{thread.title}</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono flex-shrink-0 ml-2">
                  {thread.messages.length} msg
                </span>
              </li>
            );
          })}
          {threads.length === 0 && (
            <p className="text-slate-600 italic text-[11px] text-center mt-4">
              Click "New Chat" to begin...
            </p>
          )}
        </ul>
      </div>

      {/* Persistent App Navigation Links */}
      <div className="flex-1 flex flex-col pt-4 min-h-0">
        <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-3">
          System Navigation
        </h3>
        <nav className="space-y-1 flex-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive ? "bg-indigo-600 text-white border-l-4 border-indigo-400 pl-2" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`
            }
          >
            <span>💬</span> AI Workspace Chat
          </NavLink>
          <NavLink
            to="/registry"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive ? "bg-indigo-600 text-white border-l-4 border-indigo-400 pl-2" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`
            }
          >
            <span>📊</span> Model Registry Database
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive ? "bg-indigo-600 text-white border-l-4 border-indigo-400 pl-2" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`
            }
          >
            <span>⚙️</span> App Settings Studio
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
