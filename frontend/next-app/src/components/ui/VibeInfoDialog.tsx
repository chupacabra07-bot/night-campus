"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Sparkles, Flame } from "lucide-react";
import { VibeButton } from "./VibeButton";

interface VibeInfoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: string;
    subtext?: string;
    buttonText?: string;
    icon?: 'info' | 'sparkles' | 'flame';
}

export function VibeInfoDialog({
    isOpen,
    onClose,
    title,
    body,
    subtext,
    buttonText = "Got it",
    icon = 'info'
}: VibeInfoDialogProps) {
    const Icons = {
        info: Info,
        sparkles: Sparkles,
        flame: Flame
    };
    const SelectedIcon = Icons[icon];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-campus-dark/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-sm bg-campus-card/90 border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="p-3 rounded-2xl bg-campus-accent/10 text-campus-accent mb-6">
                                <SelectedIcon className="w-6 h-6" />
                            </div>

                            <h2 className="text-xl font-black text-white italic mb-3">
                                {title}
                            </h2>
                            <p className="text-sm text-campus-secondary font-bold uppercase tracking-widest leading-relaxed mb-4">
                                {body}
                            </p>

                            {subtext && (
                                <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-[0.2em] mb-8">
                                    {subtext}
                                </p>
                            )}

                            <VibeButton
                                onClick={onClose}
                                variant="primary"
                                className="w-full py-4 text-[10px]"
                            >
                                {buttonText}
                            </VibeButton>
                        </div>

                        {/* Aesthetic Glow */}
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[80px] opacity-10 rounded-full bg-campus-accent" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
