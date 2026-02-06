"use client";

import { motion } from "framer-motion";

const REACTIONS = [
    { type: 'heart', emoji: '❤️', label: 'Love' },
    { type: 'joy', emoji: '😂', label: 'Meme' },
    { type: 'fire', emoji: '🔥', label: 'Fire' },
    { type: 'mind_blown', emoji: '🤯', label: 'Mind Blown' },
    { type: 'hundred', emoji: '💯', label: 'Hundred' },
    { type: 'cry', emoji: '😭', label: 'Too Real' },
];

interface ReactionPickerProps {
    onSelect: (type: string) => void;
    onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            className="absolute bottom-full left-0 mb-4 bg-campus-card/95 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex gap-1 z-[110]"
        >
            {REACTIONS.map((r, idx) => (
                <motion.button
                    key={r.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(r.type);
                        onClose();
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors relative group"
                    title={r.label}
                >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {r.label}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
}
