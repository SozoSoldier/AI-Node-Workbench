import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { MainLayout } from "./MainLayout"; // Master Layout Shell
import { ChatDashboard } from "./ChatDashboard";
import { ModelRegistry } from "./ModelRegistry";
import { AiModelForm } from "./AiModelForm";
import { LoginPage } from "./LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans">
              <LoginPage />
            </div>
          }
        />

        {/* NESTED PROTECTED PATHS LAYER */}
        {/* We place MainLayout inside ProtectedRoute, then list our sub-pages inside it */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* These sub-routes render seamlessly inside the layout's <Outlet /> */}
          <Route index element={<ChatDashboard />} />
          {/* index means matching default "/" */}
          <Route path="registry" element={<ModelRegistry />} />
          <Route path="settings" element={<AiModelForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
