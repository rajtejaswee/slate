'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Sub-component for logic
function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/canvas");
    } else {
      setError(true);
      setTimeout(() => router.push("/signin"), 3000);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-xl font-bold text-zinc-900">Login Failed</h1>
          <p className="text-zinc-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
        <p className="text-sm font-medium text-zinc-500">Securing your session...</p>
      </div>
    </div>
  );
}

// Main Page Component with Suspense
export default function AuthSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}