"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Shield, Clock, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface MatchChatProps {
    matchId: string;
    isLocked: boolean;
    expiresAt?: string;
}

export function MatchChat({ matchId, isLocked, expiresAt }: MatchChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        if (isLocked) return;
        try {
            const res = await api.get(`/mutual/${matchId}/messages/`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [matchId, isLocked]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || loading || isLocked) return;

        const optimisticMsg = { id: Date.now(), text, is_me: true, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);
        const currentText = text;
        setText("");

        try {
            await api.post(`/mutual/${matchId}/send_message/`, { text: currentText });
            fetchMessages();
        } catch (err) {
            console.error("Send failed:", err);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden relative">
            {/* Header info */}
            <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-campus-accent" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">End-to-end Madness</span>
                </div>
                {expiresAt && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                        <Clock className="w-3 h-3 text-red-400" />
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">
                            Ends in {new Date(expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )}
            </div>

            {/* Message Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide relative"
            >
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${msg.is_me ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[80%] p-4 rounded-2xl text-xs font-bold leading-relaxed
                                ${msg.is_me
                                    ? 'bg-campus-accent text-campus-dark rounded-tr-none'
                                    : 'bg-white/5 text-white rounded-tl-none border border-white/5 shadow-sm'
                                }
                            `}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLocked && (
                    <div className="absolute inset-0 bg-campus-dark/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                            <Shield className="w-8 h-8 text-campus-secondary/40" />
                        </div>
                        <h3 className="text-xl font-black text-white italic mb-2">Chat is Blurred</h3>
                        <p className="text-[10px] text-campus-secondary/60 font-black uppercase tracking-[0.2em] leading-loose">
                            Chat unlocks after both confirm the meetup. Security first, vibes later.
                        </p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 pt-0">
                <div className="relative">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isLocked}
                        placeholder={isLocked ? "Confirm meetup to unlock..." : "Say something chaotic..."}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-campus-accent/50 focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLocked || !text.trim()}
                        className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-campus-accent text-campus-dark rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Banner */}
            <div className="bg-campus-accent/5 border-t border-white/5 p-2 text-center">
                <p className="text-[8px] font-black text-campus-accent uppercase tracking-[0.3em]">
                    This chat disappears in 24 hours
                </p>
            </div>
        </div>
    );
}
