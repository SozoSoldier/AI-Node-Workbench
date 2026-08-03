import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Replaces Angular's Router
import { useChatStore } from "./store";

interface LoginFormData {
  usernameField: string;
  passwordField: string;
}

export const LoginPage: React.FC = () => {
  const loginAction = useChatStore((state) => state.login);
  // FIX: Change 'useNavigate()' to the Next.js 'useRouter()' hook
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onLoginSubmit = (data: LoginFormData) => {
    setErrorMessage(null);

    if (
      data.usernameField === "admin" &&
      data.passwordField === "password123"
    ) {
      loginAction(data.usernameField);

      // FIX: Change 'navigate("/")' to 'router.push("/")'
      router.push("/");
    } else {
      setErrorMessage(
        "❌ Invalid Security Credentials. Please review the cheat sheet guidelines below.",
      );
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl text-slate-100 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-400">
          AI Cluster Control Portal
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Authenticate to access neural node telemetry links
        </p>
      </div>

      <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Username
          </label>
          <input
            type="text"
            {...register("usernameField", {
              required: "Username input block cannot be empty",
            })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          {errors.usernameField && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ {errors.usernameField.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("passwordField", {
              required: "Password validation string is required",
            })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          {errors.passwordField && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ {errors.passwordField.message}
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/20 border border-red-900 text-red-400 text-xs font-medium rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 mt-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          Log In
        </button>
      </form>

      {/* Requested Mock Credential Instruction Matrix Card */}
      <div className="mt-8 p-4 bg-slate-950 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
          📋 Testing Credentials Cheat Sheet
        </p>
        <p>
          <span className="text-slate-500 font-medium">Test User Account:</span>{" "}
          <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">
            admin
          </code>
        </p>
        <p>
          <span className="text-slate-500 font-medium">Test Pass Phrase:</span>{" "}
          <code className="text-indigo-300 font-mono bg-slate-900 px-1 py-0.5 rounded">
            password123
          </code>
        </p>
      </div>
    </div>
  );
};
