"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        // If client ID is missing, we still want the app to render, 
        // but without OAuth functionality. This avoids a hard crash.
        console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing!");
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
