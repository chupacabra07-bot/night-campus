"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Users, Calendar, ArrowRight, Sparkles, Zap, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [showLore, setShowLore] = useState(false);

  const handleCardClick = useCallback((target: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.push(target);
    } else {
      router.push('/login');
    }
  }, [router]);


  const loreLines = [
    "Welcome to Night Campus, where productivity goes to die.",
    "This is what happens when students get Wi-Fi after midnight.",
    "You build a “vibe” because personality is easier than assignments.",
    "Pick interests so the algorithm can judge you silently.",
    "Yes, we turn your chaos into match suggestions. You’re welcome.",
    "Like people. Get liked back. Boom, social life unlocked.",
    "No mutual like? Congratulations, character development.",
    "The Wall is where thoughts go instead of your notes app.",
    "Post memes, feelings, or academic breakdowns. All valid content.",
    "Events exist so you can say “I might come” and never show up.",
    "Friends mode is for people who say they’re “not here for dating.” Sure.",
    "Chat opens after matching so you can overthink every reply.",
    "Everything is student-only, so at least the drama is local.",
    "“Read the Lore” just means this app has a backstory instead of therapy.",
    "Anyway, welcome. Your GPA didn’t need you tonight."
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-campus-dark selection:bg-campus-accent/30">
      {/* Top Header */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-campus-accent" />
            <span className="font-black text-xl tracking-tighter">NIGHT CAMPUS</span>
          </div>
          <Link href="/login"
            className="btn-gold">
            Login
          </Link>
        </div>
      </header>

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-campus-accent/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-campus-highlight/10 blur-[120px] rounded-full" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[95vh] px-6 pt-32 pb-20 text-center max-w-5xl mx-auto">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-campus-highlight animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-campus-secondary">
            RGUKT RK Valley Exclusive
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6">
          Your Campus. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-accent to-campus-highlight glow-accent">
            Unfiltered.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-campus-secondary max-w-2xl mb-12 font-medium leading-relaxed">
          The late-night lore, the hidden crushes, and the secret vibes.
          Connect with your campus like never before.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
              if (token) router.push('/home');
              else router.push('/signup');
            }}
            className="px-10 py-5 bg-gradient-to-r from-campus-accent to-campus-accent/80 text-campus-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-campus-accent/20 text-lg">
            Enter the Night
          </button>
          <button
            onClick={() => setShowLore(true)}
            className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all backdrop-blur-lg text-lg">
            Read the Lore
          </button>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <button
            onClick={() => handleCardClick('/wall')}
            className="glass-card p-6 rounded-3xl text-left hover:border-campus-accent/40 transition-all group hover:-translate-y-1 w-full flex flex-col items-start cursor-pointer group"
          >
            <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">🔥</div>
            <div className="text-white font-black text-xl flex items-center justify-between w-full">
              Top Lore
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
            <div className="text-campus-secondary text-sm mt-1">Peek into the most explosive rants and anonymous confessions.</div>
          </button>

          <button
            onClick={() => handleCardClick('/matches')}
            className="glass-card p-6 rounded-3xl text-left hover:border-campus-highlight/40 transition-all group relative overflow-hidden hover:-translate-y-1 w-full flex flex-col items-start cursor-pointer"
          >
            <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">🤐</div>
            <div className="text-white font-black text-xl flex items-center justify-between w-full">
              Secret Match
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
            <div className="text-campus-secondary text-sm mt-1">Our vibe-check algorithm pairs you with local souls based on your energy.</div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-campus-highlight to-transparent opacity-0 group-hover:opacity-100 transition-all" />
          </button>

          <button
            onClick={() => handleCardClick('/events')}
            className="glass-card p-6 rounded-3xl text-left hover:border-campus-accent/40 transition-all group hover:-translate-y-1 w-full flex flex-col items-start cursor-pointer"
          >
            <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
            <div className="text-white font-black text-xl flex items-center justify-between w-full">
              Campus Event
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
            <div className="text-campus-secondary text-sm mt-1">Never miss the night. Real-time updates on block parties and meetups.</div>
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-16 tracking-tight">How the Night Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-campus-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-campus-accent" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Build Your Vibe</h3>
              <p className="text-campus-secondary text-sm leading-relaxed max-w-[250px] mx-auto opacity-70">
                Create your profile with thematic aliases and select your social energy.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-campus-highlight/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-campus-highlight" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Discover Matches</h3>
              <p className="text-campus-secondary text-sm leading-relaxed max-w-[250px] mx-auto opacity-70">
                Find people whose vibes sync with yours. Discover friends or more.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-campus-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-campus-accent" />
              </div>
              <h3 className="text-xl font-bold text-white">3. Join the Lore</h3>
              <p className="text-campus-secondary text-sm leading-relaxed max-w-[250px] mx-auto opacity-70">
                Chat, RSVP to events, and post on the wall to become campus legend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lore Overlay */}
      <AnimatePresence>
        {showLore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-campus-dark/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full glass-card p-10 rounded-[3rem] border-white/10 relative max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              <button
                onClick={() => setShowLore(false)}
                className="absolute top-8 right-8 p-2 text-campus-secondary/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-campus-accent to-campus-highlight mb-2">The Sacred Lore</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-campus-secondary/40">Updated after midnight</p>
              </div>

              <div className="space-y-6 pt-4 text-center">
                {loreLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-2 group"
                  >
                    <p className="text-campus-secondary text-lg font-medium leading-relaxed group-hover:text-white transition-all duration-500">
                      {line.split(/(\“.*?\”)/).map((part, index) =>
                        part.startsWith('“') ? <span key={index} className="text-campus-highlight font-black italic">{part}</span> : part
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <footer className="relative z-10 py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-campus-secondary/40">
            © 2026 Night Campus. Built instead of doing assignments.
          </p>
        </div>
      </footer>
    </main>
  );
}
