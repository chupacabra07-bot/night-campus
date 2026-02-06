import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverGlow?: boolean;
}

export function GlassCard({ children, className, hoverGlow = true }: GlassCardProps) {
    return (
        <div className={cn(
            "relative group overflow-hidden rounded-3xl",
            "bg-campus-card/40 backdrop-blur-xl",
            "border border-white/5 shadow-2xl transition-all duration-500",
            hoverGlow && "hover:border-campus-accent/20 hover:shadow-campus-accent/5",
            className
        )}>
            {/* Background radial glow on hover */}
            {hoverGlow && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(198,183,255,0.05)_0%,transparent_100%)] transition-opacity duration-500 pointer-events-none" />
            )}
            <div className="relative z-10 p-6">
                {children}
            </div>
        </div>
    );
}
