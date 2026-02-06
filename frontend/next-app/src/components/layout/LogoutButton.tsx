"use client";

import { DoorOpen } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function LogoutButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [canHover, setCanHover] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkAuth();
        setCanHover(window.matchMedia('(hover: hover)').matches);

        window.addEventListener('storage', checkAuth);
        window.addEventListener('focus', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('focus', checkAuth);
        };
    }, [pathname]);

    // Reset confirmation if user clicks elsewhere
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsConfirming(false);
            }
        };

        if (isConfirming) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isConfirming]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setIsConfirming(false);
        router.push("/");
    };

    const showLogoutText = isConfirming || (canHover && isHovered);

    const handleClick = () => {
        if (showLogoutText) {
            handleLogout();
        } else {
            setIsConfirming(true);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <motion.button
            ref={buttonRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            className={`fixed top-6 right-6 z-[100] hidden md:flex items-center gap-3 px-5 py-3 backdrop-blur-md border rounded-2xl transition-all duration-300 shadow-2xl group ${showLogoutText
                ? "bg-rose-500/10 border-rose-500/40 text-rose-500"
                : "bg-white/5 border-white/10 text-campus-secondary/80"
                }`}
        >
            <div className="overflow-hidden flex items-center">
                <AnimatePresence mode="wait">
                    {showLogoutText ? (
                        <motion.span
                            key="logout"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
                        >
                            Logout
                        </motion.span>
                    ) : (
                        <motion.span
                            key="disguise"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                        >
                            Drop the Disguise 🕶️
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
            <DoorOpen className={`w-5 h-5 transition-transform duration-300 ${showLogoutText ? 'translate-x-1' : ''}`} />
        </motion.button>
    );
}
