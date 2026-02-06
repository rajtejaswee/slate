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
    const newRoomId = Math.random().toString(36).substring(2, 9);
    router.push(`/canvas/${newRoomId}`);
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen w-full font-sans bg-white text-zinc-900 selection:bg-zinc-100 overflow-hidden flex flex-col">
      
      {/* --- BACKGROUND --- */}
      <BackgroundPaths />
      
      {/* Optional: Dot pattern overlay (matches SignIn) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
        }}
      />

      {/* --- HEADER --- */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-6 sm:px-12 flex justify-between items-center">
        <span className="text-3xl font-extrabold tracking-tighter text-zinc-900" style={{ fontFamily: 'var(--font-bricolage)' }}>
          Slate.
        </span>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors bg-white/50 px-4 py-2 rounded-full border border-zinc-100 backdrop-blur-sm"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {/* --- MAIN CONTENT (Using SignIn Layout Structure) --- */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-0">
        
        {/* --- LEFT SIDE: Big Text & Create Button --- */}
        {/* --- LEFT SIDE: Big Text & Create Button --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:pr-12 mb-12 lg:mb-0 pt-16 lg:pt-0">
            <h1 className="font-extrabold tracking-tight text-zinc-900 mb-6 flex flex-col">
              {/* Adjusted text sizes: 4xl for mobile, 5xl for tablet, 8xl for desktop */}
              <span className="text-4xl sm:text-5xl lg:text-8xl leading-[0.9]">
                Ready to
              </span>
              <span className="text-4xl sm:text-5xl lg:text-8xl leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
                start creating?
              </span>
            </h1>
            
            <p className="text-base sm:text-lg sm:text-xl text-zinc-500 font-light leading-relaxed max-w-lg mb-8">
              Launch a new infinite canvas instantly. No setup required. Just you and your ideas.
            </p>
            
            <button 
              onClick={handleCreateRoom}
              // Added 'w-full sm:w-auto' and 'justify-center' for better mobile tapping
              className="group w-full sm:w-auto h-14 px-8 rounded-full bg-zinc-900 text-white text-lg font-semibold hover:bg-zinc-800 transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Plus className="h-6 w-6" />
              Create New Canvas
            </button>
        </div>

        {/* --- DIVIDER (Hidden on mobile, subtle on Desktop) --- */}
        <div className="hidden lg:flex flex-col items-center justify-center px-8 opacity-20">
            <div className="w-px h-32 bg-zinc-400"></div>
            <span className="text-zinc-500 font-medium text-sm my-4">OR</span>
            <div className="w-px h-32 bg-zinc-400"></div>
        </div>

        {/* --- RIGHT SIDE: Join Room Card --- */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px] relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] p-8 sm:p-10">
            
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-zinc-50 text-zinc-600 border border-zinc-100">
                    <Search className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Join a Room</h2>
                    <p className="text-sm text-zinc-500">Enter a code to collaborate</p>
                </div>
            </div>

            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="e.g. room-123"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                    className="w-full px-4 text-zinc-900 placeholder-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all font-mono text-sm"
                />
                <button 
                    onClick={handleJoinRoom}
                    disabled={!roomId}
                    className="w-full h-12 flex items-center justify-center rounded-lg bg-zinc-900 text-white text-[15px] font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2"
                >
                    Join Room <ArrowRight className="h-4 w-4" />
                </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}