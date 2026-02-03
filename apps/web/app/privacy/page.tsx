'use client';

import Link from 'next/link';
import BackgroundPaths from '@/app/components/BackgroundPaths';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen w-full font-sans bg-white text-zinc-900 selection:bg-zinc-100 overflow-hidden flex flex-col">
      
      {/* --- BACKGROUND: Syncs with Home/Auth --- */}
      <BackgroundPaths />

      {/* --- Header --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 sm:px-12 flex justify-between items-center bg-white/50 backdrop-blur-sm border-b border-zinc-100/50">
        <Link 
            href="/" 
            className="text-3xl font-extrabold tracking-tighter text-zinc-900 hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-bricolage)' }}
        >
          Slate.
        </Link>
        
        <Link 
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
        </Link>
      </header>

      {/* --- Main Content --- */}
      <main className="relative z-10 flex-1 pt-32 pb-24 px-6 sm:px-12">
        <div className="max-w-3xl mx-auto">
            
            {/* Title Section (Styled like Auth Pages) */}
            <div className="mb-16">
                <h1 className="font-extrabold tracking-tight text-zinc-900 mb-8 flex flex-col">
                    {/* Massive Gradient Text */}
                    <span className="text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
                        Privacy
                    </span>
                    
                    {/* Smaller, tighter text */}
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-800 tracking-tight mt-[-5px]">
                        policy.
                    </span>
                </h1>

                <p className="text-lg text-zinc-500 font-light leading-relaxed">
                   Last updated: February 3, 2026. <br />
                   We believe your ideas belong to you. Here is how we protect them.
                </p>
            </div>

            {/* Document Text */}
            <div className="space-y-12 text-zinc-600 leading-7">
                
                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">1</span>
                        Information We Collect
                    </h2>
                    <p className="mb-4">
                        When you use Slate, we collect information that you provide directly to us. This includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-zinc-300">
                        <li><strong>Account Information:</strong> Your name, email address, and password when you create an account.</li>
                        <li><strong>Canvas Data:</strong> The diagrams, drawings, text, and other content you create on your whiteboard.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our interface (e.g., timestamps, features used) to help us improve performance.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">2</span>
                        How We Use Your Data
                    </h2>
                    <p>
                        We use your information strictly to provide and improve the Slate experience. We do not sell your data to advertisers.
                        We use your data to:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2 marker:text-zinc-300">
                        <li>Sync your diagrams across devices in real-time.</li>
                        <li>Authenticate your access to your private boards.</li>
                        <li>Debug technical issues and improve application speed.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">3</span>
                        Data Security
                    </h2>
                    <p>
                        We take security seriously. Your data is encrypted at rest (in our database) and in transit (using SSL/TLS).
                        While no service is 100% secure, we implement industry-standard best practices to ensure your sketches remain private.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">4</span>
                        Contact Developer
                    </h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact the developer directly at <a href="mailto:rajtejaswee02@gmail.com" className="text-indigo-500 hover:underline font-medium">rajtejaswee02@gmail.com</a>.
                    </p>
                </section>

            </div>

            {/* Bottom Divider */}
            <div className="h-px w-full bg-zinc-100 my-16"></div>

            <p className="text-sm text-zinc-400">
                © 2026 Slate Inc. All rights reserved.
            </p>

        </div>
      </main>

    </div>
  );
}