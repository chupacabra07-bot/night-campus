"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] font-serif">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-black/5 z-50"
            >
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-sans uppercase tracking-wider text-black/60 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <span className="text-xs font-sans text-black/40">Last updated: whenever we remembered</span>
                </div>
            </motion.header>

            {/* Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl mx-auto px-6 pt-32 pb-20"
            >
                <h1 className="text-6xl font-bold mb-4 leading-tight">Terms & Conditions</h1>
                <p className="text-lg text-black/50 mb-16 italic">The fine print you won't read anyway.</p>

                {/* Section 1 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">1. By using this website, you agree.</h2>
                    <p className="text-lg leading-relaxed mb-3">You didn't read this. We know.</p>
                    <p className="text-lg leading-relaxed mb-3">We didn't read half of it either. Still counts.</p>
                    <p className="text-lg leading-relaxed">If you continue using this site, that's legally interpreted as <span className="italic">"sure, why not."</span></p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 2 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">2. Eligibility (read carefully, or don't)</h2>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4">
                        <li>You must be a <strong>real human</strong>.</li>
                        <li>You must have a <strong>valid college email</strong>.</li>
                        <li>Bots, ghosts, exes, and "just browsing" people are not welcome.</li>
                    </ul>
                    <p className="text-lg leading-relaxed italic">If you somehow bypass this, congratulations. We're impressed and slightly concerned.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 3 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">3. Your account is your problem</h2>
                    <p className="text-lg leading-relaxed mb-3">If you:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>forget your password</li>
                        <li>share your login</li>
                        <li>let your friend "just check something"</li>
                    </ul>
                    <p className="text-lg leading-relaxed mb-3">That's on you.</p>
                    <p className="text-lg leading-relaxed">We are not your IT department. We are barely a website.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 4 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">4. What you can't do (the obvious stuff)</h2>
                    <p className="text-lg leading-relaxed mb-3">You agree <strong>not</strong> to:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>break the law</li>
                        <li>harass people</li>
                        <li>impersonate someone cooler than you</li>
                        <li>spam, scrape, exploit, or summon demons via our servers</li>
                    </ul>
                    <p className="text-lg leading-relaxed mb-3">If you try, we reserve the right to:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed ml-6">
                        <li>suspend your account</li>
                        <li>roast you internally</li>
                        <li>pretend you never existed</li>
                    </ul>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 5 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">5. Content responsibility</h2>
                    <p className="text-lg leading-relaxed mb-3">If you post something:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>It's your responsibility.</li>
                        <li>It's your consequences.</li>
                        <li>It's your screenshot circulating forever.</li>
                    </ul>
                    <p className="text-lg leading-relaxed">We host it. You own the chaos.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 6 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">6. Privacy (we're not creepy)</h2>
                    <p className="text-lg leading-relaxed mb-3">We collect:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>what we need</li>
                        <li>when we need it</li>
                        <li>for reasons that make sense</li>
                    </ul>
                    <p className="text-lg leading-relaxed mb-3">We do <strong>not</strong>:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>sell your data</li>
                        <li>read your mind</li>
                        <li>spy on your late-night thoughts</li>
                    </ul>
                    <p className="text-lg leading-relaxed italic">If that ever changes, we'll panic first, then update this page.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 7 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">7. Downtime happens</h2>
                    <p className="text-lg leading-relaxed mb-3">If the site goes down:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>it's not personal</li>
                        <li>the servers are tired</li>
                        <li>technology is fragile</li>
                    </ul>
                    <p className="text-lg leading-relaxed italic">Touch grass. We'll be back.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 8 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">8. We can change things</h2>
                    <p className="text-lg leading-relaxed mb-3">Features, rules, vibes, colors, entire existence.</p>
                    <p className="text-lg leading-relaxed mb-4">We can update these terms anytime.</p>
                    <p className="text-lg leading-relaxed">Your continued use means:</p>
                    <blockquote className="border-l-4 border-black/20 pl-6 my-4 italic text-lg">
                        "Yeah okay, guess this is my life now."
                    </blockquote>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 9 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">9. Termination (dramatic but necessary)</h2>
                    <p className="text-lg leading-relaxed mb-3">We can suspend or delete your account if you:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>repeatedly ignore rules</li>
                        <li>abuse the platform</li>
                        <li>act like the main character in a disaster movie</li>
                    </ul>
                    <p className="text-lg leading-relaxed">No appeal essay required. No debate club.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 10 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">10. Liability (lower your expectations)</h2>
                    <p className="text-lg leading-relaxed mb-3">We are not responsible for:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mb-4 ml-6">
                        <li>hurt feelings</li>
                        <li>bad decisions</li>
                        <li>awkward encounters</li>
                        <li>lore that goes too far</li>
                    </ul>
                    <p className="text-lg leading-relaxed italic">Use responsibly. Or don't. Just don't blame us.</p>
                </section>

                <hr className="border-black/10 my-12" />

                {/* Section 11 */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">11. Final truth</h2>
                    <p className="text-lg leading-relaxed mb-3">This platform exists for fun, connection, and controlled chaos.</p>
                    <p className="text-lg leading-relaxed">If you can't handle sarcasm, social interaction, or consequences…</p>
                    <p className="text-lg leading-relaxed italic mt-4">This might not be your ecosystem.</p>
                </section>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-black/10 text-center">
                    <p className="text-sm text-black/40 font-sans">
                        Built instead of doing assignments. Night Campus Team.
                    </p>
                </div>
            </motion.main>
        </div>
    );
}
