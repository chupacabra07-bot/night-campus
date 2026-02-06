import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MoodBadge } from "./MoodBadge";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { ReactionPicker } from "./ReactionPicker";
import { ReportModal } from "./ReportModal";
import { ReblastModal } from "./ReblastModal";
import { Star, Flag, Repeat, Zap, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface PostCardProps {
    post: {
        id: string;
        title?: string;
        content: string;
        mood: string;
        created_at: string;
        reaction_count: number;
        reblast_count?: number;
        can_delete?: boolean;
        is_saved?: boolean;
        my_reaction?: string | null;
        reblast_of?: string | null;
        user: {
            profile: {
                nickname: string;
                avatar_emoji: string;
                avatar_config: any;
                is_developer?: boolean;
            }
        }
    };
    onDeleteRequested?: (id: string) => void;
}

const REACTION_EMOJIS: Record<string, string> = {
    heart: '❤️',
    joy: '😂',
    fire: '🔥',
    mind_blown: '🤯',
    hundred: '💯',
    cry: '😭'
};

export function PostCard({ post, onDeleteRequested }: PostCardProps) {
    const [likes, setLikes] = useState(post.reaction_count);
    const [myReaction, setMyReaction] = useState(post.my_reaction);
    const [isReacting, setIsReacting] = useState(false);
    const [isSaved, setIsSaved] = useState(post.is_saved);
    const [showPicker, setShowPicker] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showReblast, setShowReblast] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [pickerTimeout, setPickerTimeout] = useState<NodeJS.Timeout | null>(null);

    const loreImpact = likes + (post.reblast_count || 0) * 2;

    const handleReact = async (type: string = 'heart') => {
        if (isReacting) return;

        const isTogglingOff = myReaction === type;
        const oldReaction = myReaction;

        setMyReaction(isTogglingOff ? null : type);
        setLikes(prev => {
            if (isTogglingOff) return prev - 1;
            if (oldReaction) return prev; // Just changing type
            return prev + 1;
        });

        setIsReacting(true);

        try {
            await api.post(`/posts/${post.id}/react/`, { reaction_type: type });
        } catch (err) {
            setMyReaction(oldReaction);
            setLikes(prev => {
                if (isTogglingOff) return prev + 1;
                if (oldReaction) return prev;
                return prev - 1;
            });
            console.error(err);
        } finally {
            setIsReacting(false);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        const oldSaved = isSaved;
        setIsSaved(!oldSaved);
        api.post(`/posts/${post.id}/save_post/`).catch(err => {
            setIsSaved(oldSaved);
            console.error(err);
        });
        setShowMenu(false);
    };

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowReport(true);
        setShowMenu(false);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: post.title || 'Night Campus Lore',
            text: post.content,
            url: window.location.origin + `/wall?post=${post.id}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error(err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const startPickerTimer = () => {
        const timeout = setTimeout(() => setShowPicker(true), 500);
        setPickerTimeout(timeout);
    };

    const clearPickerTimer = () => {
        if (pickerTimeout) clearTimeout(pickerTimeout);
    };

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <GlassCard className="p-0 border-white/5 hover:border-white/10 overflow-visible">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center">
                                {post.user?.profile?.avatar_config ? (
                                    <Avatar config={post.user.profile.avatar_config} className="w-10 h-10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5">
                                        {post.user?.profile?.avatar_emoji || "👻"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-white leading-none">
                                        {post.user?.profile?.nickname || "Ghost"}
                                    </h3>
                                    {post.user?.profile?.is_developer && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-campus-accent/10 border border-campus-accent/20 rounded-lg shadow-[0_0_10px_rgba(198,183,255,0.2)]">
                                            <Sparkles className="w-2.5 h-2.5 text-campus-accent" />
                                            <span className="text-[8px] font-black text-campus-accent uppercase tracking-widest">Dev</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-campus-secondary/60 font-bold uppercase tracking-widest mt-1">
                                    {timeAgo(post.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {post.can_delete && (
                                <button
                                    onClick={() => onDeleteRequested?.(post.id)}
                                    className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            <MoodBadge mood={post.mood} />
                        </div>
                    </div>

                    {post.title && (
                        <div className="text-xl font-black text-white italic mb-2 tracking-tight">
                            {post.title}
                        </div>
                    )}

                    <div className="text-gray-300 text-lg leading-relaxed font-medium mb-6 whitespace-pre-wrap">
                        {post.content}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black text-campus-accent/60 uppercase tracking-widest">
                            <Zap className="w-3 h-3 fill-campus-accent/20" />
                            {loreImpact} Lore Impact
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <button
                                    onMouseDown={startPickerTimer}
                                    onMouseUp={clearPickerTimer}
                                    onMouseLeave={clearPickerTimer}
                                    onTouchStart={startPickerTimer}
                                    onTouchEnd={clearPickerTimer}
                                    onClick={() => !showPicker && handleReact(myReaction || 'heart')}
                                    disabled={isReacting}
                                    className={`flex items-center gap-1.5 transition-all group ${myReaction ? 'text-campus-accent scale-110' : 'text-campus-secondary hover:text-campus-accent/60'}`}
                                >
                                    <motion.div whileTap={{ scale: 1.5 }}>
                                        {myReaction ? (
                                            <span className="text-sm">{REACTION_EMOJIS[myReaction]}</span>
                                        ) : (
                                            <Heart className="w-4 h-4 group-hover:fill-campus-accent/20" />
                                        )}
                                    </motion.div>
                                    <span className="text-xs font-bold">{likes}</span>
                                </button>

                                <AnimatePresence>
                                    {showPicker && (
                                        <ReactionPicker
                                            onSelect={(type) => {
                                                handleReact(type);
                                                setShowPicker(false);
                                            }}
                                            onClose={() => setShowPicker(false)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setShowReblast(true)}
                                className="flex items-center gap-1.5 text-campus-secondary hover:text-campus-accent transition-colors group"
                            >
                                <Repeat className="w-4 h-4" />
                                <span className="text-xs font-bold">{post.reblast_count || 0}</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="text-campus-secondary hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(!showMenu);
                                    }}
                                    className="text-campus-secondary hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {showMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowMenu(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute bottom-full right-0 mb-2 w-48 bg-campus-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                                            >
                                                <button
                                                    onClick={handleSave}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-campus-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                >
                                                    <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                                                    {isSaved ? "Unsave Lore" : "Save Lore"}
                                                </button>
                                                <div className="h-px bg-white/5 mx-2" />
                                                <button
                                                    onClick={handleReport}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
                                                >
                                                    <Flag className="w-4 h-4" />
                                                    Report Post
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-campus-accent text-campus-dark rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl z-[200]"
                        >
                            Link copied. Spread the chaos.
                        </motion.div>
                    )}
                </AnimatePresence>

                <ReportModal
                    isOpen={showReport}
                    onClose={() => setShowReport(false)}
                    postId={post.id}
                />
                <ReblastModal
                    isOpen={showReblast}
                    onClose={() => setShowReblast(false)}
                    post={post}
                    onSuccess={() => {
                        // Success handling (parent usually handles WS update, but simple alert for now)
                        alert("Lore reblasted!");
                    }}
                />
            </GlassCard>
        </motion.div>
    );
}
