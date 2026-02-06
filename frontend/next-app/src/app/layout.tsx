import type { Metadata } from "next";
import { Inter, Comfortaa } from "next/font/google";
import "./globals.css";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE WALL | Night Campus",
  description: "The late-night social lore for RGUKT RK Valley students.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${comfortaa.variable} font-inter antialiased bg-campus-dark text-white selection:bg-campus-accent/30`}
      >
        <Providers>
          <div className="relative z-0 min-h-screen">
            <LogoutButton />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
