"use client";

import { useState, useEffect } from "react";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { Avatar } from "@/components/ui/Avatar";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
    Settings, Shield, Award, Flame, Brain, Sparkles, Edit3, Save, X, Check, Info,
    Eye, Crown, Unlink, Search, BatteryLow, Zap, Clapperboard, DoorOpen,
    HeartCrack, User, Ghost, Moon, HelpCircle, Target, Wifi, UserCircle, Trash2, Trophy
} from "lucide-react";
import { VibeDialog } from "@/components/ui/VibeDialog";
import { VibeButton } from "@/components/ui/VibeButton";

const BRAIN_MAPPING: Record<string, { label: string, desc: string }> = {
    overthinker: { label: "Overthinker Pro Max", desc: "Turned 'hi' into a 3-episode mental series." },
    delulu: { label: "Delulu but Functional", desc: "Manifesting nonsense but meeting deadlines." },
    spreadsheet: { label: "Spreadsheet Soul", desc: "Feelings sorted alphabetically." },
    chaos: { label: "Chaos Processor", desc: "No thoughts. Just emotional roulette." },
    wifi: { label: "Emotionally Wi-Fi Dependent", desc: "Strong signal. Random disconnects." },
    npc: { label: "NPC With Anxiety DLC", desc: "Background character with premium stress." },
};

const INTEREST_MAPPING: Record<string, { label: string, icon: string }> = {
    music: { label: "Music", icon: "🎵" },
    coding: { label: "Coding", icon: "💻" },
    gaming: { label: "Gaming", icon: "🎮" },
    sports: { label: "Sports", icon: "🏀" },
    tfi_banisa: { label: "TFI Banisa", icon: "🎬" },
    anime: { label: "Anime", icon: "🎎" },
    art: { label: "Art", icon: "🎨" },
    reading: { label: "Reading", icon: "📚" },
    travel: { label: "Travel", icon: "✈️" },
    food: { label: "Foodie", icon: "🍜" },
    fitness: { label: "Fitness", icon: "💪" },
    memes: { label: "Memes", icon: "🤡" }
};

const VIBE_MAPPING: Record<string, { label: string, icon: any }> = {
    stalker: { label: "Silent Stalker", icon: Eye },
    delusion: { label: "Main Character Delusion", icon: Crown },
    unavailable: { label: "Emotionally Unavailable", icon: Unlink },
    overthinker: { label: "Professional Overthinker", icon: Search },
    low_battery: { label: "Low Battery Human", icon: BatteryLow },
    chaos: { label: "Chaos Contributor", icon: Flame },
    flirt: { label: "Accidental Flirt", icon: Sparkles },
    therapist: { label: "Meme Therapist", icon: Clapperboard },
    phobic: { label: "Commitment Phobic", icon: DoorOpen },
    romantic: { label: "Hopeless Romantic", icon: HeartCrack },
    npc: { label: "Certified NPC", icon: User },
    ghost: { label: "Ghost in Training", icon: Ghost },
    thinker: { label: "Sleep-Deprived Thinker", icon: Moon },
    failure: { label: "Vibe Check Failure", icon: HelpCircle },
    selective: { label: "Socially Selective", icon: Target },
};

const INTENT_MAPPING: Record<string, { label: string, icon: any }> = {
    vibes: { label: "Just Vibes", icon: Eye },
    friends: { label: "Make Friends", icon: UserCircle },
    flirt: { label: "Flirt & See", icon: Flame },
    talks: { label: "Deep Talks at 2AM", icon: Moon },
    fun: { label: "Pure Entertainment", icon: Clapperboard },
    main: { label: "Main Character Arc", icon: Crown },
};

