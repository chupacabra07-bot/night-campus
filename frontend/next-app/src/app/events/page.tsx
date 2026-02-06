"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Search, Filter, Sparkles, Plus, Clock, MapPin } from "lucide-react";
import api from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { Calendar } from "@/components/events/Calendar";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { GlassCard } from "@/components/ui/GlassCard";

interface Event {
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
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [dailyEvents, setDailyEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/events/");
            setEvents(res.data);

            // Initial filter for today
            const today = new Date();
            const filtered = res.data.filter((e: Event) => {
                const date = new Date(e.start_time);
                return date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
            });
            setDailyEvents(filtered);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        }

        fetchEvents();

        // WebSocket for live event updates
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${wsProtocol}//localhost:8000/ws/wall/`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'event_created') {
                setEvents(prev => [...prev, data.event]);
            } else if (data.type === 'event_rsvp_updated') {
                setEvents(prev => prev.map(e =>
                    e.id === data.event.id ? { ...e, rsvp_count: data.event.rsvp_count } : e
                ));
            }
        };

        return () => ws.close();
    }, []);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        const filtered = events.filter(e => {
            const eventDate = new Date(e.start_time);
            return eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear();
        });
        setDailyEvents(filtered);
    };

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark pb-32 relative overflow-x-hidden">
                {/* Events Header */}
                <div className="sticky top-0 z-50 bg-campus-dark/40 backdrop-blur-2xl border-b border-white/5 pt-12 pb-6 px-6">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white flex items-center gap-2 italic">
                                <CalendarIcon className="text-campus-accent w-6 h-6" />
                                Campus Vibes
                            </h1>
                            <p className="text-[10px] text-campus-secondary/60 font-black uppercase tracking-widest mt-1">
                                {events.length === 0
                                    ? "Nothing brewing… yet. Start something 👀"
                                    : `${events.length} Upcoming Happenings`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all relative group">
                                <Search className="w-5 h-5 text-campus-secondary group-hover:text-campus-accent transition-colors" />
                                <div className="absolute inset-0 rounded-2xl bg-campus-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-6 space-y-12">
                    {/* Centered Calendar Card */}
                    <div className="max-w-xl mx-auto space-y-4">
                        <div className="text-center">
                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest italic">
                                Pick a date. See where your attendance is about to drop.
                            </p>
                        </div>
                        <Calendar events={events} onDateSelect={handleDateSelect} />
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-1 px-2">
                            <h2 className="text-xl font-black text-white italic">
                                {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
                            </h2>
                            <p className="text-[10px] text-campus-secondary/60 font-black uppercase tracking-widest">
                                Events for this day
                            </p>
                        </div>

                        {/* Daily Event Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    [1, 2].map(i => (
                                        <div key={i} className="w-full h-64 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
                                    ))
                                ) : (
                                    dailyEvents.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {!loading && dailyEvents.length === 0 && (
                            <GlassCard className="text-center py-20 border-white/5 bg-white/2">
                                <div className="text-5xl grayscale opacity-20 mb-4">💨</div>
                                <h3 className="text-lg font-black text-campus-secondary/60 italic mb-2">
                                    Nothing planned. This is your villain origin moment.
                                </h3>
                                <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest mb-8">
                                    Free day detected. Dangerous.
                                </p>
                                <button
                                    onClick={() => setIsCreateOpen(true)}
                                    className="px-8 py-4 bg-campus-accent text-campus-dark rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(198,183,255,0.4)] hover:scale-105 transition-all"
                                >
                                    Create Event
                                </button>
                            </GlassCard>
                        )}
                    </div>
                </div>

                {/* Floating Create Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateOpen(true)}
                    className="fixed bottom-24 right-6 z-[60] w-16 h-16 bg-campus-accent text-campus-dark rounded-full shadow-[0_0_30px_rgba(198,183,255,0.4)] flex items-center justify-center transition-all group"
                >
                    <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" />
                    <div className="absolute right-full mr-4 px-3 py-1.5 bg-campus-dark/90 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase tracking-widest text-campus-accent">Create chaos</span>
                    </div>
                </motion.button>

                <CreateEventModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onCreated={fetchEvents}
                    userScore={user?.profile?.lore_score || 0}
                />

                {/* Background Aesthetic */}
                <div className="fixed top-1/4 right-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
                <div className="fixed bottom-1/4 left-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            </main>
        </AppWrapper>
    );
}
