"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../store";
import { MainLayout } from "../../MainLayout";
import { AiModelForm } from "../../AiModelForm";

export default function SettingsPage() {
  const isAuthenticated = useChatStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Client-side guard check: if not logged in, boot them back to home instantly
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <MainLayout>
      <AiModelForm />
    </MainLayout>
  );
}
