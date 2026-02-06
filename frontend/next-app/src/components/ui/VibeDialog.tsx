"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { VibeButton } from "./VibeButton";
import { DangerSlider } from "./DangerSlider";

interface VibeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    body: string;
    confirmText: string;
    cancelText: string;
    variant?: 'danger' | 'neutral';
    isLoading?: boolean;
    error?: string | null;
}

export function VibeDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    body,
    confirmText,
    cancelText,
    variant = 'neutral',
    isLoading = false,
    error = null
}: VibeDialogProps) {
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
                        initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -1 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            rotate: 0,
                            x: [0, -5, 5, -5, 5, 0], // Shake animation
                        }}
                        transition={{
                            x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                            default: { duration: 0.2 }
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-md bg-campus-card/90 border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-2xl ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-campus-accent/10 text-campus-accent'}`}>
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-campus-secondary" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-white italic mb-3 leading-tight">
                                {title}
                            </h2>
                            <p className="text-sm text-campus-secondary/70 font-bold uppercase tracking-widest leading-relaxed mb-8">
                                {body}
                            </p>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 overflow-hidden"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {variant === 'danger' ? (
                                    <DangerSlider
                                        onConfirm={onConfirm}
                                        isLoading={isLoading}
                                        label={confirmText}
                                        activeLabel="RELEASE TO PURGE"
                                    />
                                ) : (
                                    <VibeButton
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        isLoading={isLoading}
                                        variant="primary"
                                        className="w-full"
                                    >
                                        {confirmText}
                                    </VibeButton>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-white/5 text-campus-secondary/40 hover:text-campus-secondary hover:bg-white/10 border border-white/5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        {/* Aesthetic Glow */}
                        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[100px] opacity-10 rounded-full ${variant === 'danger' ? 'bg-red-500' : 'bg-campus-accent'}`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
