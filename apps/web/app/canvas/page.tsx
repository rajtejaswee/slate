"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, Plus, Search } from "lucide-react";
import BackgroundPaths from "@/app/components/BackgroundPaths";

export default function CanvasDashboard() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const handleJoinRoom = () => {
    if (roomId) {
      router.push(`/canvas/${roomId}`);
    }
  };

  const handleCreateRoom = () => {
    // Generate a random room ID (e.g., timestamp + random number)
    // In a real app, you might POST to backend to create a room entry first
    const newRoomId = Math.random().toString(36).substring(2, 9);
    router.push(`/canvas/${newRoomId}`);
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white text-zinc-900 font-sans selection:bg-zinc-100">
      <BackgroundPaths />

      {/* Header / Logout */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <span className="text-xl font-extrabold tracking-tighter" style={{ fontFamily: 'var(--font-bricolage)' }}>
          Slate.
        </span>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center">
        
        {/* --- OPTION 1: CREATE (Primary) --- */}
        <div className="flex-1 flex flex-col items-start gap-6">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Ready to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                start creating?
              </span>
            </h1>
            <p className="text-lg text-zinc-500 font-light max-w-md">
              Launch a new infinite canvas instantly. No setup required. Just you and your ideas.
            </p>
            
            <button 
              onClick={handleCreateRoom}
              className="group h-16 px-8 rounded-full bg-zinc-900 text-white text-lg font-semibold hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
            >
              <Plus className="h-6 w-6" />
              Create New Canvas
            </button>
        </div>

        {/* --- DIVIDER (Visual) --- */}
        <div className="hidden lg:flex flex-col items-center gap-4 opacity-30">
            <div className="w-px h-24 bg-zinc-400"></div>
            <span className="text-zinc-500 font-medium text-sm">OR</span>
            <div className="w-px h-24 bg-zinc-400"></div>
        </div>

        {/* --- OPTION 2: JOIN (Secondary) --- */}
        <div className="flex-1 w-full max-w-md bg-white/50 backdrop-blur-sm border border-zinc-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-zinc-100 text-zinc-600">
                    <Search className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900">Join a Room</h2>
                    <p className="text-sm text-zinc-500">Enter a code to collaborate</p>
                </div>
            </div>

            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="e.g. room-123"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                />
                <button 
                    onClick={handleJoinRoom}
                    disabled={!roomId}
                    className="h-12 px-6 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    Join <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>

      </main>
    </div>
  );
}