import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AIModel {
  id: string;
  name: string;
  type: string;
}

export const ModelRegistry: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/framework-registry");

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Unexpected data payload signature received");
        }

        const formattedModels: AIModel[] = data.results.map((item: any) => ({
          id: item.name,
          name: item.name,
          type: "Open Source AI Extension",
        }));

        setModels(formattedModels);
      } catch (err: any) {
        setError(err.message || "Something went wrong fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-slate-400 animate-pulse">
        Loading framework entries...
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-red-400 bg-red-950/20 border border-red-900 rounded-lg m-4">
        ⚠️ Data Sync Fault: {error}
      </div>
    );

  return (
    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl max-w-md text-slate-100">
      <h2 className="text-xl font-bold text-indigo-400 mb-4">
        Sample Framework Registry
      </h2>
      <ul className="space-y-2">
        {models.map((model) => (
          <li
            key={model.id}
            className="p-3 bg-slate-900 rounded-lg border border-slate-700/50 flex justify-between items-center"
          >
            <span className="font-semibold text-sm text-slate-200">
              {model.name}
            </span>
            <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
              {model.type}
            </span>
          </li>
        ))}
      </ul>

      {/* Navigation section added to the bottom of the registry card */}
      <div className="border-t border-slate-700/60 pt-4 mt-6">
        <Link
          href="/"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          ← Back to Chat Dashboard
        </Link>
      </div>
    </div>
  );
};
