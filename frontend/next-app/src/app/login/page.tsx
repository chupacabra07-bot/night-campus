"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/home');
        }
    }, [router]);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setError("");
        setIsLoading(true);

        try {
            const res = await api.post("/auth/google/", {
                access_token: credentialResponse.credential,
            });

            localStorage.setItem("token", res.data.access_token || res.data.access);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (res.data.user && !res.data.user.profile?.nickname) {
                router.push("/onboarding");
            } else {
                router.push("/home");
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.response?.data?.error || "Google Sign-In failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google Sign-In was unsuccessful. Please try again.");
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center p-6 bg-campus-dark overflow-hidden">
            {/* Ambient background glow - single accent color only */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] blur-[220px] rounded-full -z-10" style={{ background: 'rgba(124, 124, 255, 0.04)' }} />
            <div className="absolute top-1/4 right-1/3 w-[800px] h-[800px] blur-[200px] rounded-full -z-10" style={{ background: 'rgba(124, 124, 255, 0.02)' }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-full max-w-md"
            >
                <div className="glass-card-breathe p-8 md:p-10 rounded-[2.5rem]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 24px rgba(124, 124, 255, 0.3), 0 0 8px rgba(124, 124, 255, 0.15)' }}>Welcome Back</h1>
                        <p className="text-sm text-campus-secondary/60 font-medium">Continue your night campus lore.</p>
                    </div>

                    <div className="space-y-6 flex flex-col items-center">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex items-center gap-3 p-4 bg-rose-500/8 border border-rose-500/15 rounded-2xl text-xs text-rose-400 font-bold w-full backdrop-blur-sm"
                                style={{
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 24px rgba(239, 68, 68, 0.06)'
                                }}
                            >
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            className="w-full flex justify-center py-4 bg-white/5 rounded-2xl border border-white/8 backdrop-blur-sm antigravity-lift"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.4 }}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-campus-accent/30 border-t-campus-accent rounded-full animate-spin" />
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap
                                    theme="filled_black"
                                    shape="pill"
                                    text="continue_with"
                                />
                            )}
                        </motion.div>

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-campus-secondary/40 py-2">
                            Use your college @rguktrkv.ac.in account
                        </div>
                    </div>

                    <p className="text-center mt-10 text-sm text-campus-secondary/40 font-bold uppercase tracking-widest">
                        By signing in, you agree to our <Link href="/terms" target="_blank" rel="noopener noreferrer" className="transition-all duration-300 underline" style={{ color: '#FFD700', textShadow: '0 0 12px rgba(255, 215, 0, 0.2)' }}>Terms</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
