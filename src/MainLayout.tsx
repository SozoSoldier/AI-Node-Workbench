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
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-100 overflow-x-hidden">
      {/* 1. GLOBAL TOP APPLICATION HEADER */}
      <header className="min-h-14 bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md z-10 flex-shrink-0">
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
      {/* On mobile, we use 'p-0 h-[calc(100vh-56px)]' to maximize full-screen view. On desktop, we restore padding. */}
      <div className="flex-1 flex min-h-0 justify-center p-0 md:p-6 h-[calc(100vh-56px)] md:h-auto">
        {/* Changed 'flex' to 'flex-col md:flex-row' so the sidebar stacks on top of the chat panel on mobile. */}
        {/* Changed 'h-[650px]' to 'h-full md:h-[650px]' and dropped rounded corners on mobile to preserve layout real estate. */}
        <div className="w-full max-w-6xl h-full md:h-[650px] bg-slate-900 rounded-none md:rounded-2xl shadow-2xl border-0 md:border border-slate-800/80 overflow-hidden flex flex-col md:flex-row">
          {/* Persistent Left Navigation Sidebar */}
          <ChatHistorySidebar />

          {/* Main workspace window adapts its internal padding spacing dynamically */}
          <main className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-slate-800 min-w-0 h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
