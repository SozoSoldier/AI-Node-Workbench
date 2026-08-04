import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface ModelFormData {
  modelName: string;
  temperature: number;
  systemPrompt: string;
  isMaxTokensEnabled: boolean;
  // Adds a new conditional field to TypeScript interface
  maxTokens: number | string;
}

export const AiModelForm: React.FC = () => {
  const [isSubmittingToApi, setIsSubmittingToApi] = useState(false);
  const [apiFeedback, setApiFeedback] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch, // Pulls the "watch" function from the useForm hook
    setValue,
    formState: { errors },
  } = useForm<ModelFormData>({
    defaultValues: {
      modelName: "",
      temperature: 0.7,
      systemPrompt: "",
      isMaxTokensEnabled: false,
      maxTokens: 2048,
    },
  });

  // Listen to the checkbox value in real-time (Equivalent to Angular's valueChanges)
  const isMaxTokensChecked = watch("isMaxTokensEnabled");

  useEffect(() => {
    const fetchExistingConfig = async () => {
      try {
        // Pull current data from the backend API to pre-populate the form fields
        const response = await fetch("/api/model-config");
        if (!response.ok)
          throw new Error("Could not contact backend node cluster");

        const serverData = await response.json();
        reset(serverData); // Populates the form fields instantly
      } catch (err) {
        console.error(
          "Failed to load initial form metadata from Node server",
          err,
        );
      }
    };
    fetchExistingConfig();
  }, [reset]);

  // NEW EFFECT: Watch the checkbox value and clear maxTokens when it is turned off
  useEffect(() => {
    if (!isMaxTokensChecked) {
      // Replaces Angular's this.form.patchValue({ maxTokens: '' })
      setValue("maxTokens", "", {
        shouldValidate: true, // Clean up any active error flags instantly
        shouldDirty: true,
      });
    }
  }, [isMaxTokensChecked, setValue]);

  const onSubmitHandler = async (data: ModelFormData) => {
    setIsSubmittingToApi(true);
    setApiFeedback(null);

    try {
      const response = await fetch("/api/submit-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if the response contains specific validation details from Zod
        if (result.details) {
          // Flatten the array properties into a single readable string block message
          const validationMessage = Object.values(result.details)
            .flat()
            .join(" | ");
          throw new Error(validationMessage);
        }
        throw new Error(result.error || "Server validation fault");
      }

      setApiFeedback(`✅ ${result.message}`);
    } catch (err: any) {
      setApiFeedback(`❌ Submission Failed: ${err.message}`);
    } finally {
      setIsSubmittingToApi(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl text-slate-100">
      <h2 className="text-xl font-bold text-indigo-400 mb-6">
        AI Model Parameter Studio
      </h2>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
        {/* Model Name */}
        <div>
          <label
            htmlFor="modelNameInput"
            className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
          >
            Model Node Name
          </label>
          <input
            id="modelNameInput"
            type="text"
            data-testid="model-name-field"
            {...register("modelName", {
              required: "Model Node Name is strictly required",
            })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          {errors.modelName && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ {errors.modelName.message}
            </p>
          )}
        </div>

        {/* Temperature */}
        <div>
          <label
            htmlFor="temperatureInput"
            className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
          >
            Creativity Index (Temperature)
          </label>
          <input
            id="temperatureInput"
            type="number"
            step="0.1"
            {...register("temperature", {
              required: true,
              valueAsNumber: true, // HIGHLIGHT: This forces the framework to cast the string to a number
              min: { value: 0, message: "Minimum boundary value is 0.0" },
              max: { value: 2, message: "Maximum boundary value is 2.0" },
            })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          {errors.temperature && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ {errors.temperature.message}
            </p>
          )}
        </div>

        {/* System Prompt */}
        <div>
          <label
            htmlFor="systemPromptInput"
            className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
          >
            System Instructions Prompt
          </label>
          <textarea
            id="systemPromptInput"
            rows={3}
            {...register("systemPrompt", {
              required: "System prompt blocks cannot be left empty",
            })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
          {errors.systemPrompt && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ {errors.systemPrompt.message}
            </p>
          )}
        </div>

        {/* Token Toggle Switch Checkbox */}
        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="isMaxTokensEnabledInput"
            data-testid="token-toggle-field"
            {...register("isMaxTokensEnabled")}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500 focus:ring-2"
          />
          <label
            htmlFor="isMaxTokensEnabledInput"
            className="text-sm font-medium text-slate-300 select-none"
          >
            Enforce Hard Cap Limits on Output Token Generation Cycles
          </label>
        </div>

        {/* 4. CONDITIONAL LAYOUT & VALIDATION ROW */}
        {/* If the checkbox is true, render this entire input block */}
        {isMaxTokensChecked && (
          <div
            data-testid="conditional-token-container"
            className="p-4 bg-slate-950 rounded-lg border border-slate-800 animate-fadeIn"
          >
            <label
              htmlFor="maxTokensInput"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
            >
              Max Token Cap Allocation
            </label>
            <input
              id="maxTokensInput"
              type="number"
              // Dynamically inject validation criteria: only require this if the box is checked
              {...register("maxTokens", {
                required: isMaxTokensChecked
                  ? "You must specify a token limit when caps are enabled"
                  : false,
                min: {
                  value: 1,
                  message: "Token allocation must be at least 1",
                },
                max: {
                  value: 32000,
                  message: "Local ceiling constraint is 32,000 tokens",
                },
              })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {errors.maxTokens && (
              <p className="text-xs text-red-400 mt-1">
                ⚠️ {errors.maxTokens.message}
              </p>
            )}
          </div>
        )}

        {/* Feedback Alert Banners */}
        {apiFeedback && (
          <div
            className={`p-3 rounded-lg text-xs font-medium border ${
              apiFeedback.includes("✅")
                ? "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                : "bg-red-950/20 border-red-900 text-red-400"
            }`}
          >
            {apiFeedback}
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Abort Changes
          </Link>
          <button
            type="submit"
            disabled={isSubmittingToApi}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmittingToApi ? "Syncing..." : "Commit Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
};
