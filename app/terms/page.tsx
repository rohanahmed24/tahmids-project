"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-base transition-colors duration-300">
            {/* Header */}
            <div className="bg-surface pt-40 pb-20 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-main mb-6 block">Legal</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-main tracking-tighter leading-[0.9]">
                        Terms & Conditions
                    </h1>
                    <p className="text-muted mt-6 max-w-xl mx-auto">
                        Last updated: December 20, 2024
                    </p>
                </MotionWrapper>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-20">
                <MotionWrapper type="fade-in" className="prose prose-lg dark:prose-invert max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">1. Acceptance of Terms</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            By accessing and using WISDOMIA ("the Website"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">2. Use License</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            Permission is granted to temporarily view the materials (information or software) on WISDOMIA for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 text-secondary space-y-2">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or public display</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the Website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">3. Content Ownership</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            All content published on WISDOMIA, including but not limited to articles, images, graphics, and multimedia content, is the property of WISDOMIA or its content creators. Unauthorized use, reproduction, or distribution of this content is strictly prohibited.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">4. User Contributions</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            If you submit content to WISDOMIA, including comments, feedback, or other submissions, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, publish, and distribute such content.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">5. Disclaimer</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            The materials on WISDOMIA are provided on an "as is" basis. WISDOMIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">6. Limitations</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            In no event shall WISDOMIA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Website.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">7. Revisions</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            WISDOMIA may revise these terms of service at any time without notice. By using this Website, you are agreeing to be bound by the then-current version of these terms of service.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">8. Governing Law</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-border">
                        <p className="text-muted text-sm">
                            If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:legal@wisdomia.com" className="text-accent hover:underline">legal@wisdomia.com</a>.
                        </p>
                    </section>
                </MotionWrapper>
            </div>
        </main>
    );
}
