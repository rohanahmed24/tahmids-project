"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-base transition-colors duration-300">
            {/* Header */}
            <div className="bg-surface pt-40 pb-20 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-main mb-6 block">Legal</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-main tracking-tighter leading-[0.9]">
                        Privacy Policy
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
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Introduction</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            At WISDOMIA, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Information We Collect</h2>
                        <h3 className="text-xl font-serif font-medium text-main mb-3">Personal Data</h3>
                        <p className="text-secondary leading-relaxed mb-4">
                            We may collect personally identifiable information that you voluntarily provide, including:
                        </p>
                        <ul className="list-disc pl-6 text-secondary space-y-2 mb-6">
                            <li>Name and email address when subscribing to our newsletter</li>
                            <li>Contact information when using our contact form</li>
                            <li>Account information if you create an account</li>
                            <li>Payment information for premium subscriptions</li>
                        </ul>

                        <h3 className="text-xl font-serif font-medium text-main mb-3">Automatically Collected Data</h3>
                        <p className="text-secondary leading-relaxed mb-4">
                            When you visit our website, we may automatically collect certain information, including:
                        </p>
                        <ul className="list-disc pl-6 text-secondary space-y-2">
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring website addresses</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">How We Use Your Information</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 text-secondary space-y-2">
                            <li>Provide, operate, and maintain our website</li>
                            <li>Send you newsletters and marketing communications (with your consent)</li>
                            <li>Respond to your comments, questions, and requests</li>
                            <li>Analyze usage patterns to improve our content and user experience</li>
                            <li>Detect, prevent, and address technical issues</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Cookies and Tracking</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to track activity on our website. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                        <p className="text-secondary leading-relaxed">
                            We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted) to provide you with a more personal and interactive experience.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Third-Party Services</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            We may employ third-party companies and individuals to facilitate our service, provide service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Data Security</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            The security of your data is important to us. We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Your Rights</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal data, including:
                        </p>
                        <ul className="list-disc pl-6 text-secondary space-y-2">
                            <li>The right to access your personal data</li>
                            <li>The right to request correction of inaccurate data</li>
                            <li>The right to request deletion of your data</li>
                            <li>The right to opt-out of marketing communications</li>
                            <li>The right to data portability</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Children's Privacy</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            Our service is not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-main mb-4">Changes to This Policy</h2>
                        <p className="text-secondary leading-relaxed mb-4">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this page.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-border">
                        <p className="text-muted text-sm">
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@wisdomia.com" className="text-accent hover:underline">privacy@wisdomia.com</a>.
                        </p>
                    </section>
                </MotionWrapper>
            </div>
        </main>
    );
}
