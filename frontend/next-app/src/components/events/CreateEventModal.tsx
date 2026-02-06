"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, MapPin, Type, AlignLeft, Sparkles, Lock, Trophy, Clock, Bell } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibeButton } from "@/components/ui/VibeButton";
import api from "@/lib/api";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
    userScore: number;
}

const CATEGORIES = [
    { id: 'party', label: '🎉 Party' },
    { id: 'workshop', label: '📚 Workshop' },
    { id: 'sports', label: '⚽ Sports' },
    { id: 'meetup', label: '🤝 Meetup' },
    { id: 'other', label: '✨ Other' },
];

export function CreateEventModal({ isOpen, onClose, onCreated, userScore }: CreateEventModalProps) {
    const isLocked = userScore < 150;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        event_type: "meetup",
        start_time: "",
        end_time: "",
        notifications: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/events/", formData);
            onCreated();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                        className="w-full max-w-xl relative"
                    >
                        <GlassCard className="p-8 border-white/10 shadow-[0_0_50px_rgba(198,183,255,0.15)]">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-colors text-campus-secondary"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {isLocked ? (
                                <div className="text-center py-12 space-y-8">
                                    <div className="w-24 h-24 bg-campus-accent/10 rounded-full flex items-center justify-center mx-auto border border-campus-accent/20">
                                        <Lock className="w-10 h-10 text-campus-accent" />
                                    </div>
                                    <div className="space-y-3 px-6">
                                        <h2 className="text-3xl font-black text-white italic">Event Creation Locked</h2>
                                        <p className="text-sm text-campus-secondary font-medium leading-relaxed">
                                            Only established students can propose campus vibes. Reach 150 Lore Score to unlock this power.
                                        </p>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 mx-6 flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest">Current Score</p>
                                            <p className="text-2xl font-black text-campus-accent">{userScore}</p>
                                        </div>
                                        <Trophy className="w-8 h-8 text-campus-accent/20" />
                                    </div>
                                    <VibeButton onClick={onClose} className="w-full max-w-xs mx-auto">
                                        Got it
                                    </VibeButton>
                                    <button className="block w-full text-[10px] font-black uppercase tracking-widest text-campus-accent/40 hover:text-campus-accent transition-colors">
                                        How to earn Lore?
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2 mb-8">
                                        <h2 className="text-2xl font-black text-white flex items-center gap-3 italic">
                                            <Sparkles className="text-campus-accent w-6 h-6" />
                                            Propose a Vibe
                                        </h2>
                                        <div className="px-4 py-2 bg-campus-accent/10 border border-campus-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-campus-accent flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            🗳️ This event will be posted after {userScore >= 300 ? 8 : 10} student votes {userScore >= 300 && "(Lore Perk Applied!)"}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <Type className="absolute left-4 top-4 w-5 h-5 text-campus-secondary/40 group-focus-within:text-campus-accent transition-colors" />
                                            <input
                                                required
                                                placeholder="Event Title..."
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-campus-secondary/40 focus:bg-white/10 focus:border-campus-accent/40 focus:outline-none transition-all font-bold"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <CalendarIcon className="absolute left-4 top-4 w-5 h-5 text-campus-secondary/40 group-focus-within:text-campus-accent transition-colors" />
                                                <div className="absolute left-12 top-1.5 text-[8px] font-black uppercase tracking-widest text-campus-accent/40">Starts</div>
                                                <input
                                                    required
                                                    type="datetime-local"
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pt-6 pb-3 pl-12 pr-4 text-white placeholder:text-campus-secondary/40 focus:bg-white/10 focus:border-campus-accent/40 focus:outline-none transition-all font-bold [color-scheme:dark] text-sm"
                                                    value={formData.start_time}
                                                    onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                                                />
                                            </div>
                                            <div className="relative group">
                                                <Clock className="absolute left-4 top-4 w-5 h-5 text-campus-secondary/40 group-focus-within:text-rose-400 transition-colors" />
                                                <div className="absolute left-12 top-1.5 text-[8px] font-black uppercase tracking-widest text-rose-400/40">Ends</div>
                                                <input
                                                    required
                                                    type="datetime-local"
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl pt-6 pb-3 pl-12 pr-4 text-white placeholder:text-campus-secondary/40 focus:bg-white/10 focus:border-rose-400/40 focus:outline-none transition-all font-bold [color-scheme:dark] text-sm"
                                                    value={formData.end_time}
                                                    onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-campus-secondary/40 group-focus-within:text-campus-accent transition-colors" />
                                            <input
                                                required
                                                placeholder="Location..."
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-campus-secondary/40 focus:bg-white/10 focus:border-campus-accent/40 focus:outline-none transition-all font-bold"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto hide-scrollbar">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, event_type: cat.id })}
                                                    className={`
                                                        px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                                                        ${formData.event_type === cat.id
                                                            ? 'bg-campus-accent text-campus-dark shadow-lg shadow-campus-accent/20'
                                                            : 'text-campus-secondary hover:bg-white/5'
                                                        }
                                                    `}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative group">
                                            <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-campus-secondary/40 group-focus-within:text-campus-accent transition-colors" />
                                            <textarea
                                                required
                                                rows={4}
                                                placeholder="What's the lore of this event?..."
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-campus-secondary/40 focus:bg-white/10 focus:border-campus-accent/40 focus:outline-none transition-all font-bold resize-none"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-campus-accent/40 transition-all cursor-pointer" onClick={() => setFormData({ ...formData, notifications: !formData.notifications } as any)}>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-campus-accent/10 rounded-xl">
                                                    <Bell className="w-4 h-4 text-campus-accent" />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">Alert me when campus stops being boring</span>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full p-1 transition-all ${formData.notifications ? 'bg-campus-accent' : 'bg-white/10'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.notifications ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <VibeButton
                                        type="submit"
                                        className="w-full h-16"
                                        isLoading={loading}
                                    >
                                        Post Proposal
                                    </VibeButton>
                                </form>
                            )}
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
