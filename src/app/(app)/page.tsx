'use client'
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Shield, ChevronRight, LayoutDashboard, LogIn, Lock } from 'lucide-react';
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { useRouter } from 'next/navigation'
// --- Mock Data ---
const messages = [
  {
    title: "Project Alpha Feedback",
    content: "The team feels the timeline is too tight. We need more resources on the backend.",
    received: "10 mins ago"
  },
  {
    title: "Office Culture",
    content: "I really appreciate the flexible hours, but we need better coffee in the break room!",
    received: "2 hours ago"
  },
  {
    title: "Anonymous Report",
    content: "There is a recurring issue with the deployment pipeline that needs immediate attention.",
    received: "1 day ago"
  }
];

// --- Components (Simulating Shadcn UI for this single-file demo) ---

const Card = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
}> = ({ children, onClick, variant = 'primary', className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const variants: Record<'primary' | 'outline' | 'ghost', string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg shadow-indigo-500/20",
    outline: "border border-slate-700 hover:bg-slate-800 text-slate-300 focus:ring-slate-500",
    ghost: "hover:bg-slate-800/50 text-slate-400 hover:text-white"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Main Application ---

export default function App() {
  const {data:session}=useSession()
  const user:User=session?.user as User
  const router=useRouter()
  // Mock Session State for Demo purposes
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleNav = (path:string) => {
    router.push(path);
    console.log(`Navigating to: ${path}`);
    // In your actual Next.js app, use router.push(path)
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="w-full border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">TrueFeedback</span>
              </div>
              
              <div className="flex items-center gap-4">

                {session ? (
                  <Button variant="ghost" onClick={() => handleNav('/dashboard')} className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => handleNav('/signin')} className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-16 md:py-24">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
              Anonymous & Encrypted
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Dive into the World of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Anonymous Feedback
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Empower your organization with honest insights. Collect generic, encrypted feedback where identity remains a complete mystery.
            </p>
          </div>

          {/* Carousel / Features Section */}
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Value Props */}
            <div className="space-y-8 order-2 lg:order-1">
               <div className="flex gap-4">
                 <div className="flex-shrink-0 mt-1">
                   <div className="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-500/20">
                     <Lock className="w-5 h-5 text-indigo-400" />
                   </div>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-white">Total Anonymity</h3>
                   <p className="text-slate-400 mt-1">We don't track IP addresses or user agents. Your users can speak their minds freely.</p>
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="flex-shrink-0 mt-1">
                   <div className="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-500/20">
                     <MessageSquare className="w-5 h-5 text-indigo-400" />
                   </div>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-white">Instant Delivery</h3>
                   <p className="text-slate-400 mt-1">Feedback is delivered to your dashboard in real-time, allowing for immediate action.</p>
                 </div>
               </div>
            </div>

            {/* Right: The Carousel Visual */}
            <div className="order-1 lg:order-2 w-full max-w-md mx-auto relative">
              {/* Decorative glows */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
              
              <Card className="relative bg-slate-900 border-slate-700 shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">incoming_stream</span>
                </div>
                
                <div className="p-6 min-h-[200px] flex flex-col justify-between relative">
                  {/* Animated Content Transition */}
                  <div key={activeIndex} className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-indigo-500/10 rounded-full">
                        <Mail className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{messages[activeIndex].title}</h3>
                        <span className="text-xs text-slate-500 font-mono">{messages[activeIndex].received}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-1">
                      "{messages[activeIndex].content}"
                    </p>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    {messages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-20 w-full max-w-md mx-auto text-center">
             {session ? (
               <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                 <p className="text-indigo-200 mb-4">Welcome back, User.</p>
                 <Button onClick={() => handleNav('/dashboard')} className="w-full gap-2">
                   Go to Dashboard <ChevronRight className="w-4 h-4" />
                 </Button>
               </div>
             ) : (
               <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-xl">
                 <div className="bg-slate-950 rounded-xl p-6 text-center">
                   <h3 className="text-white font-semibold mb-2">Ready to start?</h3>
                   <p className="text-slate-400 text-sm mb-6">Join thousands of organizations improving through feedback.</p>
                   <Button onClick={() => handleNav('/signin')} variant="primary" className="w-full">
                     Create Your Account
                   </Button>
                   <p className="mt-4 text-xs text-slate-500">
                     No credit card required for basic accounts.
                   </p>
                 </div>
               </div>
             )}
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 bg-slate-950 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              © 2023 True Feedback. Built for privacy.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}