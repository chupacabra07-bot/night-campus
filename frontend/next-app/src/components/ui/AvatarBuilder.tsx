"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RefreshCw, HelpCircle } from 'lucide-react';
import { Avatar, AVATAR_PARTS } from './Avatar';

interface AvatarBuilderProps {
    onSave: (config: any) => void;
    onClose: () => void;
    initialConfig?: any;
}

export const AvatarBuilder = ({ onSave, onClose, initialConfig }: AvatarBuilderProps) => {
    const [config, setConfig] = useState(initialConfig || {
        face: 'neutral',
        eyes: 'dots',
        headVibe: 'none',
        accessories: 'none',
        color: '#C6B7FF'
    });
    const [isShuffling, setIsShuffling] = useState(false);

    const CATEGORIES = [
        { id: 'face', label: 'Face Shape', options: Object.keys(AVATAR_PARTS.face) },
        { id: 'eyes', label: 'Eyes', options: Object.keys(AVATAR_PARTS.eyes) },
        { id: 'headVibe', label: 'Head Vibe', options: Object.keys(AVATAR_PARTS.headVibe) },
        { id: 'accessories', label: 'Extras', options: Object.keys(AVATAR_PARTS.accessories) }
    ];

    const COLORS = ['#C6B7FF', '#FFE8A3', '#FFB7B7', '#B7FFD8', '#B7E9FF', '#FFFFFF'];

    const randomize = () => {
        setIsShuffling(true);
        const shuffleInterval = setInterval(() => {
            setConfig({
                face: Object.keys(AVATAR_PARTS.face)[Math.floor(Math.random() * Object.keys(AVATAR_PARTS.face).length)],
                eyes: Object.keys(AVATAR_PARTS.eyes)[Math.floor(Math.random() * Object.keys(AVATAR_PARTS.eyes).length)],
                headVibe: Object.keys(AVATAR_PARTS.headVibe)[Math.floor(Math.random() * Object.keys(AVATAR_PARTS.headVibe).length)],
                accessories: Object.keys(AVATAR_PARTS.accessories)[Math.floor(Math.random() * Object.keys(AVATAR_PARTS.accessories).length)],
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
            });
        }, 100);

        setTimeout(() => {
            clearInterval(shuffleInterval);
            setIsShuffling(false);
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-campus-dark/95 backdrop-blur-xl flex flex-col md:flex-row"
        >
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-white/40 hover:text-white z-10"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
                {/* Vignette/Glow Background */}
                <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-50" />

                <motion.div
                    animate={isShuffling ? {
                        scale: [1, 1.1, 0.9, 1.05, 1],
                        rotate: [0, 5, -5, 2, 0]
                    } : {}}
                    className="relative group z-10"
                >
                    <Avatar config={config} className="w-72 h-72 md:w-[400px] md:h-[400px]" />
                    <div className="absolute inset-0 bg-campus-accent/20 blur-[120px] -z-10 animate-pulse" />
                </motion.div>

                <div className="mt-12 text-center z-10">
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Build Your Identity</h2>
                    <p className="text-campus-secondary/60 text-sm font-bold uppercase tracking-[0.2em]">No real face, all real vibes.</p>
                </div>

                <button
                    onClick={randomize}
                    disabled={isShuffling}
                    className="mt-12 flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-campus-accent font-black transition-all text-sm uppercase tracking-widest border border-white/5"
                >
                    <RefreshCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                    Surprise Me
                </button>
            </div>

            {/* Editor Area */}
            <div className="w-full md:w-[480px] flex flex-col h-full bg-white/[0.01] backdrop-blur-sm">
                <div className="flex-1 p-8 overflow-y-auto space-y-12 hide-scrollbar">
                    {/* Color Picker */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-campus-secondary">Vibe Color</label>
                            <div className="group relative">
                                <HelpCircle className="w-3 h-3 text-campus-secondary/40 cursor-help" />
                                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-campus-dark border border-white/10 rounded-lg text-[10px] text-campus-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    This sets your avatar's overall energy.
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setConfig({ ...config, color: c })}
                                    className={`w-12 h-12 rounded-full border-4 transition-all shadow-xl ${config.color === c ? "border-campus-accent scale-110 shadow-campus-accent/20" : "border-transparent opacity-40 hover:opacity-100"}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </section>

                    {CATEGORIES.map(cat => (
                        <section key={cat.id} className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-campus-secondary">{cat.label}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {cat.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setConfig({ ...config, [cat.id]: opt })}
                                        className={`p-4 rounded-2xl border transition-all text-[10px] font-bold uppercase tracking-widest ${config[cat.id as keyof typeof config] === opt
                                            ? "bg-campus-accent/20 border-campus-accent/40 text-campus-accent"
                                            : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="p-8 border-t border-white/5 bg-campus-dark/50">
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-campus-secondary/40 mb-4">
                        This is how others see you tonight.
                    </p>
                    <button
                        onClick={() => onSave(config)}
                        className="w-full bg-campus-accent text-campus-dark py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-campus-accent/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
                    >
                        <Check className="w-6 h-6" />
                        Save Identity
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
