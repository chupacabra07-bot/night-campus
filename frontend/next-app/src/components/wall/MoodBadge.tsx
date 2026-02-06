interface MoodBadgeProps {
    mood: string;
}

export function MoodBadge({ mood }: MoodBadgeProps) {
    const configs: Record<string, { label: string; color: string; icon: string }> = {
        rant: { label: "Rant", color: "text-red-400 border-red-400/20 bg-red-400/5", icon: "😤" },
        confession: { label: "Confession", color: "text-purple-400 border-purple-400/20 bg-purple-400/5", icon: "🤫" },
        advice: { label: "Advice", color: "text-amber-400 border-amber-400/20 bg-amber-400/5", icon: "🧠" },
        chaos: { label: "Chaos", color: "text-campus-accent border-campus-accent/20 bg-campus-accent/5", icon: "🌪️" },
    };

    const config = configs[mood] || configs.chaos;

    return (
        <div className={`
      px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest 
      flex items-center gap-1.5 transition-all
      ${config.color}
    `}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </div>
    );
}
