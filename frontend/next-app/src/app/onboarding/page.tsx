"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    RefreshCw, Zap, Brain, Heart, CheckCircle2, UserCircle, Sparkles,
    Eye, Crown, Unlink, Search, BatteryLow, Flame, Clapperboard,
    DoorOpen, HeartCrack, User, Ghost, Moon, HelpCircle, Target,
    Wifi, Brain as BrainIcon, Sparkles as SparklesIcon, BarChart3, Binary, UserPlus
} from "lucide-react";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarBuilder } from "@/components/ui/AvatarBuilder";

const STEPS = [
    { id: "identity", label: "Identity", icon: User },
    { id: "preferences", label: "Self", icon: UserCircle },
    { id: "vibes", label: "Energy", icon: Zap },
    { id: "brain", label: "Brain", icon: Brain },
    { id: "interests", label: "Vibes", icon: SparklesIcon },
    { id: "intent", label: "Intent", icon: Heart }
];

const VIBE_OPTIONS = [
    { id: "stalker", label: "Silent Stalker", desc: "Consumes content. Provides nothing.", meaning: "Watches every story. Leaves zero evidence.", icon: Eye },
    { id: "delusion", label: "Main Character Delusion", desc: "This app is about me.", meaning: "Existing in a cinematic universe of my own creation.", icon: Crown },
    { id: "unavailable", label: "Emotionally Unavailable", desc: "Replies in 3–5 business days.", meaning: "Expert at long-distance ignoring.", icon: Unlink },
    { id: "overthinker", label: "Professional Overthinker", desc: "Analyzing vibes like a crime scene.", meaning: "Could find a deep hidden meaning in a single '.'", icon: Search },
    { id: "low_battery", label: "Low Battery Human", desc: "Social energy at 2%.", meaning: "Social energy at 2%. Bedtime is my only hobby.", icon: BatteryLow },
    { id: "chaos", label: "Chaos Contributor", desc: "Not the problem. Definitely the cause.", meaning: "Not the problem. Definitely the catalyst.", icon: Flame },
    { id: "flirt", label: "Accidental Flirt", desc: "I was just being polite.", meaning: "I said 'hi' and now they've planned the wedding.", icon: Sparkles },
    { id: "therapist", label: "Meme Therapist", desc: "Sending memes instead of emotions.", meaning: "Curing depression with low-quality JPEGs.", icon: Clapperboard },
    { id: "phobic", label: "Commitment Phobic", desc: "Even scared to commit to snacks.", meaning: "Scared to commit to a 20-minute Netflix episode.", icon: DoorOpen },
    { id: "romantic", label: "Hopeless Romantic", desc: "Delusional but hopeful.", meaning: "Delusional enough to believe in 'the one' at 3 AM.", icon: HeartCrack },
    { id: "npc", label: "Certified NPC", desc: "Just here. Existing.", meaning: "Just here for the background music and snacks.", icon: User },
    { id: "ghost", label: "Ghost in Training", desc: "Practicing disappearing.", meaning: "Gone before the blue ticks even appear.", icon: Ghost },
    { id: "thinker", label: "Sleep-Deprived Thinker", desc: "Thoughts louder after midnight.", meaning: "Most productive when everyone else is asleep.", icon: Moon },
    { id: "failure", label: "Vibe Check Failure", desc: "Energy unclear, intentions unknown.", meaning: "Error 404: Personality not found, but vibes are immaculate.", icon: HelpCircle },
    { id: "selective", label: "Socially Selective", desc: "Funny with the right audience.", meaning: "Vocal only when my specific hyper-fixation is mentioned.", icon: Target },
];

const SARCASTIC_TOASTS = [
    "You are not a personality buffet. Pick 4.",
    "Relax, this isn’t a character customization DLC.",
    "We get it, you contain multitudes. Still only 4.",
    "Emotional DLC locked. Please upgrade later."
];

