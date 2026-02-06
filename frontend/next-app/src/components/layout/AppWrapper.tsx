"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [showStreakMsg, setShowStreakMsg] = useState(false);

    useEffect(() => {
        const syncProfile = async () => {
            try {
                const res = await api.get("/profiles/me/");
                const userString = localStorage.getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);
                    user.profile = res.data;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                if (res.data.streak_increased) {
                    setShowStreakMsg(true);
                    setTimeout(() => setShowStreakMsg(false), 5000);
                }
            } catch (err) {
                console.error("Profile sync failed:", err);
            }
        };
        syncProfile();
    }, []);

    return (
        <>
            <div className="pb-24">
                {children}
            </div>

            <AnimatePresence>
                {showStreakMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-campus-card/90 backdrop-blur-3xl border border-campus-accent/30 rounded-2xl shadow-[0_0_30px_rgba(198,183,255,0.2)] flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-campus-accent/20 rounded-xl flex items-center justify-center">
                            <Flame className="w-6 h-6 text-campus-accent animate-pulse" />
                        </div>
                        <div>
                            <p className="text-white font-black italic text-sm">Streak saved!</p>
                            <p className="text-campus-secondary/60 text-[10px] font-bold uppercase tracking-wider">Come back tomorrow to keep it going.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav />
        </>
    );
}
