"use client";
import { useRouter } from "next/navigation";
import { ModelRegistry } from "../../../src/ModelRegistry";
import { MainLayout } from "../../MainLayout";
import { useChatStore } from "../../store";
import { useEffect, useState } from "react";

export default function RegistryPage() {
  const isAuthenticated = useChatStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <MainLayout>
      <ModelRegistry />
    </MainLayout>
  );
}
