"use client";

import { motion } from "framer-motion";

interface CompatibilityMeterProps {
    meterKey: string;
    meterData: {
        value: number;
        label: string;
        tooltip: string;
    };
    index: number;
}

const METER_NAMES: Record<string, string> = {
    'vibe_collision': 'Vibe Collision Index',
    'shared_brain_cell': 'Shared Brain Cell Probability',
    'awkward_silence': 'Awkward Silence Survival Rate',
    'chaos_escalation': 'Chaos Escalation Potential',
    'texting_energy': 'Texting Energy Alignment',
    'social_battery': 'Social Battery Compatibility',
    'inside_joke_speed': 'Inside Joke Formation Speed',
    'emotional_damage': 'Emotional Damage Risk',
    'personality_sync': 'Public vs Private Personality Sync',
    'argument_survival': 'Argument Survivability',
    'event_attendance': 'Event Attendance Probability',
    'unhinged_combo': 'Unhinged Combo Rating',
};

export function CompatibilityMeter({ meterKey, meterData, index }: CompatibilityMeterProps) {
    const meterName = METER_NAMES[meterKey] || meterKey;
    const { value, label, tooltip } = meterData;

    // Color based on value
    const getColor = (val: number) => {
        if (val < 33) return 'from-red-500/20 to-red-500/5';
        if (val < 67) return 'from-amber-500/20 to-amber-500/5';
        return 'from-campus-accent/20 to-campus-accent/5';
    };

    const getBarColor = (val: number) => {
        if (val < 33) return 'bg-red-500/40';
        if (val < 67) return 'bg-amber-500/40';
        return 'bg-campus-accent/40';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative"
        >
            {/* Meter Container */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all duration-500">
                {/* Meter Name */}
                <div className="flex items-start justify-between mb-2">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-white/60 leading-tight">
                        {meterName}
                    </h4>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                    {/* Animated Fill */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{
                            duration: 1.5,
                            delay: index * 0.15,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className={`h-full ${getBarColor(value)} relative`}
                    >
                        {/* Wobble animation */}
                        <motion.div
                            animate={{
                                x: [0, 1, -1, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                    </motion.div>

                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getColor(value)} blur-sm opacity-50`} />
                </div>

                {/* Label */}
                <p className="text-[10px] font-bold text-campus-secondary/80 italic">
                    {label}
                </p>
            </div>

            {/* Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-campus-dark/95 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                <p className="text-[9px] font-bold text-white/80">{tooltip}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-campus-dark/95 border-r border-b border-white/10 rotate-45" />
            </div>
        </motion.div>
    );
}
