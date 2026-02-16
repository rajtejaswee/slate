import Link from "next/link";
import { ArrowRight, Github, Linkedin} from "lucide-react";
import BackgroundPaths from "@/app/components/BackgroundPaths" 

const GITHUB_URL = "https://github.com/rajtejaswee/slate";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full font-sans bg-white text-zinc-900 selection:bg-zinc-100 overflow-hidden flex flex-col">
      
      {/* --- BACKGROUND: Animated Curves + Grid --- */}
      <BackgroundPaths /> {/* The colored drawing lines */}
      
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
        }}
      />

      {/* --- Header --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 sm:px-12 flex justify-between items-center">
        {/* NEW BRANDING: Bricolage Font */}
        <span className="text-3xl font-extrabold tracking-tighter text-zinc-900" style={{ fontFamily: 'var(--font-bricolage)' }}>
          Slate.
        </span>
        
        {/* Optional: Login button in header for convenience */}
        <Link href="/signin" className="hidden sm:block text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Log in
        </Link>
      </header>

      {/* --- Hero Section --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        
        {/* Badge */}
        <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
             <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm text-xs font-medium text-zinc-500 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Public Beta
             </span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-zinc-900 leading-[1] mb-8 max-w-4xl animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
          Think Together, <br className="hidden sm:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
             Anywhere.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mb-12 animate-fade-in opacity-0" style={{ animationDelay: "0.3s" }}>
          The infinite canvas for teams who move fast.  <br className="hidden sm:block"/> 
          Sketch, collaborate, and build alongside with everyone.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center animate-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
            
            <Link
              href="/signin"
              className="group flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-zinc-900 text-white text-[16px] font-semibold transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-zinc-900/20 min-w-[180px]"
            >
              Start Drawing
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="fixed bottom-0 left-0 w-full p-6 sm:px-12 z-20 pointer-events-none flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
        
        <div className="pointer-events-auto flex items-center gap-3 text-xs text-zinc-500 font-medium bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-100 shadow-sm">
          <span>Built by <span className="text-zinc-900">Raj Tejaswee</span></span>
          <div className="h-3 w-[1px] bg-zinc-300 mx-1"></div>
          <div className="flex gap-2">
            <Link href="https://www.linkedin.com/in/raj-tejaswee-147603247/" target="_blank" className="hover:text-blue-600 transition-colors"><Linkedin className="h-3.5 w-3.5" /></Link>
            <Link href="https://github.com/rajtejaswee" target="_blank" className="hover:text-black transition-colors"><Github className="h-3.5 w-3.5" /></Link>
          </div>
        </div>

        <div className="pointer-events-auto flex gap-6 text-xs font-medium text-zinc-500 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-100 shadow-sm">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">Privacy</Link>
            <Link href={GITHUB_URL} target="_blank" className="hover:text-zinc-900 transition-colors">Source Code</Link>
        </div>

      </footer>
    </div>
  );
}