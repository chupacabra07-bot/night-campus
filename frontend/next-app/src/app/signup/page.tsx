"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/login");
    }, [router]);

    return (
        <div className="min-h-screen bg-campus-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-campus-accent/30 border-t-campus-accent rounded-full animate-spin" />
        </div>
    );
}
