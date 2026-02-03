'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import BackgroundPaths from '@/app/components/BackgroundPaths';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:3001/api/v1/auth/signup', {
        name,
        email,
        password,
      });

      toast.success('Account created. Please sign in.');
      router.push('/signin');
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Sign up failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans bg-white text-zinc-900 selection:bg-zinc-100 overflow-hidden flex flex-col">
      
      {/* --- BACKGROUND: Animated Curves + Grid --- */}
      <BackgroundPaths />

      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
        }}
      />

      {/* Brand Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 sm:px-12">
        <Link 
            href="/" 
            className="text-3xl font-extrabold tracking-tighter text-zinc-900 hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          Slate.
        </Link>
      </header>

      {/* --- MAIN SPLIT LAYOUT --- */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-0">
        
        {/* LEFT SIDE: Big Gradient Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start lg:pr-16 mb-12 lg:mb-0 pt-16 lg:pt-0">
            <h1 className="font-extrabold tracking-tight text-zinc-900 mb-6 flex flex-col">
              {/* Massive Gradient Text */}
              <span className="text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
                Start
              </span> 
              
              {/* Smaller, tighter text */}
              <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-800 tracking-tight mt-[-4px]">
                journey on the canvas.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-500 font-light leading-relaxed max-w-lg">
              Create an account to begin sketching, diagramming, and collaborating with your team in real-time.
            </p>
        </div>

        {/* RIGHT SIDE: The Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px] relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] p-8 sm:p-10">
            
            {/* Card Header */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-2">
                Create account
              </h2>
              <p className="text-sm text-zinc-500">
                Enter your details below to create your workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-5" noValidate>
              
              {/* Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-zinc-500 tracking-wide uppercase"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full h-11 px-3 text-[15px] text-zinc-900 placeholder-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-zinc-500 tracking-wide uppercase"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@work-email.com"
                  className="w-full h-11 px-3 text-[15px] text-zinc-900 placeholder-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-zinc-500 tracking-wide uppercase"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="w-full h-11 px-3 text-[15px] text-zinc-900 placeholder-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200 transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-2 flex items-center justify-center rounded-lg bg-zinc-900 text-white text-[14px] font-semibold tracking-wide hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
                ) : (
                    'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-zinc-400">Or continue with</span>
                </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => window.location.href = "http://localhost:3001/api/v1/auth/google"}
                    className="flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </button>
                <button 
                    onClick={() => window.location.href = "http://localhost:3001/api/v1/auth/github"}
                    className="flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="h-4 w-4 fill-black" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                </button>
            </div>

            {/* Bottom Link */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="font-medium text-zinc-900 hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}