const BRAIN_OPTIONS = [
    { id: "overthinker", label: "Overthinker Pro Max", desc: "Turned 'hi' into a 3-episode mental series.", icon: BrainIcon },
    { id: "delulu", label: "Delulu but Functional", desc: "Manifesting nonsense but meeting deadlines.", icon: SparklesIcon },
    { id: "spreadsheet", label: "Spreadsheet Soul", desc: "Feelings sorted alphabetically.", icon: BarChart3 },
    { id: "chaos", label: "Chaos Processor", desc: "No thoughts. Just emotional roulette.", icon: Binary },
    { id: "wifi", label: "Emotionally Wi-Fi Dependent", desc: "Strong signal. Random disconnects.", icon: Wifi },
    { id: "npc", label: "NPC With Anxiety DLC", desc: "Background character with premium stress.", icon: UserPlus },
];

const BRAIN_SARCASTIC_TOASTS = [
    "Easy. You only get one mental crisis at a time.",
    "This isn’t a personality combo meal.",
    "Multitasking personalities not supported yet.",
    "Pick a struggle, bestie.",
    "Brain can only run one operating system."
];

const INTENT_OPTIONS = [
    { id: "vibes", label: "Just Vibes", desc: "Scrolling. Watching. Existing.", icon: Eye },
    { id: "friends", label: "Make Friends", desc: "Platonic chaos only.", icon: UserCircle },
    { id: "flirt", label: "Flirt & See", desc: "No promises. Just tension.", icon: Flame },
    { id: "talks", label: "Deep Talks at 2AM", desc: "Oversharing speedrun.", icon: Moon },
    { id: "fun", label: "Pure Entertainment", desc: "Here for stories, not responsibility.", icon: Clapperboard },
    { id: "main", label: "Main Character Arc", desc: "Tonight, something happens.", icon: Crown },
];

const INTENT_SARCASTIC_TOASTS = [
    "Relax. You are not that interesting.",
    "Pick 3. This isn’t a personality buffet.",
    "We’re not building a whole backstory here.",
    "Too many motives. Suspicious behavior.",
    "System cannot process this much chaos.",
    "Calm down, main character."
];

const INTEREST_OPTIONS = [
    { id: "music", label: "Music", icon: "🎵" },
    { id: "coding", label: "Coding", icon: "💻" },
    { id: "gaming", label: "Gaming", icon: "🎮" },
    { id: "sports", label: "Sports", icon: "🏀" },
    { id: "tfi_banisa", label: "TFI Banisa", icon: "🎬" },
    { id: "anime", label: "Anime", icon: "🎎" },
    { id: "art", label: "Art", icon: "🎨" },
    { id: "reading", label: "Reading", icon: "📚" },
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "food", label: "Foodie", icon: "🍜" },
    { id: "fitness", label: "Fitness", icon: "💪" },
    { id: "memes", label: "Memes", icon: "🤡" },
];

