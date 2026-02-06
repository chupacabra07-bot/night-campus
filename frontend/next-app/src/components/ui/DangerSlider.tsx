"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Flame } from "lucide-react";

interface DangerSliderProps {
    onConfirm: () => void;
    isLoading?: boolean;
    label?: string;
    activeLabel?: string;
}

export function DangerSlider({
    onConfirm,
    isLoading = false,
    label = "Hold or swipe to delete",
    activeLabel = "Release to confirm"
}: DangerSliderProps) {
    const [isTriggered, setIsTriggered] = useState(false);
    const [isInteractionActive, setIsInteractionActive] = useState(false);
    const progress = useMotionValue(0);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Derived values
    const opacity = useTransform(progress, [0, 1], [0.5, 1]);
    const glowOpacity = useTransform(progress, [0, 1], [0, 0.6]);
    const fillWidth = useTransform(progress, (p) => `${p * 100}%`);

    // Handle Long Press / Hold Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isInteractionActive && !isTriggered && !isLoading) {
            interval = setInterval(() => {
                const currentX = x.get();
                const containerWidth = containerRef.current?.offsetWidth || 0;
                const maxDrag = Math.max(0, containerWidth - 64);

                // If the user isn't swiping much, let the hold progress take over
                if (currentX < maxDrag * 0.1) {
                    const currentProgress = progress.get();
                    if (currentProgress < 1) {
                        progress.set(currentProgress + 0.05); // ~1 second to fill
                    } else {
                        setIsTriggered(true);
                        if (typeof window !== 'undefined' && window.navigator.vibrate) {
                            window.navigator.vibrate(50);
                        }
                        clearInterval(interval);
                    }
                }
            }, 50);
        } else if (!isInteractionActive && !isTriggered) {
            // Snap back if released
            animate(progress, 0, { duration: 0.2 });
            animate(x, 0, { duration: 0.2 });
        }
        return () => clearInterval(interval);
    }, [isInteractionActive, isTriggered, progress, x, isLoading]);

    // Handle Swipe logic (sync x with progress)
    useEffect(() => {
        const unsubscribe = x.on("change", (latest) => {
            if (containerRef.current && !isTriggered && isInteractionActive) {
                const maxDrag = Math.max(0, containerRef.current.offsetWidth - 64);
                if (maxDrag > 0) {
                    const p = Math.min(Math.max(latest / maxDrag, 0), 1);
                    // Only update progress if the swipe is further than the hold progress
                    if (p > progress.get()) {
                        progress.set(p);
                    }
                    if (p >= 1) {
                        setIsTriggered(true);
                        if (typeof window !== 'undefined' && window.navigator.vibrate) {
                            window.navigator.vibrate(50);
                        }
                    }
                }
            }
        });
        return () => unsubscribe();
    }, [x, isTriggered, isInteractionActive, progress]);

    const handleStart = () => {
        if (isLoading) return;
        setIsInteractionActive(true);
    };

    const handleEnd = () => {
        setIsInteractionActive(false);
        if (isTriggered && !isLoading) {
            onConfirm();
        } else {
            // Reset state if not triggered
            setIsTriggered(false);
            animate(progress, 0, { duration: 0.2 });
            animate(x, 0, { duration: 0.2 });
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-16 bg-white/5 rounded-2xl border border-white/10 overflow-hidden select-none touch-none group"
        >
            {/* Background progress fill */}
            <motion.div
                className="absolute inset-y-0 left-0 bg-red-500/20 z-0"
                style={{ width: fillWidth }}
            />

            {/* Glow Overlay */}
            <motion.div
                className="absolute inset-0 bg-red-500/5 blur-xl pointer-events-none z-0"
                style={{ opacity: glowOpacity }}
            />

            {/* Label and Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <motion.div
                    className="flex items-center gap-3"
                    style={{ opacity }}
                >
                    <Flame className={`w-4 h-4 ${isTriggered ? 'text-red-500 animate-bounce' : 'text-red-500/50'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {isLoading ? "PURGING FROM THE VOID..." : isTriggered ? activeLabel : label}
                    </span>
                </motion.div>
            </div>

            {/* Interaction Handle */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: containerRef.current?.offsetWidth ? containerRef.current.offsetWidth - 64 : 0 }}
                dragElastic={0}
                dragMomentum={false}
                style={{ x }}
                onDragStart={handleStart}
                onDragEnd={handleEnd}
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                onTouchStart={handleStart}
                onTouchEnd={handleEnd}
                className="absolute left-1 top-1 bottom-1 w-14 bg-red-500 rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] z-20 group-hover:scale-[1.02] transition-transform"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                    <div className="flex gap-1.5">
                        <div className="w-1 h-5 bg-white/30 rounded-full" />
                        <div className="w-1 h-5 bg-white/30 rounded-full" />
                    </div>
                )}
            </motion.div>

            {/* Subtle Inner Shadow */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] z-30" />
        </div>
    );
}
