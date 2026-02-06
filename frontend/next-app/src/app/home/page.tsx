"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Flame, Search, Filter, Moon, Sparkles,
    Megaphone, MessageSquare, Zap, Shield,
    Info, Angry, Ghost, Lightbulb, X,
    CloudLightning, Calendar, Zap as SparkleIcon
} from "lucide-react";
import api from "@/lib/api";
import { PostCard } from "@/components/wall/PostCard";
import { CreatePostModal } from "@/components/wall/CreatePostModal";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { VotingFeed } from "@/components/home/VotingFeed";
import { VibeDialog } from "@/components/ui/VibeDialog";
import { VibeButton } from "@/components/ui/VibeButton";
import { CreateEventModal } from "@/components/events/CreateEventModal";

interface Post {
    id: string;
    content: string;
    mood: string;
    created_at: string;
    reaction_count: number;
    user: {
        profile: {
            nickname: string;
            avatar_emoji: string;
            avatar_config: any;
        }
    }
}

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pendingEvents, setPendingEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEventCreateOpen, setIsEventCreateOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedMood, setSelectedMood] = useState("chaos");
    const [filter, setFilter] = useState("all");
    const [user, setUser] = useState<any>(null);
    const [isPostDeleteDialogOpen, setIsPostDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [postDeleteError, setPostDeleteError] = useState<string | null>(null);
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);
    const [subtitleIndex, setSubtitleIndex] = useState(0);

    const subtitles = [
        "Campus transmissions",
        "Live from the chaos",
        "Where assignments go to die"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleIndex(prev => (prev + 1) % subtitles.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/posts/");
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingEvents = async () => {
        try {
            const res = await api.get("/events/pending_approval/");
            setPendingEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const sarcasm = useState(() => {
        const lines = [
            "Democracy is waiting. Sadly.",
            "One vote left. Use it or don't. We'll judge.",
            "Campus destiny pending. You're holding the button.",
            "Your vote could shape the future. No pressure."
        ];
        return lines[Math.floor(Math.random() * lines.length)];
    })[0];

    useEffect(() => {
        // Hydrate transition
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        }

        fetchPosts();
        fetchPendingEvents();

        // WebSocket Setup
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${wsProtocol}//localhost:8000/ws/wall/`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'post_created') {
                setPosts(prev => [data.post, ...prev]);
            } else if (data.type === 'reaction_updated') {
                setPosts(prev => prev.map(p =>
                    p.id === data.post.id ? { ...p, reaction_count: data.post.reaction_count } : p
                ));
            } else if (data.type === 'event_proposed') {
                setPendingEvents(prev => [data.event, ...prev]);
            } else if (data.type === 'event_vote_updated') {
                if (data.event.status === 'approved') {
                    setPendingEvents(prev => prev.filter(e => e.id !== data.event.id));
                } else {
                    setPendingEvents(prev => prev.map(e =>
                        e.id === data.event.id ? { ...e, vote_count: data.event.vote_count } : e
                    ));
                }
            } else if (data.type === 'event_reaction_updated') {
                setPendingEvents(prev => prev.map(e =>
                    e.id === data.event.id ? { ...e, ...data.event } : e
                ));
            } else if (data.type === 'event_deleted') {
                setPendingEvents(prev => prev.filter(e => e.id !== data.event.id));
            } else if (data.type === 'post_deleted') {
                setPosts(prev => prev.filter(p => p.id !== data.post.id));
            }
        };

        return () => ws.close();
    }, []);

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark pb-32">
                {/* Dashboard Header */}
                <div className="sticky top-0 z-50 bg-campus-dark/40 backdrop-blur-2xl border-b border-white/5 pt-12 pb-6 px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                                    <Sparkles className="text-campus-accent w-6 h-6" />
                                    THE WALL
                                </h1>
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={subtitleIndex}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-[0.2em]"
                                    >
                                        {subtitles[subtitleIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all relative group">
                                    <Search className="w-5 h-5 text-campus-secondary group-hover:text-campus-accent transition-colors" />
                                    <div className="absolute inset-0 rounded-2xl bg-campus-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all relative group">
                                    <Filter className="w-5 h-5 text-campus-secondary group-hover:text-campus-accent transition-colors" />
                                    <div className="absolute inset-0 rounded-2xl bg-campus-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Feed */}
                <div className="max-w-2xl mx-auto p-6 space-y-12">
                    {/* Vote Reminder Banner */}
                    <AnimatePresence>
                        {(() => {
                            const unvotedCount = pendingEvents.filter(e => !e.user_has_voted).length;
                            if (unvotedCount > 0 && !isBannerDismissed) {
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-campus-accent/10 to-campus-highlight/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-campus-accent/20 rounded-xl flex items-center justify-center animate-pulse">
                                                    <Zap className="w-4 h-4 text-campus-accent" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">
                                                    You still have {unvotedCount} {unvotedCount === 1 ? 'vote' : 'votes'}. {sarcasm}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => window.location.href = "/vote"}
                                                    className="px-4 py-2 bg-campus-accent text-campus-dark rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                                                >
                                                    Go Vote →
                                                </button>
                                                <button
                                                    onClick={() => setIsBannerDismissed(true)}
                                                    className="p-2 text-white/20 hover:text-white transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }
                            return null;
                        })()}
                    </AnimatePresence>

                    {/* Posts Section */}
                    <div className="space-y-6">
                        {/* Mood Quick Filter */}
                        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                            {["all", "rant", "confession", "advice", "chaos"].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setFilter(m)}
                                    className={`
                                    px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border
                                    ${filter === m
                                            ? 'bg-campus-accent border-campus-accent/50 text-campus-dark shadow-[0_0_15px_rgba(198,183,255,0.3)] opacity-100'
                                            : 'bg-white/5 border-white/5 text-campus-secondary hover:bg-white/10 opacity-60 hover:opacity-100'
                                        }
                                `}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="w-full h-48 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
                                ))
                            ) : (
                                posts
                                    .filter(p => filter === "all" || p.mood === filter)
                                    .map(post => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <PostCard
                                                post={post}
                                                onDeleteRequested={(id: string) => {
                                                    setPostToDelete(id);
                                                    setPostDeleteError(null);
                                                    setIsPostDeleteDialogOpen(true);
                                                }}
                                            />
                                        </motion.div>
                                    ))
                            )}
                        </AnimatePresence>

                        {!loading && posts.length === 0 && (
                            <div className="text-center py-32 space-y-6">
                                <div className="text-6xl grayscale opacity-20 animate-bounce">🕯️</div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white italic">It&apos;s quiet. Suspiciously quiet.</h3>
                                    <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest">Be the reason that changes.</p>
                                </div>
                                <VibeButton
                                    onClick={() => setIsMenuOpen(true)}
                                    variant="secondary"
                                    className="px-8"
                                >
                                    Break the Silence
                                </VibeButton>
                            </div>
                        )}
                    </div>

                    {/* Floating Action Button */}
                    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-3">
                        <AnimatePresence>
                            {/* Potential Tooltip could go here */}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap="tap"
                            onClick={() => setIsMenuOpen(true)}
                            className="w-16 h-16 bg-campus-accent text-campus-dark rounded-full shadow-[0_0_30px_rgba(198,183,255,0.4)] flex items-center justify-center transition-all group relative overflow-visible"
                        >
                            {/* Sound Waves - Burst on Tap */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 1 }}
                                    variants={{
                                        tap: {
                                            opacity: [0.5, 0],
                                            scale: [1, 2.5],
                                            transition: {
                                                duration: 0.8,
                                                ease: "easeOut",
                                                delay: i * 0.1
                                            }
                                        }
                                    }}
                                    className="absolute inset-0 bg-campus-accent/40 rounded-full -z-10"
                                />
                            ))}

                            <Megaphone className="w-8 h-8 transition-transform group-hover:rotate-12" />

                            {/* Hover Tooltip */}
                            <div className="absolute right-20 bg-campus-card/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                                Make an announcement
                            </div>
                        </motion.button>
                    </div>

                    {/* Creation Menu Bottom Sheet */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="fixed inset-0 bg-campus-dark/60 backdrop-blur-sm z-[70]"
                                />
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    className="fixed bottom-0 left-0 right-0 z-[80] bg-campus-card border-t border-white/5 rounded-t-[3rem] p-8 pb-12 shadow-2xl"
                                >
                                    <div className="max-w-md mx-auto">
                                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

                                        <div className="mb-8 text-center">
                                            <h2 className="text-2xl font-black text-white italic">What are you starting?</h2>
                                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-[0.2em] mt-2">
                                                Be the reason THE WALL gets interesting.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {[
                                                { id: 'rant', label: 'Rant', subtext: 'Yell into the void. We\'ll listen.', icon: CloudLightning, color: 'text-red-400', bg: 'bg-red-400/10' },
                                                { id: 'confession', label: 'Confession', subtext: 'Say it. No one knows it\'s you.', icon: Ghost, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                                                { id: 'advice', label: 'Advice', subtext: 'Wisdom. Or at least confidence.', icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                                                { id: 'chaos', label: 'Chaos', subtext: 'Unpredictable. Like you.', icon: SparkleIcon, color: 'text-campus-accent', bg: 'bg-campus-accent/10' },
                                                { id: 'event', label: 'Propose Event', subtext: 'Create a campus moment.', icon: Calendar, color: 'text-campus-highlight', bg: 'bg-campus-highlight/10' }
                                            ].map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (item.id === 'event') {
                                                            setIsMenuOpen(false);
                                                            setIsEventCreateOpen(true);
                                                        } else {
                                                            setSelectedMood(item.id);
                                                            setIsMenuOpen(false);
                                                            setIsCreateOpen(true);
                                                        }
                                                    }}
                                                    className="w-full p-5 bg-white/2 border border-white/5 rounded-[2rem] flex items-center gap-6 hover:bg-white/5 hover:border-white/10 transition-all group text-left"
                                                >
                                                    <div className={`p-3.5 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-white italic leading-tight">{item.label}</h4>
                                                        <p className="text-[10px] text-campus-secondary/60 font-black uppercase tracking-widest">{item.subtext}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <CreatePostModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onPostCreated={fetchPosts}
                        initialMood={selectedMood}
                    />

                    <CreateEventModal
                        isOpen={isEventCreateOpen}
                        onClose={() => setIsEventCreateOpen(false)}
                        onCreated={fetchPendingEvents}
                        userScore={user?.profile?.lore_score || 0}
                    />

                    {/* Background Aesthetic */}
                    <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
                    <div className="fixed bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                    <VibeDialog
                        isOpen={isPostDeleteDialogOpen}
                        onClose={() => setIsPostDeleteDialogOpen(false)}
                        onConfirm={async () => {
                            if (!postToDelete) return;
                            setIsDeletingPost(true);
                            setPostDeleteError(null);
                            try {
                                await api.delete(`/posts/${postToDelete}/`);
                                setPosts(prev => prev.filter(p => p.id !== postToDelete));
                                setIsPostDeleteDialogOpen(false);
                                setPostToDelete(null);
                            } catch (err: any) {
                                console.error("Failed to delete post:", err);
                                setPostDeleteError(err.response?.data?.error || "The lore refused to be purged.");
                            } finally {
                                setIsDeletingPost(false);
                            }
                        }}
                        title="Erasing the Lore"
                        body="This post will be purged from the timeline. No legacy, no archive, just void."
                        confirmText="🔥 Purge it"
                        cancelText="😬 Let it stay"
                        variant="danger"
                        isLoading={isDeletingPost}
                        error={postDeleteError}
                    />
                </div>
            </main>
        </AppWrapper>
    );
}
