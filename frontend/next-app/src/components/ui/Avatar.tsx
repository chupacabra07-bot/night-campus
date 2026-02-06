"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Simplified SVG Asset Library
export const AVATAR_PARTS = {
    face: {
        neutral: (
            <rect x="10" y="10" width="80" height="80" rx="40" fill="currentColor" />
        ),
        square: (
            <rect x="10" y="10" width="80" height="80" rx="15" fill="currentColor" />
        ),
        pointed: (
            <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" />
        ),
        blob: (
            <path d="M50 10 C20 10 10 30 15 50 C10 80 40 95 65 85 C90 75 90 40 85 30 C80 10 70 10 50 10 Z" fill="currentColor" />
        ),
    },
    eyes: {
        dots: (
            <>
                <circle cx="35" cy="45" r="4" fill="white" />
                <circle cx="65" cy="45" r="4" fill="white" />
            </>
        ),
        glow: (
            <>
                <circle cx="35" cy="45" r="5" fill="white" className="animate-pulse" />
                <circle cx="65" cy="45" r="5" fill="white" className="animate-pulse" />
            </>
        ),
        shades: (
            <path d="M25 40 H75 V50 H25 Z" fill="rgba(0,0,0,0.5)" />
        ),
        sleepy: (
            <>
                <path d="M30 45 Q35 50 40 45" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M60 45 Q65 50 70 45" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
        ),
        sparkle: (
            <>
                <path d="M35 35 L35 55 M25 45 L45 45" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M65 35 L65 55 M55 45 L75 45" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </>
        ),
    },
    headVibe: {
        none: null,
        aura: (
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 4" opacity="0.3" className="animate-spin-slow" />
        ),
        hood: (
            <path d="M10 50 Q10 0 50 0 Q90 0 90 50 L90 60 L10 60 Z" fill="currentColor" opacity="0.3" />
        ),
        band: (
            <path d="M15 35 Q50 30 85 35" stroke="white" strokeWidth="6" fill="none" opacity="0.3" />
        ),
        halo: (
            <ellipse cx="50" cy="5" rx="30" ry="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" className="animate-pulse" />
        ),
        shadow: (
            <rect x="10" y="10" width="80" height="20" rx="40" fill="url(#shadowGrad)" opacity="0.3" />
        ),
    },
    accessories: {
        none: null,
        sparkles: (
            <>
                <circle cx="15" cy="15" r="2" fill="white" className="animate-pulse" />
                <circle cx="85" cy="25" r="1.5" fill="white" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="75" cy="85" r="2.5" fill="white" className="animate-pulse" style={{ animationDelay: '1s' }} />
            </>
        ),
        bandana: (
            <path d="M10 40 L90 40 L50 60 L10 40 Z" fill="rgba(255,255,255,0.2)" />
        ),
        mask: (
            <rect x="25" y="55" width="50" height="20" rx="5" fill="currentColor" opacity="0.4" />
        ),
        crown: (
            <path d="M30 15 L40 5 L50 15 L60 5 L70 15" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        ),
    }
};

interface AvatarConfig {
    face?: keyof typeof AVATAR_PARTS.face;
    eyes?: keyof typeof AVATAR_PARTS.eyes;
    headVibe?: keyof typeof AVATAR_PARTS.headVibe;
    accessories?: keyof typeof AVATAR_PARTS.accessories;
    color?: string;
}

export const Avatar = ({
    config,
    className = "",
    size = "md"
}: {
    config: AvatarConfig | null,
    className?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl'
}) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20",
        xl: "w-32 h-32"
    };
    const { face = 'neutral', eyes = 'dots', headVibe = 'none', accessories = 'none', color = "#C6B7FF" } = config || {};

    return (
        <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`relative ${sizeClasses[size]} ${className}`}
        >
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-2xl"
                style={{ color }}
            >
                <defs>
                    <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" opacity="0.6" />
                        <stop offset="100%" stopColor="currentColor" opacity="0" />
                    </linearGradient>
                </defs>
                {/* Face Base */}
                {AVATAR_PARTS.face[face]}

                {/* Head Vibe Layer */}
                {AVATAR_PARTS.headVibe[headVibe]}

                {/* Eyes Layer */}
                {AVATAR_PARTS.eyes[eyes]}

                {/* Accessories Layer */}
                {AVATAR_PARTS.accessories[accessories]}
            </svg>
        </motion.div>
    );
};
