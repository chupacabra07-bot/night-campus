"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import api from "@/lib/api";

interface EventCardProps {
    event: {
        id: string;
        title: string;
        description: string;
        location: string;
        event_type: string;
        start_time: string;
        rsvp_count: number;
        user_rsvp_status: string | null;
        organizer: {
            profile: {
                nickname: string;
                avatar_emoji: string;
            }
        }
    };
}

export function EventCard({ event }: EventCardProps) {
    const [rsvpCount, setRsvpCount] = useState(event.rsvp_count);
    const [userStatus, setUserStatus] = useState(event.user_rsvp_status);
    const [isLoading, setIsLoading] = useState(false);

    const handleRSVP = async (status: string) => {
        if (isLoading) return;

        const prevStatus = userStatus;
        const prevCount = rsvpCount;

        // Optimistic UI
        const isRemoving = userStatus === status;
        const newStatus = isRemoving ? null : status;

        setUserStatus(newStatus);
        if (!isRemoving && !prevStatus) setRsvpCount(prev => prev + 1);
        if (isRemoving) setRsvpCount(prev => prev - 1);

        setIsLoading(true);
        try {
            const res = await api.post(`/events/${event.id}/rsvp//`, { status });
            setUserStatus(res.data.user_rsvp_status);
            setRsvpCount(res.data.rsvp_count);
        } catch (err) {
            setUserStatus(prevStatus);
            setRsvpCount(prevCount);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const typeConfig: Record<string, { color: string, icon: string }> = {
        party: { color: "from-pink-500 to-rose-500", icon: "🎉" },
        workshop: { color: "from-blue-500 to-indigo-500", icon: "📚" },
        sports: { color: "from-green-500 to-emerald-500", icon: "⚽" },
        meetup: { color: "from-amber-500 to-orange-500", icon: "🤝" },
    };

    const config = typeConfig[event.event_type] || typeConfig.meetup;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <GlassCard className="p-0 overflow-hidden border-white/5 hover:border-white/10 transition-all group">
                <div className={`h-2 bg-gradient-to-r ${config.color}`} />
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-2xl">{config.icon}</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-widest text-campus-secondary">
                            <Users className="w-3 h-3" />
                            {rsvpCount} Souls attending
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-campus-accent transition-colors">
                        {event.title}
                    </h3>

                    <p className="text-sm text-campus-secondary/80 line-clamp-2 mb-6 font-medium">
                        {event.description}
                    </p>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-xs text-campus-secondary/60">
                            <Calendar className="w-4 h-4 text-campus-accent" />
                            <span className="font-bold uppercase tracking-wider">{formatDate(event.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-campus-secondary/60">
                            <MapPin className="w-4 h-4 text-campus-accent" />
                            <span className="font-bold">{event.location}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleRSVP('going')}
                            disabled={isLoading}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${userStatus === 'going'
                                ? 'bg-campus-accent text-campus-dark'
                                : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                        >
                            {userStatus === 'going' && <CheckCircle2 className="w-4 h-4" />}
                            {userStatus === 'going' ? 'Going' : 'Considering ruining my sleep'}
                        </button>
                        {/* Add Maybe button or other options if needed */}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
