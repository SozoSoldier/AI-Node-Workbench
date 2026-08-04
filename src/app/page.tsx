"use client"; // Commands Next.js to render this as an interactive client component

import { useEffect, useState } from "react";
import { LoginPage } from "../../src/LoginPage";
import { MainLayout } from "../../src/MainLayout";
import { useChatStore } from "../../src/store";

export default function Home() {
  const isAuthenticated = useChatStore((state) => state.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  // Prevents Next.js Server-Side Hydration mismatches with localStorage data
  useEffect(() => {
    // Defer execution until the current render cycle is fully finalized
    const animationFrameId = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    // Clean up the frame callback if the component happens to unmount early
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!isMounted) return null;

  // Route Guard Logic: If unauthorized, keep the operator locked onto the login grid
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginPage />
      </div>
    );
  }

  // If verified, displays side-by-side workspace layouts
  return <MainLayout />;
}
