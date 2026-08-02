import React from "react";
import { NavLink } from "react-router";
import { useChatStore } from "./store";

export const ChatHistorySidebar: React.FC = () => {
  const {
    threads,
    activeThreadId,
    createNewThread,
    setActiveThread,
    clearAllThreads,
  } = useChatStore();

  return (
    // HIGHLIGHT: Changed 'w-64 h-full' to 'w-full md:w-64 h-auto md:h-full flex-col md:flex-col'.
    // This stacks it vertically on mobile, and adds a soft bottom border instead of a right border on small viewports.
    <div className="w-full md:w-64 bg-slate-900 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-800 text-slate-300 flex flex-col justify-between flex-shrink-0 gap-3 md:gap-0">
      {/* Active Sessions Drawer Block */}
      {/* On mobile, we compress the height limit of the thread selector to 120px so it doesn't push down the chat view */}
      <div className="flex flex-col h-auto md:h-1/2 min-h-0 border-b border-slate-800 pb-3 md:pb-4">
        <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <h3 className="font-bold text-[10px] md:text-[11px] uppercase tracking-wider text-slate-500">
            Active Sessions
          </h3>
          <button
            onClick={clearAllThreads}
            className="text-[10px] text-red-400 hover:underline"
          >
            Wipe All
          </button>
        </div>

        <button
          onClick={() => createNewThread()}
          className="w-full mb-2 py-1.5 px-3 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-[11px] text-indigo-400 font-semibold rounded-lg flex items-center justify-between transition-all flex-shrink-0"
        >
          <span>➕ Open New Chat</span>
          <span className="text-[9px] bg-slate-900 text-slate-600 px-1.5 py-0.5 rounded border border-slate-800 hidden md:inline">
            Ctrl N
          </span>
        </button>

        {/* Dynamic scroll box limits height parameters context explicitly on mobile layout scales */}
        <ul className="space-y-1 text-xs overflow-y-auto max-h-[110px] md:max-h-none flex-1 pr-1 custom-scrollbar">
          {threads.map((thread) => {
            const isSelected = thread.id === activeThreadId;
            return (
              <li
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={`p-2 rounded-lg cursor-pointer transition-all border flex items-center justify-between truncate select-none text-[11px] ${
                  isSelected
                    ? "bg-slate-800 text-slate-100 border-indigo-500/40 shadow-sm"
                    : "bg-slate-950/20 text-slate-400 border-transparent hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{isSelected ? "💬" : "📁"}</span>
                  <span className="font-medium truncate">{thread.title}</span>
                </div>
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0 ml-1">
                  {thread.messages.length}m
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* System Navigation Layer Link Elements */}
      {/* On mobile, we row-wrap the navigation items horizontally instead of listing them as lines! */}
      <div className="flex flex-col pt-1 md:pt-4 min-h-0">
        <h3 className="font-bold text-[10px] md:text-[11px] uppercase tracking-wider text-slate-500 mb-2 hidden md:block">
          System Navigation
        </h3>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 md:gap-3 px-2.5 md:px-3 py-1.5 md:py-2.5 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${isActive ? "bg-indigo-600 text-white shadow-md border-b-2 md:border-b-0 md:border-l-4 border-indigo-400" : "text-slate-400 hover:bg-slate-800/60"}`
            }
          >
            <span>💬</span>{" "}
            <span className="whitespace-nowrap">Workspace Chat</span>
          </NavLink>

          <NavLink
            to="/registry"
            className={({ isActive }) =>
              `flex items-center gap-1.5 md:gap-3 px-2.5 md:px-3 py-1.5 md:py-2.5 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${isActive ? "bg-indigo-600 text-white shadow-md border-b-2 md:border-b-0 md:border-l-4 border-indigo-400" : "text-slate-400 hover:bg-slate-800/60"}`
            }
          >
            <span>📊</span>{" "}
            <span className="whitespace-nowrap">Model Registry</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-1.5 md:gap-3 px-2.5 md:px-3 py-1.5 md:py-2.5 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${isActive ? "bg-indigo-600 text-white shadow-md border-b-2 md:border-b-0 md:border-l-4 border-indigo-400" : "text-slate-400 hover:bg-slate-800/60"}`
            }
          >
            <span>⚙️</span>{" "}
            <span className="whitespace-nowrap">Settings Studio</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