const INTEREST_SARCASTIC_TOASTS = [
    "We get it, you're a person of culture. Still, pick 6.",
    "Too many hobbies. When do you study?",
    "Character depth detected. Limiting to 6 vibes.",
    "Save some personality for the rest of us."
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);
    const [formData, setFormData] = useState({
        nickname: "",
        avatar_emoji: "👻",
        avatar_config: null as any,
        social_energy: [] as string[],
        personality_style: [],
        brain_type: "",
        brain_type_description: "",
        connection_intent: [] as string[],
        interests: [] as string[],
        gender: "",
        match_preference: "everyone",
        looking_for: "both"
    });

    const [avatarTouched, setAvatarTouched] = useState(false);

    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: "", visible: false });
    const [rejectedVibe, setRejectedVibe] = useState<string | null>(null);
    const [rejectedIntent, setRejectedIntent] = useState<string | null>(null);
    const [hoveredVibe, setHoveredVibe] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [isGeneratingNickname, setIsGeneratingNickname] = useState(false);

    const showSarcasticToast = (type: 'energy' | 'brain' | 'intent') => {
        const list = type === 'energy' ? SARCASTIC_TOASTS : type === 'brain' ? BRAIN_SARCASTIC_TOASTS : INTENT_SARCASTIC_TOASTS;
        const randomToast = list[Math.floor(Math.random() * list.length)];
        setToast({ message: randomToast, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    useEffect(() => {
        if (!formData.nickname) {
            generateNickname();
        }

        // Safety backup: if after 4 seconds it's still empty, force a fallback
        const backupTimer = setTimeout(() => {
            setFormData(prev => {
                if (!prev.nickname && !isGeneratingNickname) {
                    const localFallbacks = ["Night Owl", "Shadow Ghost", "Moon Light"];
                    return { ...prev, nickname: localFallbacks[Math.floor(Math.random() * localFallbacks.length)] };
                }
                return prev;
            });
        }, 4000);

        return () => clearTimeout(backupTimer);
    }, []);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleFinish = async () => {
        setLoading(true);
        try {
            // Filter out any internal UI state from formData if necessary
            const { ...submitData } = formData;
            const res = await api.patch("/profiles/me/", submitData);

            // Sync with local storage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                userData.profile = res.data;
                localStorage.setItem('user', JSON.stringify(userData));
            }

            router.push("/home");
        } catch (err: any) {
            console.error("Onboarding failed:", err.response?.data || err.message);
            const serverError = err.response?.data
                ? typeof err.response.data === 'string'
                    ? err.response.data
                    : JSON.stringify(err.response.data)
                : "Vibe check lost in the void.";
            setToast({
                message: `System crash: ${serverError}`,
                visible: true
            });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 6000);
        } finally {
            setLoading(false);
        }
    };

    const generateNickname = async () => {
        setIsGeneratingNickname(true);
        try {
            const res = await api.get("/auth/generate_nickname/");
            setFormData(prev => ({ ...prev, nickname: res.data.nickname }));
        } catch (err) {
            console.error("Nickname generation failed:", err);
            // Fallback nicknames in case the API is unreachable (e.g. initial setup/mobile issues)
            const fallbacks = ["Anonymous Ghost", "Shadow Walker", "Night Vibe", "Campus Legend", "Silent Echo"];
            const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            setFormData(prev => ({ ...prev, nickname: randomFallback }));

            setToast({
                message: "Connected to local vibes (using fallback ID).",
                visible: true
            });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
        } finally {
            setIsGeneratingNickname(false);
        }
    };

    return (
        <main className="min-h-screen bg-campus-dark text-white p-6 relative overflow-hidden flex flex-col">
            {/* Progress Header */}
            {!showSuccess && (
                <header className="max-w-md mx-auto w-full pt-4 md:pt-12 mb-6 md:mb-12">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex flex-col items-center gap-1 md:gap-2">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${i <= currentStep ? "bg-campus-accent text-campus-dark" : "bg-white/5 text-campus-secondary/40"
                                    }`}>
                                    <s.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <span className={`text-[7px] md:text-[8px] font-bold uppercase tracking-widest ${i <= currentStep ? "text-campus-accent" : "text-campus-secondary/20"
                                    }`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-campus-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                </header>
            )}

            <div className="flex-1 flex items-center justify-center mx-auto w-full">
                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <motion.div
                            key="identity"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-4 md:space-y-8 max-w-md mx-auto"
                        >
                            <div className="text-center">
                                <h1 className="text-2xl md:text-4xl font-black mb-2 md:mb-4">Choose Your Disguise</h1>
                                <p className="text-campus-secondary/60 text-xs md:text-sm">No real face. Just pure vibe.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder={isGeneratingNickname ? "Consulting the vibe council..." : "Generating your alias..."}
                                        className={`w-full bg-white/5 border border-white/5 rounded-3xl py-6 px-8 text-xl font-bold focus:outline-none focus:border-campus-accent/50 transition-all text-center text-campus-accent cursor-not-allowed uppercase tracking-wider ${isGeneratingNickname ? 'animate-pulse opacity-50' : ''}`}
                                        value={formData.nickname}
                                    />
                                    <button
                                        onClick={generateNickname}
                                        disabled={isGeneratingNickname}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-campus-accent/10 rounded-2xl hover:bg-campus-accent/20 transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Try Another"
                                    >
                                        <RefreshCw className={`w-5 h-5 text-campus-accent transition-transform duration-500 ${isGeneratingNickname ? 'animate-spin' : 'group-hover/btn:rotate-180'}`} />
                                    </button>
                                </div>
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-campus-secondary/40">
                                    {isGeneratingNickname ? "Finding the perfect label..." : "System determined ID. Tap to regenerate."}
                                </p>

                                <div className="space-y-6">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative group cursor-pointer" onClick={() => setShowBuilder(true)}>
                                            {formData.avatar_config ? (
                                                <Avatar config={formData.avatar_config} className="w-32 h-32" />
                                            ) : (
                                                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border-2 border-dashed border-white/10 group-hover:border-campus-accent/50 group-hover:bg-campus-accent/5 transition-all">
                                                    <span className="text-4xl">{formData.avatar_emoji}</span>
                                                </div>
                                            )}
                                            <div className="absolute -bottom-2 -right-2 bg-campus-accent text-campus-dark p-2 rounded-xl shadow-xl scale-0 group-hover:scale-100 transition-all duration-300">
                                                <UserCircle className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setShowBuilder(true)}
                                            className="px-6 py-3 bg-campus-accent/10 border border-campus-accent/20 rounded-2xl text-campus-accent font-bold text-xs uppercase tracking-widest hover:bg-campus-accent/20 transition-all"
                                        >
                                            {formData.avatar_config ? "Edit Avatar" : "Create Your Avatar"}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 opacity-50">
                                        {["👻", "🧛", "🐺", "🌙"].map(e => (
                                            <button
                                                key={e}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, avatar_emoji: e, avatar_config: null }));
                                                    setAvatarTouched(true);
                                                }}
                                                className={`text-2xl p-4 rounded-2xl transition-all ${formData.avatar_emoji === e && !formData.avatar_config ? "bg-campus-accent/20 scale-110 border border-campus-accent/30" : "bg-white/5 grayscale"
                                                    }`}
                                            >
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {showBuilder && (
                            <AvatarBuilder
                                initialConfig={formData.avatar_config}
                                onSave={(config) => {
                                    setFormData({ ...formData, avatar_config: config });
                                    setAvatarTouched(true);
                                    setShowBuilder(false);
                                }}
                                onClose={() => setShowBuilder(false)}
                            />
                        )}
                    </AnimatePresence>

                    {currentStep === 1 && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-8 max-w-md mx-auto"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-black mb-4 italic">Who is {formData.nickname || "this soul"}?</h1>
                                <p className="text-campus-secondary/60 text-sm">Set your identity. Kept private by default. 🔒</p>
                            </div>

                            <div className="space-y-10 py-4">
                                {/* Gender Selection */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-accent/60 pl-2">I identify as...</p>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'man', label: 'Man', icon: '👦' },
                                            { id: 'woman', label: 'Woman', icon: '👧' },
                                            { id: 'others', label: 'Others', icon: '✨' }
                                        ].map(g => (
                                            <button
                                                key={g.id}
                                                onClick={() => setFormData({ ...formData, gender: g.id })}
                                                className={`flex-1 py-4 rounded-3xl border transition-all flex flex-col items-center gap-1 ${formData.gender === g.id ? 'bg-campus-accent text-campus-dark border-campus-accent shadow-lg scale-105' : 'bg-white/5 border-white/5 text-campus-secondary hover:bg-white/10'}`}
                                            >
                                                <span className="text-xl">{g.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{g.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Looking For */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-accent/60 pl-2">I am here for...</p>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'friends', label: 'Friends', icon: '🫂' },
                                            { id: 'dating', label: 'Dating', icon: '💘' },
                                            { id: 'both', label: 'Both', icon: '🔥' }
                                        ].map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setFormData({ ...formData, looking_for: l.id })}
                                                className={`flex-1 py-4 rounded-3xl border transition-all flex flex-col items-center gap-1 ${formData.looking_for === l.id ? 'bg-campus-highlight text-campus-dark border-campus-highlight shadow-lg scale-105' : 'bg-white/5 border-white/5 text-campus-secondary hover:bg-white/10'}`}
                                            >
                                                <span className="text-xl">{l.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{l.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Match Preference */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-accent/60 pl-2">Show me...</p>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'women', label: 'Women', icon: '👩‍🦰' },
                                            { id: 'men', label: 'Men', icon: '👨‍🦱' },
                                            { id: 'everyone', label: 'Everyone', icon: '🌍' }
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setFormData({ ...formData, match_preference: m.id })}
                                                className={`flex-1 py-4 rounded-3xl border transition-all flex flex-col items-center gap-1 ${formData.match_preference === m.id ? 'bg-white text-campus-dark border-white shadow-lg scale-105' : 'bg-white/5 border-white/5 text-campus-secondary hover:bg-white/10'}`}
                                            >
                                                <span className="text-xl">{m.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="vibes"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-10 max-w-[1400px] mx-auto"
                        >
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-campus-accent/10 rounded-full border border-campus-accent/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-campus-accent animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-campus-accent">
                                        {formData.social_energy.length}/4 vibes selected
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black mb-2 tracking-tight">Tonight's Emotional Damage</h1>
                                    <p className="text-campus-secondary/40 text-[10px] uppercase tracking-widest font-bold">Pick 4. You're not that complex.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 px-2">
                                {VIBE_OPTIONS.map(v => {
                                    const isSelected = formData.social_energy.includes(v.id);
                                    const isMaxed = formData.social_energy.length >= 4;
                                    const isDimmed = isMaxed && !isSelected;

                                    // Unique animation variants for each vibe
                                    const animationVariants: Record<string, any> = {
                                        stalker: { animate: isSelected ? { opacity: [1, 0.4, 1] } : {}, transition: { duration: 0.4 } },
                                        delusion: { iconAnimate: isSelected ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {} },
                                        unavailable: { animate: isSelected ? { boxShadow: ["0 0 0px #A3E9FF", "0 0 20px #A3E9FF", "0 0 0px #A3E9FF"] } : {} },
                                        overthinker: { iconAnimate: isSelected ? { x: [-2, 2, -2, 2, 0] } : { transition: { duration: 0.2 } } },
                                        low_battery: { animate: isSelected ? { opacity: [1, 0.3, 0.8, 0.4, 1] } : { transition: { duration: 0.6 } } },
                                        chaos: { animate: isSelected ? { boxShadow: ["0 0 0px #FF4D4D", "0 0 30px #FF4D4D", "0 0 0px #FF4D4D"] } : {} },
                                        flirt: { extra: isSelected ? "💖" : null },
                                        therapist: { iconAnimate: isSelected ? { rotate: [0, -10, 10, -10, 0] } : {} },
                                        phobic: { animate: isSelected ? { x: [0, 10, 0] } : {} },
                                        romantic: { animate: isSelected ? { boxShadow: ["0 0 0px #FFB7E9", "0 0 20px #FFB7E9", "0 0 0px #FFB7E9"] } : {} },
                                        npc: { animate: isSelected ? { y: [0, -3, 0], transition: { repeat: Infinity, duration: 2 } } : {} },
                                        ghost: { animate: isSelected ? { opacity: [1, 0.6, 1] } : { transition: { duration: 0.5 } } },
                                        thinker: { animate: isSelected ? { boxShadow: ["inset 0 0 0px black", "inset 0 0 40px rgba(0,0,0,0.8)", "inset 0 0 0px black"] } : {} },
                                        failure: { animate: isSelected ? { x: [-1, 1, -1, 1, 0], opacity: [1, 0.8, 1] } : { transition: { duration: 0.1 } } },
                                        selective: { animate: isSelected ? { backgroundColor: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"] } : {} }
                                    };

                                    const vAnim = animationVariants[v.id] || {};

                                    return (
                                        <div key={v.id} className="relative">
                                            <motion.button
                                                onMouseEnter={() => setHoveredVibe(v.id)}
                                                onMouseLeave={() => setHoveredVibe(null)}
                                                whileTap={{ scale: 0.95 }}
                                                animate={{
                                                    scale: isSelected ? 1.03 : hoveredVibe === v.id ? 1.02 : 1,
                                                    x: rejectedVibe === v.id ? [-2, 2, -2, 2, 0] : 0,
                                                    opacity: isDimmed ? 0.3 : 1,
                                                    ...(isSelected ? vAnim.animate : {})
                                                }}
                                                onClick={() => {
                                                    const exists = formData.social_energy.includes(v.id);
                                                    if (!exists && formData.social_energy.length >= 4) {
                                                        setRejectedVibe(v.id);
                                                        setTimeout(() => setRejectedVibe(null), 500);
                                                        showSarcasticToast('energy');
                                                        return;
                                                    }
                                                    setFormData({
                                                        ...formData,
                                                        social_energy: exists
                                                            ? formData.social_energy.filter(i => i !== v.id)
                                                            : [...formData.social_energy, v.id]
                                                    });
                                                }}
                                                className={`flex items-center gap-4 p-4 px-6 rounded-full border transition-all text-left relative group overflow-hidden h-[70px] w-full ${isSelected
                                                    ? "bg-campus-accent/10 border-campus-accent/40 shadow-[0_0_20px_rgba(198,183,255,0.15)]"
                                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                                    }`}
                                            >
                                                <motion.div
                                                    animate={isSelected ? vAnim.iconAnimate : {}}
                                                    className={`p-2.5 rounded-full relative z-10 flex-shrink-0 ${isSelected ? "bg-campus-accent text-campus-dark" : "bg-white/5 text-campus-secondary/40"}`}
                                                >
                                                    <v.icon className="w-4 h-4" />
                                                    {vAnim.extra && isSelected && (
                                                        <motion.span
                                                            initial={{ scale: 0, opacity: 0, y: 0 }}
                                                            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0], y: -20 }}
                                                            className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl pointer-events-none"
                                                        >
                                                            {vAnim.extra}
                                                        </motion.span>
                                                    )}
                                                </motion.div>
                                                <div className="relative z-10 flex-1 min-w-0 pr-1">
                                                    <h4 className={`font-black uppercase tracking-wider text-[11px] truncate ${isSelected ? "text-campus-accent" : "text-white/80"}`}>{v.label}</h4>
                                                    <p className="text-[9px] font-bold text-campus-secondary/30 mt-0.5 leading-tight truncate">"{v.desc}"</p>
                                                </div>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="absolute top-1/2 -right-1 -translate-y-1/2 z-20 px-2 py-0.5 bg-campus-accent text-campus-dark rounded-full text-[6px] font-black uppercase tracking-widest shadow-lg rotate-12"
                                                    >
                                                        Accepted 😌
                                                    </motion.div>
                                                )}
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="selected-ring"
                                                        className="absolute inset-0 border-2 border-campus-accent rounded-full pointer-events-none"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                    />
                                                )}
                                            </motion.button>

                                            {/* Tooltip Reveal */}
                                            <AnimatePresence>
                                                {hoveredVibe === v.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-48 p-3 bg-campus-card border border-white/10 rounded-2xl shadow-2xl pointer-events-none"
                                                    >
                                                        <div className="text-[10px] font-black text-campus-accent uppercase mb-1">{v.label}</div>
                                                        <div className="text-[9px] font-bold text-white/60 leading-relaxed italic">
                                                            "{v.meaning}"
                                                        </div>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-campus-card" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Toast Overlay */}
                            <AnimatePresence>
                                {toast.visible && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[300] bg-campus-highlight text-campus-dark px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border-2 border-campus-dark"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-campus-dark animate-ping" />
                                        {toast.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="brain"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-8 max-w-2xl"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-black mb-4">Mental Operating System 🧠💥</h1>
                                <p className="text-campus-secondary/60 text-sm">How does your brain sabotage you at night?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                {BRAIN_OPTIONS.map(v => {
                                    const isSelected = formData.brain_type === v.id;
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => {
                                                if (formData.brain_type && formData.brain_type !== v.id) {
                                                    showSarcasticToast('brain');
                                                    return;
                                                }
                                                setFormData({
                                                    ...formData,
                                                    brain_type: isSelected ? "" : v.id,
                                                    brain_type_description: isSelected ? "" : v.desc
                                                });
                                            }}
                                            className={`flex items-start gap-4 p-5 rounded-3xl border transition-all text-left relative group ${isSelected
                                                ? "bg-campus-accent/10 border-campus-accent/40 shadow-[0_0_20px_rgba(198,183,255,0.15)] -translate-y-1"
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            <div className={`p-3 rounded-2xl ${isSelected ? "bg-campus-accent text-campus-dark" : "bg-white/5 text-campus-secondary"}`}>
                                                <v.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className={`font-black uppercase tracking-wider text-xs ${isSelected ? "text-campus-accent" : "text-white"}`}>{v.label}</h4>
                                                <p className="text-[10px] font-bold text-campus-secondary/60 mt-1 leading-relaxed">"{v.desc}"</p>
                                                {isSelected && (
                                                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-campus-accent text-campus-dark rounded-lg text-[8px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                                                        Diagnosis accepted 🩺
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="brain-selected-ring"
                                                    className="absolute inset-0 border-2 border-campus-accent rounded-3xl pointer-events-none"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Toast Overlay (shared with step 1) */}
                            <AnimatePresence>
                                {toast.visible && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[300] bg-campus-highlight text-campus-dark px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border-2 border-campus-dark"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-campus-dark animate-ping" />
                                        {toast.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="interests"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-10 max-w-2xl mx-auto"
                        >
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-campus-accent/10 rounded-full border border-campus-accent/20">
                                    <SparklesIcon className="w-3 h-3 text-campus-accent" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-campus-accent">
                                        {formData.interests.length}/6 vibes selected
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black mb-2 italic">Define Your Aesthetic</h1>
                                    <p className="text-campus-secondary/40 text-[10px] uppercase tracking-widest font-bold">What actually makes you interesting?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {INTEREST_OPTIONS.map(v => {
                                    const isSelected = formData.interests.includes(v.id);
                                    const isMaxed = formData.interests.length >= 6;
                                    return (
                                        <motion.button
                                            key={v.id}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                const exists = formData.interests.includes(v.id);
                                                if (!exists && isMaxed) {
                                                    const randomToast = INTEREST_SARCASTIC_TOASTS[Math.floor(Math.random() * INTEREST_SARCASTIC_TOASTS.length)];
                                                    setToast({ message: randomToast, visible: true });
                                                    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
                                                    return;
                                                }
                                                setFormData({
                                                    ...formData,
                                                    interests: exists
                                                        ? formData.interests.filter(i => i !== v.id)
                                                        : [...formData.interests, v.id]
                                                });
                                            }}
                                            className={`
                                                flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group
                                                ${isSelected
                                                    ? "bg-campus-accent text-campus-dark border-campus-accent shadow-[0_0_20px_rgba(198,183,255,0.3)]"
                                                    : "bg-white/5 border-white/5 hover:bg-white/10 text-campus-secondary"
                                                }
                                            `}
                                        >
                                            <span className="text-xl">{v.icon}</span>
                                            <span className="font-black uppercase tracking-widest text-[10px]">{v.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 5 && !showSuccess && (
                        <motion.div
                            key="intent"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full space-y-8 text-center max-w-md mx-auto"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-black mb-2">What Are You Actually Here For?</h1>
                                <p className="text-campus-secondary/60 text-sm mb-6">Be honest. We can tell.</p>

                                <motion.div
                                    animate={{ scale: formData.connection_intent.length === 3 ? [1, 1.1, 1] : 1 }}
                                    className="inline-block px-4 py-1.5 bg-campus-card border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-campus-accent mb-8 shadow-xl"
                                >
                                    🔥 {formData.connection_intent.length}/3 questionable decisions chosen
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 px-2">
                                {INTENT_OPTIONS.map(v => {
                                    const isSelected = formData.connection_intent.includes(v.id);
                                    const isMaxed = formData.connection_intent.length >= 3;
                                    const isDimmed = isMaxed && !isSelected;

                                    return (
                                        <motion.button
                                            key={v.id}
                                            animate={{
                                                y: isSelected ? -4 : 0,
                                                x: rejectedIntent === v.id ? [-2, 2, -2, 2, 0] : 0,
                                                opacity: isDimmed ? 0.9 : 1
                                            }}
                                            onClick={() => {
                                                const exists = formData.connection_intent.includes(v.id);
                                                if (!exists && isMaxed) {
                                                    setRejectedIntent(v.id);
                                                    setTimeout(() => setRejectedIntent(null), 500);
                                                    showSarcasticToast('intent');
                                                    return;
                                                }
                                                setFormData({
                                                    ...formData,
                                                    connection_intent: exists
                                                        ? formData.connection_intent.filter(i => i !== v.id)
                                                        : [...formData.connection_intent, v.id]
                                                });
                                            }}
                                            className={`flex items-center gap-4 p-4 px-6 rounded-full border transition-all text-left relative group overflow-hidden ${isSelected
                                                ? "bg-campus-accent/10 border-campus-accent/40 shadow-[0_0_20px_rgba(198,183,255,0.15)]"
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            <div className={`p-2.5 rounded-full ${isSelected ? "bg-campus-accent text-campus-dark" : "bg-white/5 text-campus-secondary/40"}`}>
                                                <v.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-black uppercase tracking-wider text-xs ${isSelected ? "text-campus-accent" : "text-white"}`}>{v.label}</h4>
                                                <p className="text-[10px] font-bold text-campus-secondary/60 mt-0.5 leading-tight">"{v.desc}"</p>
                                            </div>
                                            {isSelected && (
                                                <div className="px-3 py-1 bg-campus-accent text-campus-dark rounded-full text-[7px] font-black uppercase tracking-widest shadow-lg">
                                                    Locked In 😈
                                                </div>
                                            )}
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="intent-selected-ring"
                                                    className="absolute inset-0 border-2 border-campus-accent rounded-full pointer-events-none"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {showSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full space-y-8 text-center max-w-md mx-auto"
                        >
                            <div className="w-24 h-24 bg-campus-accent/10 rounded-full flex items-center justify-center mx-auto mb-10">
                                <CheckCircle2 className="w-12 h-12 text-campus-accent" />
                            </div>

                            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Vibe Check Complete.</h1>
                            <p className="text-campus-secondary/60 text-sm mb-12">The night campus is now open for you. Ready to cause problems?</p>

                            <button
                                onClick={handleFinish}
                                disabled={loading}
                                className="w-full bg-campus-accent text-campus-dark py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-campus-accent/40 hover:scale-105 active:scale-95 transition-all text-xl"
                            >
                                {loading ? "Waking up..." : "Enter the Night"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Nav */}
            {!showSuccess && (
                <footer className="max-w-md mx-auto w-full py-12 flex gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            className="flex-1 py-5 bg-white/5 border border-white/5 rounded-2xl font-bold uppercase tracking-widest text-campus-secondary hover:bg-white/10 transition-all"
                        >
                            Back
                        </button>
                    )}
                    <button
                        disabled={
                            (currentStep === 0 && (!formData.nickname || (!avatarTouched && !formData.avatar_emoji))) ||
                            (currentStep === 1 && !formData.gender) ||
                            (currentStep === 2 && formData.social_energy.length !== 4) ||
                            (currentStep === 3 && !formData.brain_type) ||
                            (currentStep === 4 && formData.interests.length === 0) ||
                            (currentStep === 5 && formData.connection_intent.length === 0)
                        }
                        onClick={() => {
                            if (currentStep === 5) setShowSuccess(true);
                            else nextStep();
                        }}
                        className={`flex-[2] py-5 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-20 ${(currentStep === 0 && formData.nickname && (avatarTouched || formData.avatar_emoji)) ||
                            (currentStep === 1 && formData.gender) ||
                            (currentStep === 2 && formData.social_energy.length === 4) ||
                            (currentStep === 3 && formData.brain_type) ||
                            (currentStep === 4 && formData.interests.length > 0) ||
                            (currentStep === 5 && formData.connection_intent.length > 0)
                            ? "bg-campus-accent text-campus-dark shadow-[0_0_20px_rgba(198,183,255,0.3)] scale-[1.02]"
                            : "bg-white/5 border border-white/10 text-white"
                            }`}
                    >
                        {currentStep === 0 ? "Enter in Disguise 🕶️" :
                            currentStep === 1 ? "Looks Good" :
                                currentStep === 2 && formData.social_energy.length === 4 ? "Unleash Me" :
                                    currentStep === 3 && formData.brain_type ? "Proceed Anyway 😌" :
                                        currentStep === 4 && formData.interests.length > 0 ? "Analyzing Aesthetic..." :
                                            currentStep === 5 && formData.connection_intent.length > 0 ? "Let The Night Begin 🌙" : "Connect"}
                    </button>
                </footer>
            )}

            {/* Toast Notifications */}
            <AnimatePresence>
                {toast.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-6"
                    >
                        <div className="bg-rose-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400 font-bold text-xs uppercase tracking-widest">
                            <span className="text-xl">⚠️</span>
                            <p>{toast.message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Aesthetic */}
            <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </main >
    );
}
