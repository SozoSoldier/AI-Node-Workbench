import React from "react";
import { Outlet, useNavigate } from "react-router";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { useChatStore } from "./store";

export const MainLayout: React.FC = () => {
  const username = useChatStore((state) => state.username);
  const logoutAction = useChatStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-100">
      {/* 1. GLOBAL TOP APPLICATION HEADER */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="font-bold text-sm tracking-wider text-indigo-400 uppercase">
            AI Neural Node Workbench
          </span>
        </div>

        {/* Top-Right Logged In Profile Panel */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-medium">Logged in as:</span>
            <span className="text-slate-200 font-semibold">
              {username || "Guest"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900 border border-slate-700 rounded-lg text-slate-300 transition-all font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. CORE WORKSPACE LAYOUT (SIDEBAR + CONTENT OUTLET) */}
      <div className="flex flex-1 min-h-0 justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl h-[650px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden flex">
          {/* Persistent Left Navigation Sidebar */}
          <ChatHistorySidebar />

          {/* Dynamic Content Window - Replaces Angular's router-outlet */}
          <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto bg-slate-800">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
