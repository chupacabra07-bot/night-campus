"use client";

import { useEffect, useState } from "react";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { Heart, Sparkles, Clock, RefreshCcw } from "lucide-react";
import { MatchCard } from "@/components/matches/MatchCard";
import { MutualVibeModal } from "@/components/matches/MutualVibeModal";
import { VibeButton } from "@/components/ui/VibeButton";
import { Avatar } from "@/components/ui/Avatar";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
    const [pool, setPool] = useState<any>(null);
    const [activeMatches, setActiveMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cooldown, setCooldown] = useState<any>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isMutualModalOpen, setIsMutualModalOpen] = useState(false);
    const [lastMatchId, setLastMatchId] = useState<string | null>(null);
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [poolRes, matchesRes] = await Promise.all([
                api.get('/matching/current_pool/'),
                api.get('/mutual/')
            ]);

            if (poolRes.data.status === 'cooldown') {
                setCooldown(poolRes.data);
                setPool(null);
            } else {
                setPool(poolRes.data);
                setCooldown(null);
                if (poolRes.data.requested_ids) {
                    setSelectedIds(poolRes.data.requested_ids);
                }
            }
            setActiveMatches(matchesRes.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectProfile = async (targetId: string) => {
        if (selectedIds.includes(targetId)) return;

        try {
            const res = await api.post('/matching/request/', {
                target_user_id: targetId,
                pool_id: pool.id
            });

            if (res.data.status === 'mutual_match') {
                setLastMatchId(res.data.match_id);
                setIsMutualModalOpen(true);
                fetchData(); // Refresh matches list
            }

            setSelectedIds(prev => [...prev, targetId]);
        } catch (err) {
            console.error("Match request failed:", err);
        }
    };

    return (
        <AppWrapper>
            <main className="min-h-screen bg-campus-dark p-6 pb-32">
                <div className="max-w-7xl mx-auto pt-12">

                    {/* Active Matches Section */}
                    {activeMatches.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-[10px] font-black text-campus-accent uppercase tracking-[0.3em] mb-4">Active Vibes</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {activeMatches.map((match) => (
                                    <button
                                        key={match.id}
                                        onClick={() => router.push(`/matches/${match.id}`)}
                                        className="relative flex-shrink-0 group"
                                    >
                                        <div className={`p-1 rounded-full border-2 ${match.status === 'active' ? 'border-campus-accent shadow-[0_0_15px_rgba(198,183,255,0.3)]' : 'border-white/10'} group-hover:scale-110 transition-transform duration-500`}>
                                            <Avatar config={match.other_user.profile.avatar_config} size="md" />
                                        </div>
                                        {match.status === 'active' && (
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-campus-accent rounded-full border-2 border-campus-dark animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-5xl font-black text-white italic">People You Might Tolerate</h1>
                                <div className="px-3 py-1 bg-campus-accent/10 border border-campus-accent/20 rounded-full flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-campus-accent" />
                                    <span className="text-[10px] font-black text-campus-accent uppercase tracking-widest">Live Matching</span>
                                </div>
                            </div>
                            <p className="text-campus-secondary/60 uppercase tracking-[0.2em] text-[10px] font-bold">
                                {cooldown
                                    ? "You're booked for now"
                                    : selectedIds.length >= 5
                                        ? "Waiting for mutual vibe..."
                                        : `Choose up to 5 people you'd meet. ${selectedIds.length} / 5 selected.`
                                }
                            </p>
                        </div>

                        {pool && !loading && (
                            <button
                                onClick={fetchData}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-campus-secondary/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
                            >
                                <RefreshCcw className="w-3 h-3" />
                                Refresh Circle
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-campus-accent/20 border-t-campus-accent rounded-full animate-spin" />
                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest animate-pulse">Your vibe circle is forming...</p>
                        </div>
                    ) : cooldown ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-24 h-24 bg-campus-highlight/10 rounded-[2.5rem] flex items-center justify-center rotate-12">
                                <Clock className="w-10 h-10 text-campus-highlight" />
                            </div>
                            <h2 className="text-3xl font-black text-white italic">You&apos;ve got plans.</h2>
                            <p className="text-sm text-campus-secondary/60 max-w-sm uppercase font-bold tracking-widest leading-relaxed">
                                {cooldown.message} Check back soon to unlock new circles.
                            </p>
                            <VibeButton
                                onClick={() => router.push('/home')}
                                variant="secondary"
                                className="px-8 py-4 text-[10px] uppercase font-black"
                            >
                                Back to Hub
                            </VibeButton>
                        </div>
                    ) : pool && pool.members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pool.members.map((member: any) => (
                                <MatchCard
                                    key={member.id}
                                    profile={{ ...member.profile, id: member.id }}
                                    onSelect={handleSelectProfile}
                                    isSelected={selectedIds.includes(member.id)}
                                    isDisabled={selectedIds.length >= 5}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                            <Heart className="w-12 h-12 text-white/10" />
                            <p className="text-[10px] text-campus-secondary/40 font-black uppercase tracking-widest">
                                Good things take mutual effort. No one in your orbit just yet.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <MutualVibeModal
                isOpen={isMutualModalOpen}
                onClose={() => setIsMutualModalOpen(false)}
                onViewPlan={() => router.push(`/matches/${lastMatchId}`)}
            />

            {/* Aesthetic Backgrounds */}
            <div className="fixed top-1/4 left-[-10%] w-[500px] h-[500px] bg-campus-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-campus-highlight/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </AppWrapper>
    );
}
