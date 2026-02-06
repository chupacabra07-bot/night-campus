"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { MapPin, Clock, ShieldCheck, ArrowLeft, MoreHorizontal, AlertCircle } from "lucide-react";
import { VibeButton } from "@/components/ui/VibeButton";
import { MatchChat } from "@/components/matches/MatchChat";
import { Avatar } from "@/components/ui/Avatar";
import api from "@/lib/api";

export default function MatchDetailsPage() {
    const { id } = useParams();
    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchMatch = async () => {
        try {
            const res = await api.get(`/mutual/${id}/`);
            setMatch(res.data);
        } catch (err) {
            console.error(err);
            router.push('/matches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatch();
        const interval = setInterval(fetchMatch, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const handleAgree = async () => {
        try {
            await api.post(`/mutual/${id}/agree/`);
            fetchMatch();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return null;

    const isMeAgreed = match.user1_agreed || match.user2_agreed; // Simplified check if the *current* user agreed is handled correctly by the backend logic, here we just need to know if the button should be shown
    const userRole = match.user1?.id === JSON.parse(localStorage.getItem('user') || '{}').id ? 'user1' : 'user2';
    const hasIAgreed = userRole === 'user1' ? match.user1_agreed : match.user2_agreed;

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark p-6 pb-32">
                <div className="max-w-4xl mx-auto pt-12">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/matches')}
                        className="flex items-center gap-2 text-campus-secondary/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-12 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Orbit
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Status & Plan Section */}
                        <div className="lg:col-span-12 space-y-8">
                            <div className="bg-white/2 border border-white/5 rounded-[3rem] p-12 relative overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                    {/* Profiles Visual */}
                                    <div className="flex -space-x-8 items-center">
                                        <div className="relative">
                                            <Avatar config={match.other_user.profile.avatar_config} size="xl" className="ring-8 ring-campus-dark border-4 border-white/5" />
                                            <div className="absolute -inset-2 bg-campus-accent/20 blur-xl rounded-full -z-10 animate-pulse" />
                                        </div>
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative z-20 backdrop-blur-md">
                                            <ShieldCheck className="w-8 h-8 text-campus-accent" />
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h1 className="text-4xl font-black text-white italic mb-4">Mutual Vibe Confirmed</h1>
                                        <p className="text-sm text-campus-secondary/60 font-bold uppercase tracking-widest leading-relaxed">
                                            You both agreed to meet. Now, verify the plan and unlock the portal.
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute top-0 right-0 w-64 h-64 bg-campus-accent/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                            </div>

                            {/* Meeting Plan Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-red-400/10 rounded-2xl text-red-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-black text-white italic">The Spot</h3>
                                    </div>
                                    <p className="text-xl font-black text-white mb-2">{match.meeting_location}</p>
                                    <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-[0.2em]">System-approved public zone</p>
                                </div>

                                <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-campus-highlight/10 rounded-2xl text-campus-highlight">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-black text-white italic">The Time</h3>
                                    </div>
                                    <p className="text-xl font-black text-white mb-2">
                                        {new Date(match.meeting_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Today
                                    </p>
                                    <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-[0.2em]">Window for the meetup</p>
                                </div>
                            </div>

                            {/* Agreement Step */}
                            {match.status === 'pending' && (
                                <div className="flex flex-col items-center gap-6 py-12">
                                    {!hasIAgreed ? (
                                        <>
                                            <VibeButton
                                                onClick={handleAgree}
                                                variant="primary"
                                                className="px-12 py-5 text-xs font-black group"
                                            >
                                                <span className="flex items-center gap-3">
                                                    I AGREE TO MEET HERE
                                                    <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                                </span>
                                            </VibeButton>
                                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest text-center animate-pulse">
                                                Neither of you can chat until both hit this button.
                                            </p>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-campus-accent/10 border border-campus-accent/20 rounded-full flex items-center justify-center">
                                                <Clock className="w-8 h-8 animate-pulse text-campus-accent" />
                                            </div>
                                            <h3 className="text-xl font-black text-white italic">Waiting for them...</h3>
                                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest">
                                                You&apos;ve confirmed. Once they do, the chat unlocks.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Chat Section */}
                        <div className="lg:col-span-12">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-black text-white italic">The Connection</h2>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${match.status === 'active' ? 'bg-campus-accent text-campus-dark' : 'bg-white/5 text-white/20'}`}>
                                        {match.status === 'active' ? 'Unlocked' : 'Encrypted'}
                                    </span>
                                </div>
                                <button className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all">
                                    <AlertCircle className="w-4 h-4" />
                                </button>
                            </div>

                            <MatchChat
                                matchId={match.id}
                                isLocked={match.status !== 'active'}
                                expiresAt={match.expires_at}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </AppWrapper>
    );
}
