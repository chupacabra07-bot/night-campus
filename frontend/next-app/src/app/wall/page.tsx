"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Search, Filter, Moon } from "lucide-react";
import api from "@/lib/api";
import { PostCard } from "@/components/wall/PostCard";
import { CreatePostModal } from "@/components/wall/CreatePostModal";
import { AppWrapper } from "@/components/layout/AppWrapper";

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

export default function WallPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [filter, setFilter] = useState("all");

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

    useEffect(() => {
        fetchPosts();

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
            }
        };

        return () => ws.close();
    }, []);

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark pb-32">
                {/* Wall Header */}
                <div className="sticky top-0 z-50 bg-campus-dark/40 backdrop-blur-2xl border-b border-white/5 pt-12 pb-6 px-6">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white flex items-center gap-2">
                                <Moon className="text-campus-accent w-6 h-6" />
                                THE WALL
                            </h1>
                            <p className="text-[10px] text-campus-secondary font-bold uppercase tracking-widest mt-1">
                                {posts.length} Active Lore Threads
                            </p>
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

                {/* Content Feed */}
                <div className="max-w-2xl mx-auto p-6 space-y-6">
                    {/* Mood Quick Filter */}
                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                        {["all", "rant", "confession", "advice", "chaos"].map(m => (
                            <button
                                key={m}
                                onClick={() => setFilter(m)}
                                className={`
                                    px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap
                                    ${filter === m
                                        ? 'bg-campus-accent text-campus-dark shadow-lg shadow-campus-accent/20'
                                        : 'bg-white/5 text-campus-secondary hover:bg-white/10'
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
                                    <PostCard key={post.id} post={post} />
                                ))
                        )}
                    </AnimatePresence>

                    {!loading && posts.length === 0 && (
                        <div className="text-center py-32 space-y-4">
                            <div className="text-6xl grayscale opacity-20">🕯️</div>
                            <h3 className="text-xl font-bold text-campus-secondary italic">The night is quiet...</h3>
                            <p className="text-sm text-campus-secondary/40">Be the first to break the silence.</p>
                        </div>
                    )}
                </div>

                {/* Floating Action Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateOpen(true)}
                    className="fixed bottom-10 right-10 z-[60] w-16 h-16 bg-campus-accent text-campus-dark rounded-full shadow-[0_0_30px_rgba(198,183,255,0.4)] flex items-center justify-center transition-all group"
                >
                    <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" />
                </motion.button>

                <CreatePostModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onPostCreated={fetchPosts}
                />

                {/* Background Aesthetic */}
                <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
                <div className="fixed bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            </main>
        </AppWrapper>
    );
}
