import React from "react";
import { Link } from "react-router";

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Application Settings</h1>
      <p className="text-sm text-slate-400 mb-6">
        Configure your local mock AI tokens, stream frequencies, and system
        prompts here.
      </p>
      <Link to="/" className="text-indigo-400 hover:underline">
        ← Back to Chat Dashboard
      </Link>
    </div>
  );
};
