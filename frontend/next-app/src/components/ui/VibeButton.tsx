"use client";

import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface VibeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    isLoading?: boolean;
}

export function VibeButton({
    children,
    className,
    variant = 'primary',
    isLoading,
    ...props
}: VibeButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-campus-accent to-campus-accent/80 text-campus-dark shadow-[0_0_20px_rgba(198,183,255,0.2)]",
        secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
        ghost: "bg-transparent text-campus-accent hover:bg-campus-accent/5",
        danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]"
    };

    const variantType = (variant === 'danger' ? 'danger' : variant) as keyof typeof variants;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:scale-100 uppercase tracking-widest text-[10px]",
                variants[variantType],
                className
            )}
            {...props as any}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Syncing...</span>
                </div>
            ) : children}
        </motion.button>
    );
}
