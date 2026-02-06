"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { VibeButton } from "@/components/ui/VibeButton";

interface MutualVibeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onViewPlan: () => void;
}

export function MutualVibeModal({ isOpen, onClose, onViewPlan }: MutualVibeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-campus-dark/95 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 40 }}
                        className="w-full max-w-md bg-campus-card border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden text-center p-12"
                    >
                        {/* Big Heart Animation */}
                        <div className="relative mb-12">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-24 h-24 bg-campus-accent/20 rounded-full flex items-center justify-center mx-auto"
                            >
                                <Heart className="w-12 h-12 text-campus-accent fill-campus-accent" />
                            </motion.div>

                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-campus-accent/30 rounded-full scale-110"
                            />
                        </div>

                        <h2 className="text-4xl font-black text-white italic mb-4">
                            It&apos;s a Mutual Vibe
                        </h2>
                        <p className="text-sm text-campus-secondary/70 font-bold uppercase tracking-widest leading-relaxed mb-12">
                            Both of you are open to meeting. The stars aligned, or maybe just your chaos brain types.
                        </p>

                        <div className="flex flex-col gap-4">
                            <VibeButton
                                onClick={onViewPlan}
                                variant="primary"
                                className="w-full py-5 group"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    See Meeting Plan
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </VibeButton>

                            <button
                                onClick={onClose}
                                className="text-[10px] font-black uppercase tracking-widest text-campus-secondary/40 hover:text-white transition-colors"
                            >
                                Later
                            </button>
                        </div>

                        {/* Aesthetic Glow */}
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-campus-accent/20 blur-[100px] rounded-full -z-10" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-campus-highlight/20 blur-[100px] rounded-full -z-10" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
