import { InputHTMLAttributes } from "react";

interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function GlowInput({ label, error, className, ...props }: GlowInputProps) {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label className="text-xs font-bold uppercase tracking-widest text-campus-secondary px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`
            w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl 
            text-white placeholder:text-campus-secondary/50 outline-none
            transition-all duration-300
            focus:border-campus-accent focus:bg-white/10
            focus:shadow-[0_0_20px_rgba(198,183,255,0.1)]
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="text-red-400 text-[10px] font-bold mt-1 px-1">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
