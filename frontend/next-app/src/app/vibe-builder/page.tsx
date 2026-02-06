"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Zap, Brain, Rocket, RefreshCcw, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibeButton } from "@/components/ui/VibeButton";
import api from "@/lib/api";

const AVATARS = ["👻", "🌙", "🎭", "🎮", "🎸", "🛹", "☕", "🦉", "👽", "🦄"];

export default function VibeBuilderPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nickname: "",
        avatar_emoji: "👻",
        social_energy: [] as string[],
        personality_style: [] as string[],
        brain_type: "",
        connection_intent: [] as string[],
    });

    const router = useRouter();

    const generateNickname = async () => {
        try {
            const res = await api.get("/auth/generate_nickname/");
            setFormData(prev => ({ ...prev, nickname: res.data.nickname }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = (key: string, value: string) => {
        setFormData(prev => {
            const list = prev[key as keyof typeof formData] as string[];
            if (list.includes(value)) {
                return { ...prev, [key]: list.filter(i => i !== value) };
            }
            return { ...prev, [key]: [...list, value] };
        });
    };

    const saveProfile = async () => {
        setLoading(true);
        try {
            await api.patch("/profiles/me/", formData);
            router.push("/home");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Temporary local mock update for the first step
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <main className="min-h-screen relative py-20 px-6 flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full max-w-md bg-white/5 h-1 rounded-full mb-12 overflow-hidden">
                <motion.div
                    animate={{ width: `${(step / 3) * 100}%` }}
                    className="h-full bg-campus-accent shadow-[0_0_15px_rgba(198,183,255,0.5)]"
                />
            </div>

            <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="s1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                                <User className="text-campus-accent" />
                                Claim your Lore identity.
                            </h1>
                            <p className="text-campus-secondary mb-10">Choose an avatar and a legendary nickname.</p>

                            <GlassCard className="space-y-10">
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {AVATARS.map(a => (
                                        <button
                                            key={a}
                                            onClick={() => setFormData({ ...formData, avatar_emoji: a })}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${formData.avatar_emoji === a ? 'bg-campus-accent scale-110 shadow-lg' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <div className="text-5xl font-black text-white px-8 py-4 bg-white/5 rounded-3xl border border-white/10 glow-accent italic">
                                        {formData.nickname || "Select Anonymous"}
                                    </div>
                                    <button
                                        onClick={generateNickname}
                                        className="flex items-center gap-2 text-campus-accent font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Regenerate Nickname
                                    </button>
                                </div>

                                <VibeButton
                                    onClick={nextStep}
                                    className="w-full h-16"
                                    disabled={!formData.nickname}
                                >
                                    Continue the Vibe
                                </VibeButton>
                            </GlassCard>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                                <Zap className="text-campus-highlight" />
                                What's your Social Energy?
                            </h1>
                            <p className="text-campus-secondary mb-10">Select everything that describes you tonight.</p>

                            <GlassCard className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    {["Party Animal", "Caffeine Driven", "Deep Talker", "Ghost Mode", "Chaos Agent", "Observer"].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => handleToggle('social_energy', v)}
                                            className={`p-4 rounded-2xl border transition-all text-left font-bold ${formData.social_energy.includes(v) ? 'bg-campus-highlight text-campus-dark border-campus-highlight' : 'bg-white/5 text-white border-white/5 hover:border-white/20'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <VibeButton onClick={prevStep} variant="secondary" className="flex-1 h-16">Back</VibeButton>
                                    <VibeButton onClick={nextStep} className="flex-[2] h-16">Next Step</VibeButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="s3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                                <Brain className="text-campus-accent" />
                                Final Vibe Check.
                            </h1>
                            <p className="text-campus-secondary mb-10">How does your brain work?</p>

                            <GlassCard className="space-y-8">
                                <div className="space-y-4">
                                    {[
                                        { id: "overthinker", label: "Overthinker 🧠" },
                                        { id: "flow", label: "Go with the flow 🌊" },
                                        { id: "spreadsheet", label: "Spreadsheet human 📊" },
                                        { id: "see_what_happens", label: "“Wait and see” 🌙" }
                                    ].map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => setFormData({ ...formData, brain_type: b.id })}
                                            className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between font-bold ${formData.brain_type === b.id ? 'bg-campus-accent border-campus-accent text-campus-dark' : 'bg-white/5 border-white/5 text-white hover:border-white/20'}`}
                                        >
                                            {b.label}
                                            {formData.brain_type === b.id && <Check className="w-5 h-5" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <VibeButton onClick={prevStep} variant="secondary" className="flex-1 h-16">Back</VibeButton>
                                    <VibeButton
                                        onClick={saveProfile}
                                        className="flex-[2] h-16"
                                        isLoading={loading}
                                        disabled={!formData.brain_type}
                                    >
                                        Finish & Enter Campus
                                    </VibeButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
