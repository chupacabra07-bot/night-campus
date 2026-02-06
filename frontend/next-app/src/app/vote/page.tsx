"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import api from "@/lib/api";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { VotingFeed } from "@/components/home/VotingFeed";

export default function VotePage() {
    const [pendingEvents, setPendingEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/events/pending_approval/");
            setPendingEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingEvents();

        // WebSocket Setup for real-time democracy
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${wsProtocol}//localhost:8000/ws/wall/`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'event_proposed') {
                setPendingEvents(prev => [data.event, ...prev]);
            } else if (data.type === 'event_vote_updated') {
                if (data.event.status === 'approved' || data.event.status === 'rejected') {
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
            }
        };

        return () => ws.close();
    }, []);

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark pb-32">
                {/* Header Section */}
                <div className="sticky top-0 z-50 bg-campus-dark/40 backdrop-blur-2xl border-b border-white/5 pt-12 pb-6 px-6">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white flex items-center gap-2 italic">
                                <Zap className="text-campus-accent w-6 h-6" />
                                Democracy
                            </h1>
                            <p className="text-[10px] text-campus-secondary/60 font-black uppercase tracking-widest mt-1">
                                {pendingEvents.length === 0
                                    ? "Perfect silence. No chaos proposed."
                                    : `${pendingEvents.length} Events Awaiting Judgment`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto p-6">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2].map(i => (
                                <div key={i} className="w-full h-64 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : pendingEvents.length === 0 ? (
                        <div className="text-center py-32 space-y-4">
                            <div className="text-6xl grayscale opacity-20">⚖️</div>
                            <h3 className="text-xl font-bold text-campus-secondary italic">Nothing to judge...</h3>
                            <p className="text-sm text-campus-secondary/40 uppercase tracking-widest font-black text-[10px]">Campus is suspiciously peaceful.</p>
                        </div>
                    ) : (
                        <VotingFeed events={pendingEvents} onUpdate={fetchPendingEvents} />
                    )}
                </div>

                {/* Background Aesthetic */}
                <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
                <div className="fixed bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            </main>
        </AppWrapper>
    );
}
