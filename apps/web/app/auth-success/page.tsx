'use client';

import { useEffect, useState, Suspense } from "react"; // Added Suspense
import { useRouter, useSearchParams } from "next/navigation";

// 1. Move your logic into this inner component
function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Store the token
      localStorage.setItem("token", token);
      
      // 2. Redirect to Canvas
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
        {/* Simple Loading Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
        <p className="text-sm font-medium text-zinc-500">Securing your session...</p>
      </div>
    </div>
  );
}

// 2. Export the main page which wraps the content in Suspense
export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}