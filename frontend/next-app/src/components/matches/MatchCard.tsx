"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Brain, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibeButton } from "@/components/ui/VibeButton";
import { Avatar } from "@/components/ui/Avatar";
import { CompatibilityMeter } from "@/components/matches/CompatibilityMeter";

interface MatchCardProps {
    profile: {
        id: string;
        avatar_emoji: string;
        avatar_config: any;
        interests: string[];
        brain_type: string;
        social_energy: string[];
        compatibility_meters?: Record<string, {
            value: number;
            label: string;
            tooltip: string;
        }>;
    };
    onSelect: (id: string) => void;
    isSelected: boolean;
    isDisabled: boolean;
}

export function MatchCard({ profile, onSelect, isSelected, isDisabled }: MatchCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
            transition={{ duration: 0.5 }}
        >
            <GlassCard
                className={`
                    relative h-auto p-0 overflow-hidden group transition-all duration-500
                    ${isSelected ? 'border-campus-accent ring-2 ring-campus-accent/50 scale-[1.02]' : 'border-white/5'}
                    ${isDisabled && !isSelected ? 'opacity-40 grayscale-[0.5]' : ''}
                `}
            >
                {/* Floating animation glow */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-campus-accent/5 blur-[80px] -z-10"
                />

                {/* Blind Profile Visuals */}
                <div className="h-64 relative flex items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="relative group-hover:scale-110 transition-transform duration-700">
                        <Avatar
                            config={profile.avatar_config}
                            size="xl"
                            className="shadow-[0_0_50px_rgba(198,183,255,0.1)]"
                        />

                        {/* Animated Glow behind avatar */}
                        <div className="absolute inset-0 bg-campus-accent/20 blur-[60px] rounded-full -z-10 animate-pulse" />
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
                            <Brain className="w-3 h-3 text-campus-accent" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">
                                {profile.brain_type}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 pt-4 flex flex-col gap-4">
                    {/* Interests */}
                    <div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {profile.interests.slice(0, 3).map((interest, i) => (
                                <span key={i} className="px-2 py-0.5 bg-campus-accent/5 text-campus-accent text-[9px] font-black uppercase tracking-widest rounded-md border border-white/5">
                                    {interest}
                                </span>
                            ))}
                            {profile.interests.length > 3 && (
                                <span className="text-[9px] font-black text-white/20 ml-1">+{profile.interests.length - 3}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-3 h-3 text-campus-highlight" />
                            <span className="text-[10px] font-bold text-campus-secondary/60 uppercase tracking-widest">
                                {profile.social_energy.join(" / ")}
                            </span>
                        </div>
                    </div>

                    {/* Compatibility Meters */}
                    {profile.compatibility_meters && Object.keys(profile.compatibility_meters).length > 0 && (
                        <div className="space-y-2 border-t border-white/5 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-3 h-3 text-campus-accent" />
                                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-campus-accent/60">
                                    Compatibility Vibes
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(profile.compatibility_meters).map(([key, data], index) => (
                                    <CompatibilityMeter
                                        key={key}
                                        meterKey={key}
                                        meterData={data}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <VibeButton
                        onClick={() => onSelect(profile.id)}
                        disabled={isDisabled && !isSelected}
                        variant={isSelected ? 'primary' : 'secondary'}
                        className="w-full py-4 uppercase font-black tracking-widest text-[10px]"
                    >
                        {isSelected ? "Match Requested" : "Request Meetup"}
                    </VibeButton>
                </div>

                {/* Aesthetic Borders */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-campus-accent/20 to-transparent" />
            </GlassCard>
        </motion.div>
    );
}
