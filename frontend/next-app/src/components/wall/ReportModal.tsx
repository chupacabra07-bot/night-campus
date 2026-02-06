"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Send } from "lucide-react";
import { VibeButton } from "@/components/ui/VibeButton";
import api from "@/lib/api";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
}

const REASONS = [
    { id: 'harassment', label: 'Harassment' },
    { id: 'spam', label: 'Spam' },
    { id: 'inappropriate', label: 'Inappropriate' },
    { id: 'other', label: 'Other' },
];

export function ReportModal({ isOpen, onClose, postId }: ReportModalProps) {
    const [reason, setReason] = useState(REASONS[0].id);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/posts/${postId}/report/`, { reason, comment });
            setSent(true);
            setTimeout(() => {
                onClose();
                setSent(false);
                setComment("");
            }, 2000);
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
                        className="w-full max-w-md bg-campus-card border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden p-8"
                    >
                        {!sent ? (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-rose-500/10 rounded-2xl">
                                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white italic">Report Post</h2>
                                        <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest">Safety first, legend.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {REASONS.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => setReason(r.id)}
                                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${reason === r.id
                                                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                                                        : 'bg-white/5 border-white/5 text-campus-secondary hover:bg-white/10'
                                                    }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Optional: Tell us more..."
                                        className="w-full h-24 bg-white/5 border border-white/5 rounded-2xl p-4 text-white placeholder:text-campus-secondary/40 outline-none focus:border-rose-500/30 transition-all resize-none text-xs font-medium"
                                    />

                                    <div className="flex gap-3 pt-4">
                                        <VibeButton variant="secondary" onClick={onClose} className="flex-1">Cancel</VibeButton>
                                        <VibeButton
                                            variant="danger"
                                            onClick={handleSubmit}
                                            isLoading={loading}
                                            className="flex-1"
                                        >
                                            Submit Report
                                        </VibeButton>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <Send className="w-8 h-8 text-green-500" />
                                </motion.div>
                                <h3 className="text-xl font-black text-white italic">Report Received</h3>
                                <p className="text-sm text-campus-secondary">We'll review this lore shortly. Stay safe.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