const VIBE_CATEGORIES = [
    {
        id: "energy",
        label: "Interaction Energy",
        icon: Zap,
        options: [
            { id: "lowkey", label: "Low-key", desc: "Meaningful convos only" },
            { id: "chill", label: "Chill", desc: "Normal interaction" },
            { id: "social", label: "Social", desc: "Open to meeting" },
            { id: "chaos", label: "Chaos", desc: "Bring the drama" },
        ]
    },
    {
        id: "speed",
        label: "Reply Speed",
        icon: Moon,
        options: [
            { id: "slow", label: "Slow", desc: "3-5 business days" },
            { id: "ok", label: "Sometimes fast", desc: "Mood dependent" },
            { id: "fast", label: "Quick", desc: "Usually active" },
            { id: "online", label: "Always on", desc: "Terminally online" },
        ]
    },
    {
        id: "style",
        label: "Conv Style",
        icon: Clapperboard,
        options: [
            { id: "deep", label: "Deep Talks", desc: "2 AM energy" },
            { id: "random", label: "Fun & Random", desc: "No filter" },
            { id: "sarcasm", label: "Sarcasm", desc: "Friendly menace" },
            { id: "memes", label: "Memes Only", desc: "Low quality JPEGs" },
        ]
    },
    {
        id: "battery",
        label: "Social Battery",
        icon: BatteryLow,
        options: [
            { id: "low", label: "Low", desc: "🔋 (limited chats)" },
            { id: "medium", label: "Medium", desc: "Selective energy" },
            { id: "high", label: "High", desc: "⚡ Full power" },
        ]
    },
    {
        id: "intent",
        label: "Meetup Intent",
        icon: Target,
        options: [
            { id: "online", label: "Online Only", desc: "Digital distance" },
            { id: "maybe", label: "Maybe", desc: "See the vibe first" },
            { id: "irl", label: "Down for IRL", desc: "Let's hang out" },
            { id: "events", label: "Events", desc: "Only in groups" },
        ]
    },
    {
        id: "humor",
        label: "Humor Type",
        icon: Ghost,
        options: [
            { id: "dark", label: "Dark", desc: "Twisted but fun" },
            { id: "dumb", label: "Dumb", desc: "No brain cells" },
            { id: "witty", label: "Witty", desc: "Quick thinking" },
            { id: "wholesome", label: "Wholesome", desc: "Sweet vibes" },
        ]
    },
    {
        id: "flirt",
        label: "Flirt Level",
        icon: Sparkles,
        options: [
            { id: "none", label: "Not flirty", desc: "Strictly platonic" },
            { id: "light", label: "Light teasing", desc: "Friendly fun" },
            { id: "smooth", label: "Smooth talker", desc: "Natural charm" },
            { id: "menace", label: "Menace", desc: "Certified risk" },
        ]
    },
    {
        id: "discovery",
        label: "Discovery",
        icon: Eye,
        options: [
            { id: "hidden", label: "Hiddenish", desc: "Mostly private" },
            { id: "normal", label: "Normal", desc: "Standard visibility" },
            { id: "boosted", label: "Boosted", desc: "Show me more" },
        ]
    }
];

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showVibeSettings, setShowVibeSettings] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: "",
        gender: "",
        match_preference: "",
        looking_for: "",
        privacy_settings: {} as any,
        vibe_settings: {} as any
    });
    const [showLoreInfo, setShowLoreInfo] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/profiles/me/");
                setProfile(res.data);
                setEditForm({
                    bio: res.data.bio || "",
                    gender: res.data.gender || "",
                    match_preference: res.data.match_preference || "",
                    looking_for: res.data.looking_for || "",
                    privacy_settings: res.data.privacy_settings || {
                        show_gender: false,
                        show_match_preference: false,
                        show_looking_for: false
                    },
                    vibe_settings: res.data.vibe_settings || {}
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (formDataOverride?: any) => {
        setSaving(true);
        try {
            const res = await api.patch("/profiles/me/", formDataOverride || editForm);
            setProfile(res.data);
            setIsEditing(false);
            setShowVibeSettings(false);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const confirmDeleteAccount = async () => {
        setDeleting(true);
        setDeleteError(null);
        try {
            await api.delete(`/profiles/${profile.id}/`);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = "/signup";
        } catch (err: any) {
            console.error("Deletion failed:", err);
            setDeleting(false);
            setDeleteError(err.response?.data?.error || "The Void refused to let you go. Try again later.");
        }
    };

    if (loading) return <div className="min-h-screen bg-campus-dark animate-pulse" />;

    const brainVibe = BRAIN_MAPPING[profile?.brain_type] || {
        label: "Unknown Entity",
        desc: profile?.brain_type_description || "Vibes currently loading..."
    };

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark pb-32 overflow-x-hidden">
                {/* Header Section */}
                <header className="pt-20 pb-8 px-6 flex flex-col items-center relative">
                    {/* Edit Toggle */}
                    <button
                        onClick={() => {
                            if (isEditing) handleSave();
                            else setIsEditing(true);
                        }}
                        disabled={saving}
                        className={`absolute top-24 right-8 p-3 rounded-2xl border transition-all z-20 ${isEditing
                            ? "bg-campus-accent text-campus-dark border-campus-accent shadow-lg"
                            : "bg-white/5 border-white/5 text-campus-secondary hover:bg-white/10"
                            }`}
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-campus-dark/30 border-t-campus-dark animate-spin rounded-full" />
                        ) : isEditing ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Edit3 className="w-5 h-5" />
                        )}
                    </button>

                    {isEditing && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-24 left-8 p-3 bg-white/5 border border-white/5 rounded-2xl text-campus-secondary hover:bg-white/10 transition-all z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    {/* Avatar with Glow Ring */}
                    <div className="relative mb-6 group cursor-pointer">
                        <div className="absolute inset-0 bg-campus-accent/20 blur-[100px] group-hover:bg-campus-accent/30 transition-all -z-10" />
                        <div className="relative">
                            {/* Legend Glow Ring */}
                            {profile?.lore_score >= 250 ? (
                                <div className="absolute -inset-3 bg-gradient-to-tr from-campus-accent via-campus-highlight to-campus-accent rounded-full blur-md opacity-70 animate-pulse shadow-[0_0_30px_rgba(198,183,255,0.4)]" />
                            ) : (
                                <div className="absolute -inset-1.5 bg-gradient-to-tr from-campus-accent to-campus-highlight rounded-full blur-sm opacity-40 group-hover:opacity-100 transition-all duration-500" />
                            )}
                            <div className="relative p-1 bg-campus-dark rounded-full">
                                {profile?.avatar_config ? (
                                    <Avatar config={profile.avatar_config} className="w-32 h-32" />
                                ) : (
                                    <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center text-4xl border border-white/5">
                                        {profile?.avatar_emoji || "👻"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Identity Area */}
                    <div className="text-center space-y-2 mb-8 w-full max-w-xs">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-white italic tracking-tighter animate-in fade-in duration-500">
                                {profile?.nickname || "Lost Soul"}
                            </h1>
                        </div>

                        {isEditing && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-campus-accent/60 animate-in fade-in slide-in-from-top-1 duration-300">
                                Your legend name is permanent
                            </p>
                        )}

                        <div className="flex justify-center items-center gap-2 pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                                <Shield className="w-3 h-3 text-campus-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-accent">Verified Student</span>
                            </div>

                            {profile?.is_developer && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-campus-accent/10 border border-campus-accent/20 rounded-full shadow-[0_0_15px_rgba(198,183,255,0.2)]">
                                    <Sparkles className="w-3 h-3 text-campus-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-campus-accent">DEV</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Brain Type Diagnosis Card */}
                    <div className="w-full max-w-sm px-4">
                        <div className="bg-white/2 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl relative group hover:border-campus-accent/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-campus-accent/10 rounded-2xl text-campus-accent">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-campus-secondary/40 mb-1">
                                        Mental Operating System
                                    </p>
                                    <h3 className="text-sm font-black text-white">
                                        {brainVibe.label}
                                    </h3>
                                    <p className="text-[10px] font-bold text-campus-secondary/60 leading-tight mt-1">
                                        "{brainVibe.desc}"
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-6 text-xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform">🧠</div>
                        </div>
                    </div>
                </header>

                {/* Stats Section */}
                <section className="px-6 mb-12 flex justify-center gap-12">
                    <div className="text-center group">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-campus-secondary/40 group-hover:text-campus-accent transition-colors">Lore Score</p>
                            <button
                                onClick={() => setShowLoreInfo(true)}
                                className="text-campus-secondary/40 hover:text-campus-accent transition-colors"
                            >
                                <Info className="w-2.5 h-2.5" />
                            </button>
                        </div>
                        <p className="text-2xl font-black text-campus-accent group-hover:scale-110 transition-transform">{profile?.lore_score || 0}</p>
                    </div>
                    <div className="text-center group">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-campus-secondary/40 mb-1 group-hover:text-rose-400 transition-colors">Night Streak</p>
                        <div className="flex items-center justify-center gap-1.5 translate-x-1">
                            <Flame className={`w-5 h-5 ${profile?.current_streak_count > 0 ? 'text-rose-500 fill-rose-500/20' : 'text-campus-secondary/20'} group-hover:animate-bounce`} />
                            <p className="text-2xl font-black text-white">{profile?.current_streak_count || 0}d</p>
                        </div>
                    </div>
                    <div className="text-center group">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-campus-secondary/40 mb-1 group-hover:text-campus-highlight transition-colors">Freezes</p>
                        <p className="text-2xl font-black text-campus-highlight group-hover:scale-110 transition-transform">{profile?.streak_freezes || 0}</p>
                    </div>
                </section>

                {/* Milestone Badges */}
                {(profile?.current_streak_count >= 3) && (
                    <section className="px-6 mb-12">
                        <p className="text-[10px] text-center font-black uppercase tracking-widest text-campus-secondary/40 mb-4 italic">Streak Achievements</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {profile?.current_streak_count >= 3 && (
                                <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                                    <Trophy className="w-3 h-3 text-rose-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Streak Starter (3d)</span>
                                </div>
                            )}
                            {profile?.current_streak_count >= 7 && (
                                <div className="px-3 py-1.5 bg-campus-accent/10 border border-campus-accent/20 rounded-xl flex items-center gap-2">
                                    <Flame className="w-3 h-3 text-campus-accent" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Consistent Voyager (7d)</span>
                                </div>
                            )}
                            {profile?.current_streak_count >= 14 && (
                                <div className="px-3 py-1.5 bg-campus-highlight/10 border border-campus-highlight/20 rounded-xl flex items-center gap-2">
                                    <Award className="w-3 h-3 text-campus-highlight" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Habit Master (14d)</span>
                                </div>
                            )}
                            {profile?.current_streak_count >= 30 && (
                                <div className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center gap-2">
                                    <Crown className="w-3 h-3 text-amber-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Campus Legend (30d)</span>
                                </div>
                            )}
                            {profile?.current_streak_count >= 100 && (
                                <div className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse">
                                    <Sparkles className="w-3 h-3 text-purple-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white">The Immortal (100d)</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Tonight's Damage Section */}
                <section className="px-6 mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6 px-2">
                        <Zap className="w-4 h-4 text-campus-accent" />
                        <h2 className="text-xl font-black text-white italic">Tonight's Damage</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {profile?.social_energy?.length > 0 ? (
                            profile.social_energy.map((vibeId: string) => {
                                const VibeIcon = VIBE_MAPPING[vibeId]?.icon || Sparkles;
                                return (
                                    <div
                                        key={vibeId}
                                        className="px-5 py-3 bg-white/2 border border-white/10 rounded-2xl flex items-center gap-3 hover:border-campus-accent/40 hover:bg-campus-accent/5 transition-all group"
                                    >
                                        <VibeIcon className="w-5 h-5 text-campus-accent group-hover:scale-125 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-campus-secondary/60 group-hover:text-white transition-colors">
                                            {VIBE_MAPPING[vibeId]?.label || vibeId}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-[10px] font-bold text-campus-secondary/20 italic uppercase tracking-widest text-center">
                                No damage found yet... 🌫️
                            </p>
                        )}
                    </div>
                </section>

                {/* Your Aesthetic Section */}
                <section className="px-6 mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6 px-2">
                        <Sparkles className="w-4 h-4 text-campus-accent" />
                        <h2 className="text-xl font-black text-white italic">Your Aesthetic</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {profile?.interests?.length > 0 ? (
                            profile.interests.map((interest: string) => (
                                <div
                                    key={interest}
                                    className="px-5 py-3 bg-white/2 border border-white/10 rounded-2xl flex items-center gap-3 hover:border-campus-accent/40 hover:bg-campus-accent/5 transition-all group"
                                >
                                    <span className="text-xl group-hover:scale-125 transition-transform">
                                        {INTEREST_MAPPING[interest]?.icon || "✨"}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-campus-secondary/60 group-hover:text-white transition-colors">
                                        {INTEREST_MAPPING[interest]?.label || interest}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] font-bold text-campus-secondary/20 italic uppercase tracking-widest text-center">
                                No vibes selected yet... 🌫️
                            </p>
                        )}
                        {profile?.interests?.length > 6 && (
                            <div className="px-4 py-3 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-center text-[10px] font-black text-campus-secondary/40">
                                +{profile.interests.length - 6} more
                            </div>
                        )}
                    </div>
                </section>

                {/* Current Intent Section */}
                <section className="px-6 mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6 px-2">
                        <Flame className="w-4 h-4 text-campus-accent" />
                        <h2 className="text-xl font-black text-white italic">Current Intent</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {profile?.connection_intent?.length > 0 ? (
                            profile.connection_intent.map((intentId: string) => {
                                const IntentIcon = INTENT_MAPPING[intentId]?.icon || Sparkles;
                                return (
                                    <div
                                        key={intentId}
                                        className="px-5 py-3 bg-white/2 border border-white/10 rounded-2xl flex items-center gap-3 hover:border-campus-accent/40 hover:bg-campus-accent/5 transition-all group"
                                    >
                                        <IntentIcon className="w-5 h-5 text-campus-accent group-hover:scale-125 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-campus-secondary/60 group-hover:text-white transition-colors">
                                            {INTENT_MAPPING[intentId]?.label || intentId}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-[10px] font-bold text-campus-secondary/20 italic uppercase tracking-widest text-center">
                                No intent set... 🌫️
                            </p>
                        )}
                    </div>
                </section>

                {/* Identity Preferences & Privacy Section */}
                <section className="px-6 mb-12">
                    <div className="flex items-center justify-center gap-2 mb-6 px-2">
                        <UserCircle className="w-4 h-4 text-campus-accent" />
                        <h2 className="text-xl font-black text-white italic">Self & Privacy</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: 'gender', label: 'Identity', val: profile?.gender, icon: '✨', showKey: 'show_gender' },
                            { id: 'looking_for', label: 'Here for', val: profile?.looking_for, icon: '🎯', showKey: 'show_looking_for' },
                            { id: 'match_preference', label: 'Show me', val: profile?.match_preference, icon: '🌍', showKey: 'show_match_preference' },
                        ].map((item) => (
                            <div key={item.id} className="bg-white/2 border border-white/5 rounded-3xl p-5 backdrop-blur-md relative group">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white/5 rounded-2xl text-xl">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-campus-secondary/40 mb-0.5">{item.label}</p>
                                            {isEditing ? (
                                                <div className="flex gap-2 mt-1">
                                                    {item.id === 'gender' ? (
                                                        ['man', 'woman', 'others'].map(g => (
                                                            <button
                                                                key={g}
                                                                onClick={() => setEditForm({ ...editForm, gender: g })}
                                                                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${editForm.gender === g ? 'bg-campus-accent text-campus-dark' : 'bg-white/5 text-campus-secondary'}`}
                                                            >
                                                                {g}
                                                            </button>
                                                        ))
                                                    ) : item.id === 'looking_for' ? (
                                                        ['friends', 'dating', 'both'].map(l => (
                                                            <button
                                                                key={l}
                                                                onClick={() => setEditForm({ ...editForm, looking_for: l })}
                                                                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${editForm.looking_for === l ? 'bg-campus-highlight text-campus-dark' : 'bg-white/5 text-campus-secondary'}`}
                                                            >
                                                                {l}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        ['men', 'women', 'everyone'].map(m => (
                                                            <button
                                                                key={m}
                                                                onClick={() => setEditForm({ ...editForm, match_preference: m })}
                                                                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${editForm.match_preference === m ? 'bg-white text-campus-dark' : 'bg-white/5 text-campus-secondary'}`}
                                                            >
                                                                {m}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            ) : (
                                                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                                    {item.val || "Unknown"}
                                                </h4>
                                            )}
                                        </div>
                                    </div>

                                    {/* Privacy Toggle */}
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-campus-secondary/30">Visibility</p>
                                        <button
                                            disabled={!isEditing}
                                            type="button"
                                            onClick={() => {
                                                const newPrivacy = { ...editForm.privacy_settings };
                                                newPrivacy[item.showKey] = !newPrivacy[item.showKey];
                                                setEditForm({ ...editForm, privacy_settings: newPrivacy });
                                            }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${editForm.privacy_settings?.[item.showKey]
                                                ? "bg-campus-accent/10 border-campus-accent/40 text-campus-accent"
                                                : "bg-white/2 border-white/5 text-campus-secondary/40"
                                                } ${!isEditing && "opacity-50"}`}
                                        >
                                            {editForm.privacy_settings?.[item.showKey] ? (
                                                <>
                                                    <Eye className="w-3 h-3" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Public</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-3 h-3" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Private</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Actions / Bio Section */}
                <section className="px-6 mb-8">
                    {isEditing ? (
                        <div className="bg-white/2 border border-campus-accent/20 rounded-3xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
                            <textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                className="w-full bg-transparent border-none resize-none text-sm text-center text-white italic leading-relaxed outline-none min-h-[100px]"
                                placeholder="Tell us your lore..."
                            />
                            <p className="text-[9px] font-bold uppercase tracking-widest text-campus-accent/40 text-center mt-4">Your bio is public lore</p>
                        </div>
                    ) : (
                        profile?.bio && (
                            <div className="bg-white/2 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                                <p className="text-sm text-center text-campus-secondary/80 italic leading-relaxed relative z-10 group-hover:text-white transition-colors">
                                    "{profile.bio}"
                                </p>
                                <div className="absolute top-0 right-0 p-4 font-black text-4xl text-white/5 select-none quote-mark">“</div>
                            </div>
                        )
                    )}
                </section>

                {/* Settings & Bottom Actions */}
                <section className="px-6 space-y-4">
                    <button
                        onClick={() => setShowVibeSettings(true)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-campus-accent/10 rounded-xl text-campus-accent">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Vibe Settings</h4>
                                <p className="text-[10px] text-campus-secondary/60 font-bold uppercase tracking-widest mt-1">Adjust your presence</p>
                            </div>
                        </div>
                    </button>

                    <div className="py-12 flex flex-col items-center justify-center gap-8">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                            <div className="text-4xl">🕯️</div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-campus-secondary text-center">More features materializing soon...</p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                window.location.href = "/";
                            }}
                            className="flex flex-col items-center gap-2 group p-4 border border-white/5 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-all w-full max-w-[200px]"
                        >
                            <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-all">
                                <DoorOpen className="w-6 h-6 text-campus-secondary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-campus-secondary">Drop the Disguise</span>
                        </button>

                        {/* Delete Account Button */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={deleting}
                            className="flex flex-col items-center gap-2 group p-4 opacity-40 hover:opacity-100 transition-all duration-500"
                        >
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl group-hover:bg-rose-500 group-hover:text-white group-hover:scale-110 transition-all flex items-center justify-center">
                                {deleting ? (
                                    <div className="w-5 h-5 border-2 border-campus-dark/30 border-t-campus-dark animate-spin rounded-full" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500/50 group-hover:text-rose-500">Delete Account</span>
                        </button>
                    </div>
                </section>

                {/* Background Aesthetic */}
                <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
                <div className="fixed bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <VibeDialog
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDeleteAccount}
                    title="Account Self-Destruction"
                    body="This will permanently erase your lore, your streaks, and your digital soul. There is no comeback arc after this. 💀"
                    confirmText="🔥 BURN IT ALL"
                    cancelText="😬 I'm not ready to go"
                    variant="danger"
                    isLoading={deleting}
                    error={deleteError}
                />

                {/* Lore Info Modal */}
                {showLoreInfo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-campus-card border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full relative shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-campus-accent to-campus-highlight" />
                            <button
                                onClick={() => setShowLoreInfo(false)}
                                className="absolute top-6 right-6 text-campus-secondary hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-white italic mb-1">Lore System</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-campus-accent">Reputation & Influence</p>
                            </div>

                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <section>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">How to earn</h4>
                                    <div className="space-y-2">
                                        {[
                                            { action: "Daily Login", lore: "+2" },
                                            { action: "Voting on Events", lore: "+3" },
                                            { action: "Creating Posts", lore: "+4" },
                                            { action: "Event Comments", lore: "+2" },
                                            { action: "Approved Events", lore: "+5" },
                                            { action: "Profile Setup", lore: "+1" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-xs font-bold text-campus-secondary/80 italic">{item.action}</span>
                                                <span className="text-xs font-black text-campus-accent">{item.lore}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Unlocks</h4>
                                    <div className="space-y-3">
                                        {[
                                            { threshold: 150, benefit: "Can create event proposals" },
                                            { threshold: 300, benefit: "Events need only 8 votes" },
                                            { threshold: 500, benefit: "Campus Legend Glow Ring" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="bg-campus-accent/10 px-2 py-0.5 rounded-lg text-[10px] font-black text-campus-accent">
                                                    {item.threshold}
                                                </div>
                                                <p className="text-[11px] font-bold text-campus-secondary/60 leading-tight">
                                                    {item.benefit}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vibe Settings Modal */}
                {showVibeSettings && (
                    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-6 animate-in fade-in duration-300">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            className="bg-campus-dark border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic">Vibe Settings</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-campus-accent">Control your presence, not identity</p>
                                </div>
                                <button
                                    onClick={() => setShowVibeSettings(false)}
                                    className="p-3 bg-white/5 rounded-2xl text-campus-secondary hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar pb-32">
                                {VIBE_CATEGORIES.map(cat => (
                                    <div key={cat.id} className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <cat.icon className="w-4 h-4 text-campus-accent" />
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">{cat.label}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {cat.options.map(opt => {
                                                const isSelected = editForm.vibe_settings[cat.id] === opt.id;
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setEditForm({
                                                            ...editForm,
                                                            vibe_settings: {
                                                                ...editForm.vibe_settings,
                                                                [cat.id]: opt.id
                                                            }
                                                        })}
                                                        className={`flex flex-col gap-1 p-4 rounded-2xl border text-left transition-all ${isSelected
                                                            ? "bg-campus-accent/10 border-campus-accent/40 shadow-lg scale-105"
                                                            : "bg-white/2 border-white/5 text-campus-secondary hover:bg-white/5"
                                                            }`}
                                                    >
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-campus-accent" : "text-white/80"}`}>
                                                            {opt.label}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-campus-secondary/40">
                                                            {opt.desc}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-campus-dark border-t border-white/10 flex gap-4">
                                <button
                                    onClick={() => setShowVibeSettings(false)}
                                    className="flex-1 py-5 bg-white/5 rounded-2xl font-bold uppercase tracking-widest text-campus-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSave()}
                                    disabled={saving}
                                    className="flex-[2] py-5 bg-campus-accent text-campus-dark rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-campus-accent/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {saving ? "Saving..." : "Lock in Vibe"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </AppWrapper>
    );
}
