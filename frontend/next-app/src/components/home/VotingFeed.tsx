"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Clock, MapPin, Sparkles, Trash2, Heart, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { VibeDialog } from "@/components/ui/VibeDialog";
import { VibeInfoDialog } from "@/components/ui/VibeInfoDialog";
import api from "@/lib/api";

interface VotingCardProps {
    event: {
        id: string;
        title: string;
        event_type: string;
        start_time: string;
        vote_count: number;
        user_has_voted: boolean;
        is_organizer: boolean;
        can_delete: boolean;
        reaction_counts: Record<string, number>;
        user_reaction: string | null;
        organizer: {
            profile: {
                nickname: string;
                lore_score: number;
            }
        }
    };
    onVote: () => void;
    onDeleteRequested: (eventId: string) => void;
}

export function VotingCard({ event, onVote, onDeleteRequested }: VotingCardProps) {
    const [isVoted, setIsVoted] = useState(event.user_has_voted);
    const [votedType, setVotedType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userReaction, setUserReaction] = useState<string | null>(event.user_reaction);

    const handleVote = async (isUpvote: boolean) => {
        if (isVoted || loading || event.is_organizer) return;
        setLoading(true);
        try {
            await api.post(`/events/${event.id}/vote/`, { is_upvote: isUpvote });
            setIsVoted(true);
            setVotedType(isUpvote ? 'up' : 'down');
            onVote();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReact = async (reactionType: string) => {
        if (loading) return;
        try {
            await api.post(`/events/${event.id}/react/`, { reaction_type: reactionType });
            setUserReaction(reactionType);
            onVote(); // Refresh counts
        } catch (err) {
            console.error(err);
        }
    };

    const threshold = event.organizer.profile.lore_score >= 300 ? 8 : 10;
    const progress = Math.min((event.vote_count / threshold) * 100, 100);

    const REACTION_EMOJIS: Record<string, string> = {
        love: "❤️",
        okay: "👌",
        cant_say: "🤔",
        pass: "⏭️"
    };

    return (
        <GlassCard className="p-0 border-white/5 hover:border-white/10 overflow-hidden relative group">
            {/* Vertical Reaction Bar */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-white/[0.02] border-l border-white/5 flex flex-col items-center justify-center gap-4 z-20 opacity-40 group-hover:opacity-100 transition-opacity">
                {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                    <button
                        key={type}
                        onClick={() => handleReact(type)}
                        className={`
                            w-8 h-8 rounded-full flex flex-col items-center justify-center transition-all hover:scale-125
                            ${userReaction === type ? 'bg-campus-accent/20 scale-110 shadow-[0_0_10px_rgba(198,183,255,0.2)]' : 'hover:bg-white/5'}
                        `}
                    >
                        <span className="text-sm">{emoji}</span>
                        {event.reaction_counts[type] > 0 && (
                            <span className="text-[8px] font-black text-white/40 mt-0.5">{event.reaction_counts[type]}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className={`p-6 ${event.is_organizer ? 'pr-14' : 'pr-6'} group-hover:pr-14 transition-all`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="px-3 py-1 bg-campus-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest text-campus-accent border border-campus-accent/20">
                            {event.event_type}
                        </span>
                        <h3 className="text-xl font-black text-white mt-3 leading-tight">{event.title}</h3>
                    </div>
                    {event.can_delete && (
                        <button
                            onClick={() => onDeleteRequested(event.id)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                            title="Delete this proposal (Grace period active)"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="space-y-2 mb-6 text-sm text-campus-secondary/60 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(event.start_time).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Proposed by {event.organizer.profile.nickname} • Lore {event.organizer.profile.lore_score}
                    </div>
                </div>

                {/* Voting Progress */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-campus-secondary/40">
                        <span>Progress</span>
                        <span>{event.vote_count} / {threshold} Votes {threshold === 8 && "(Lore Perk)"}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-campus-accent shadow-[0_0_15px_rgba(198,183,255,0.6)]"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleVote(true)}
                        disabled={isVoted || loading || event.is_organizer}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all
                            ${isVoted && votedType === 'up'
                                ? 'bg-campus-accent text-campus-dark shadow-[0_0_20px_rgba(198,183,255,0.4)]'
                                : (event.is_organizer ? 'bg-white/2 text-white/20 border border-white/5 cursor-not-allowed' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5')
                            }
                        `}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        {isVoted && votedType === 'up' ? "You're In" : "I'm In"}
                    </button>
                    <button
                        onClick={() => handleVote(false)}
                        disabled={isVoted || loading || event.is_organizer}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all
                            ${isVoted && votedType === 'down'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                                : (event.is_organizer ? 'bg-white/2 text-white/20 border border-white/5 cursor-not-allowed' : 'bg-white/5 text-campus-secondary hover:bg-white/10 border border-white/5')
                            }
                        `}
                    >
                        <ThumbsDown className="w-4 h-4" />
                        {isVoted && votedType === 'down' ? "Skipped" : "Skip"}
                    </button>
                </div>

                <AnimatePresence>
                    {(isVoted || event.is_organizer) && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-[10px] font-black uppercase tracking-widest text-campus-accent mt-4 animate-pulse uppercase"
                        >
                            {event.is_organizer
                                ? "You proposed this. You can't back your own chaos."
                                : votedType === 'up'
                                    ? "You've contributed to democracy. Brave."
                                    : "Democracy has spoken. Harsh."}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] rounded-full -z-10 transition-all ${progress >= 100 ? 'bg-campus-accent/40' : 'bg-campus-accent/5'}`} />
        </GlassCard>
    );
}

export function VotingFeed({ events, onUpdate }: { events: any[], onUpdate: () => void }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [showVotingInfo, setShowVotingInfo] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    if (events.length === 0) return null;

    const handleDeleteClick = (eventId: string) => {
        setEventToDelete(eventId);
        setDeleteError(null);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await api.delete(`/events/${eventToDelete}/`);
            onUpdate();
            setIsDeleteDialogOpen(false);
            setEventToDelete(null);
        } catch (err: any) {
            console.error("Failed to delete event:", err);
            const msg = err.response?.data?.error || "The void rejected your request.";
            setDeleteError(msg);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1 px-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white italic">Democracy, Unfortunately</h2>
                    <button
                        onClick={() => setShowVotingInfo(true)}
                        className="p-1 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-campus-secondary/40 hover:text-campus-accent transition-all flex items-center gap-1.5"
                    >
                        <Info className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">Info</span>
                    </button>
                </div>
                <p className="text-[10px] text-campus-secondary/60 font-black uppercase tracking-widest">
                    Vote on which events deserve to exist.
                </p>
            </div>

            <VibeInfoDialog
                isOpen={showVotingInfo}
                onClose={() => setShowVotingInfo(false)}
                title="How Voting Works"
                body="If the crowd approves your madness, it gets immortalized on the campus calendar."
                subtext="Events with enough votes get officially scheduled and published for everyone."
                icon="flame"
                buttonText="LEGENDARY"
            />

            <div className="grid grid-cols-1 gap-6">
                {events.map(event => (
                    <VotingCard
                        key={event.id}
                        event={event}
                        onVote={onUpdate}
                        onDeleteRequested={handleDeleteClick}
                    />
                ))}
            </div>

            {/* Chaotic Confirmation Dialog */}
            <VibeDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="About to erase your masterpiece"
                body="This event will disappear into the void. No dramatic comeback arc."
                confirmText="🔥 Yes, delete it"
                cancelText="😬 Wait, I peaked with this"
                variant="danger"
                isLoading={deleteLoading}
                error={deleteError}
            />
        </div>
    );
}
