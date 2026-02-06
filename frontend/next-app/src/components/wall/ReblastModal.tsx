"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Repeat, Send } from "lucide-react";
import { VibeButton } from "@/components/ui/VibeButton";
import api from "@/lib/api";

interface ReblastModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        id: string;
        content: string;
        title?: string;
        user: {
            profile: {
                nickname: string;
            }
        }
    };
    onSuccess: () => void;
}

export function ReblastModal({ isOpen, onClose, post, onSuccess }: ReblastModalProps) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/posts/${post.id}/reblast/`, { content });
            onSuccess();
            onClose();
            setContent("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-campus-dark/90 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-xl bg-campus-card/90 border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-campus-accent/10 rounded-2xl text-campus-accent">
                                        <Repeat className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white italic">Add Your Chaos</h2>
                                        <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest">Reblasting {post.user.profile.nickname}'s lore</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-campus-secondary" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Original Post Preview */}
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 opacity-60 italic text-sm">
                                    <p className="line-clamp-2 text-campus-secondary">"{post.content}"</p>
                                </div>

                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Add your take... (Leave empty for a clean reblast)"
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white placeholder:text-campus-secondary/40 outline-none focus:border-campus-accent/30 transition-all resize-none text-lg font-medium"
                                />

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <VibeButton variant="secondary" onClick={onClose}>Cancel</VibeButton>
                                    <VibeButton
                                        onClick={handleSubmit}
                                        isLoading={loading}
                                        className="px-8"
                                    >
                                        Blast It
                                        <Repeat className="w-4 h-4 ml-2 inline" />
                                    </VibeButton>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
