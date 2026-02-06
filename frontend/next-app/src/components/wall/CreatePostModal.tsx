"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { VibeButton } from "@/components/ui/VibeButton";
import { MoodBadge } from "./MoodBadge";
import api from "@/lib/api";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
    initialMood?: string;
}

export function CreatePostModal({ isOpen, onClose, onPostCreated, initialMood = "chaos" }: CreatePostModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState(initialMood);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync mood if it changes from parent
    useEffect(() => {
        if (isOpen) {
            setMood(initialMood);
            setIsAnonymous(false); // Reset on open
        }
    }, [isOpen, initialMood]);

    const handleSubmit = async () => {
        console.log("Submit clicked. Content length:", content.length);
        if (!content.trim()) {
            console.log("Submission blocked: Content is empty.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            console.log("Sending POST to /posts/ with payload:", { title, content, mood, is_anonymous: isAnonymous });
            const response = await api.post("/posts/", {
                title,
                content,
                mood,
                is_anonymous: isAnonymous
            });
            console.log("POST successful:", response.data);
            setTitle("");
            setContent("");
            setMood("chaos");
            setIsAnonymous(false);
            onPostCreated();
            onClose();
        } catch (err: any) {
            console.error("POST failed:", err);
            const errorMsg = err.response?.data?.error || err.message || "The void rejected your post. Try again.";
            setError(errorMsg);
            console.log("Displaying error to user:", errorMsg);
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
                        className="w-full max-w-xl bg-campus-card/90 border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-white italic">
                                        Share the Lore
                                    </h2>
                                    <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-[0.2em]">
                                        Posting as <span className="text-campus-accent">{mood}</span> {mood === 'rant' ? '😤' : mood === 'confession' ? '🤫' : mood === 'advice' ? '🧠' : '🌪️'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-campus-secondary" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {["rant", "confession", "advice", "chaos"].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMood(m)}
                                            className={`transition-all ${mood === m ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                                        >
                                            <MoodBadge mood={m} />
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Add a catchy title (Optional)"
                                    maxLength={69}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-campus-secondary/40 outline-none focus:border-campus-accent/30 focus:bg-white/10 transition-all font-black italic"
                                />

                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's happening in hostel tonight?"
                                    maxLength={999}
                                    className="w-full h-40 bg-white/5 border border-white/5 rounded-3xl p-6 text-white placeholder:text-campus-secondary/40 outline-none focus:border-campus-accent/30 focus:bg-white/10 transition-all resize-none text-lg font-medium"
                                />

                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-rose-400 text-[10px] font-black uppercase tracking-widest pl-2"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between py-2 px-2 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                            Ghost Mode
                                            <Sparkles className="w-3 h-3 text-campus-accent" />
                                        </span>
                                        <span className="text-[8px] text-campus-secondary/40 font-bold uppercase tracking-tight">Your identity will be hidden from everyone.</span>
                                    </div>
                                    <button
                                        onClick={() => setIsAnonymous(!isAnonymous)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${isAnonymous ? 'bg-campus-accent' : 'bg-white/10'}`}
                                    >
                                        <motion.div
                                            animate={{ x: isAnonymous ? 24 : 4 }}
                                            className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-lg"
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-[10px] text-campus-secondary font-bold uppercase tracking-widest pl-2">
                                        {content.length}/999+ chars
                                    </p>
                                    <VibeButton
                                        onClick={handleSubmit}
                                        disabled={!content.trim()}
                                        isLoading={loading}
                                        className="px-8 shadow-xl shadow-campus-accent/10"
                                    >
                                        Blast Post
                                        <Send className="w-4 h-4 ml-2 inline" />
                                    </VibeButton>
                                </div>
                            </div>
                        </div>

                        {/* Aesthetic Glow */}
                        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[100px] opacity-10 rounded-full pointer-events-none ${mood === "rant" ? 'bg-red-400' : mood === "confession" ? 'bg-purple-400' : mood === "advice" ? 'bg-amber-400' : 'bg-campus-accent'
                            }`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
