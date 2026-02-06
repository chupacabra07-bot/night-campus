"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Zap, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "THE WALL", icon: Home, path: "/home" },
        { name: "Matches", icon: Heart, path: "/matches" },
        { name: "Vote", icon: Zap, path: "/vote" },
        { name: "Events", icon: Bell, path: "/events" },
        { name: "Profile", icon: User, path: "/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pointer-events-none">
            <div className="max-w-md mx-auto h-20 bg-campus-card/60 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl flex items-center justify-around px-4 pointer-events-auto">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <Link key={tab.name} href={tab.path} className="relative flex flex-col items-center gap-1 group">
                            <div className="relative">
                                <tab.icon className={`w-6 h-6 transition-all ${isActive ? 'text-campus-accent' : 'text-campus-secondary group-hover:text-white'}`} />
                                {tab.name === "THE WALL" && (
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute inset-0 bg-campus-accent/20 blur-lg rounded-full -z-10"
                                    />
                                )}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-campus-accent' : 'text-campus-secondary/60'}`}>
                                {tab.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -top-4 w-1 h-1 bg-campus-accent rounded-full shadow-[0_0_10px_2px_rgba(198,183,255,0.8)]"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
