"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { useLocale } from "@/components/providers/LocaleProvider";

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subheading?: string;
  subParagraphs?: string[];
  subBullets?: string[];
};

export default function PrivacyPage() {
  const { locale } = useLocale();

  const content = locale === "bn"
    ? {
      badge: "আইনি",
      title: "গোপনীয়তা নীতি",
      updated: "সর্বশেষ হালনাগাদ: ২০ ডিসেম্বর, ২০২৪",
      sections: [
        {
          title: "ভূমিকা",
          paragraphs: [
            "WISDOMIA-তে আমরা আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতিতে আমরা কীভাবে তথ্য সংগ্রহ, ব্যবহার, প্রকাশ ও সুরক্ষা করি তা ব্যাখ্যা করেছি।",
          ],
        },
        {
          title: "আমরা কী তথ্য সংগ্রহ করি",
          subheading: "ব্যক্তিগত তথ্য",
          subParagraphs: ["আপনি স্বেচ্ছায় যে তথ্য দেন, তার মধ্যে থাকতে পারে:"],
          subBullets: [
            "নিউজলেটার সাবস্ক্রাইব করার সময় নাম ও ইমেইল",
            "যোগাযোগ ফর্ম ব্যবহারের সময় যোগাযোগের তথ্য",
            "অ্যাকাউন্ট তৈরি করলে অ্যাকাউন্ট তথ্য",
            "প্রিমিয়াম সাবস্ক্রিপশনের পেমেন্ট তথ্য",
          ],
          paragraphs: ["স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য"],
          bullets: [
            "আইপি ঠিকানা ও ব্রাউজারের ধরন",
            "ডিভাইস তথ্য ও অপারেটিং সিস্টেম",
            "কোন পেজে গেছেন এবং কত সময় কাটিয়েছেন",
            "রেফারিং ওয়েবসাইটের ঠিকানা",
          ],
        },
        {
          title: "আপনার তথ্য আমরা কীভাবে ব্যবহার করি",
          paragraphs: ["সংগৃহীত তথ্য আমরা ব্যবহার করি:"],
          bullets: [
            "ওয়েবসাইট চালু, পরিচালনা ও রক্ষণাবেক্ষণে",
            "আপনার সম্মতিতে নিউজলেটার/মার্কেটিং পাঠাতে",
            "আপনার প্রশ্ন, মন্তব্য ও অনুরোধের উত্তর দিতে",
            "কনটেন্ট ও ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে",
            "প্রযুক্তিগত সমস্যা শনাক্ত ও সমাধান করতে",
          ],
        },
        {
          title: "কুকি ও ট্র্যাকিং",
          paragraphs: [
            "আমরা কুকি ও অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করি। কুকি হলো ছোট ডেটা ফাইল, যাতে একটি অনন্য আইডি থাকতে পারে।",
            "আমরা সেশন কুকি ও পারসিস্টেন্ট কুকি উভয়ই ব্যবহার করি, যাতে আপনাকে আরও ব্যক্তিগত অভিজ্ঞতা দিতে পারি।",
          ],
        },
        {
          title: "তৃতীয় পক্ষের সেবা",
          paragraphs: [
            "আমাদের সেবা পরিচালনা বা বিশ্লেষণে সহায়তার জন্য আমরা তৃতীয় পক্ষ ব্যবহার করতে পারি। তারা শুধুমাত্র নির্দিষ্ট কাজের জন্য আপনার ডেটা পায় এবং অন্য কাজে ব্যবহার করতে পারে না।",
          ],
        },
        {
          title: "ডেটা সুরক্ষা",
          paragraphs: [
            "আমরা আপনার তথ্য সুরক্ষায় যথাযথ প্রযুক্তিগত ও সাংগঠনিক ব্যবস্থা গ্রহণ করি। তবে ইন্টারনেটে কোনো পদ্ধতিই শতভাগ নিরাপদ নয়।",
          ],
        },
        {
          title: "আপনার অধিকার",
          paragraphs: ["আপনার অবস্থানভেদে আপনার যেসব অধিকার থাকতে পারে:"],
          bullets: [
            "ব্যক্তিগত ডেটা অ্যাক্সেসের অধিকার",
            "ভুল তথ্য সংশোধনের অনুরোধের অধিকার",
            "ডেটা মুছে ফেলার অনুরোধের অধিকার",
            "মার্কেটিং বার্তা থেকে অপ্ট-আউটের অধিকার",
            "ডেটা পোর্টেবিলিটির অধিকার",
          ],
        },
        {
          title: "শিশুদের গোপনীয়তা",
          paragraphs: [
            "১৩ বছরের কম বয়সী কারও জন্য আমাদের সেবা নয়। আমরা জেনে-শুনে ১৩ বছরের নিচের শিশুদের তথ্য সংগ্রহ করি না।",
          ],
        },
        {
          title: "এই নীতির পরিবর্তন",
          paragraphs: [
            "আমরা সময়ে সময়ে এই নীতি আপডেট করতে পারি। আপডেট হলে এই পেজে নতুন সংস্করণ প্রকাশ করা হবে।",
          ],
        },
      ] satisfies Section[],
      footer: "এই নীতি সম্পর্কে প্রশ্ন থাকলে privacy@wisdomia.com এ যোগাযোগ করুন।",
    }
    : {
      badge: "Legal",
      title: "Privacy Policy",
      updated: "Last updated: December 20, 2024",
      sections: [
        {
          title: "Introduction",
          paragraphs: [
            "At WISDOMIA, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
          ],
        },
        {
          title: "Information We Collect",
          subheading: "Personal Data",
          subParagraphs: ["We may collect personally identifiable information that you voluntarily provide, including:"],
          subBullets: [
            "Name and email address when subscribing to our newsletter",
            "Contact information when using our contact form",
            "Account information if you create an account",
            "Payment information for premium subscriptions",
          ],
          paragraphs: ["Automatically Collected Data"],
          bullets: [
            "IP address and browser type",
            "Device information and operating system",
            "Pages visited and time spent on pages",
            "Referring website addresses",
          ],
        },
        {
          title: "How We Use Your Information",
          paragraphs: ["We use the information we collect to:"],
          bullets: [
            "Provide, operate, and maintain our website",
            "Send you newsletters and marketing communications (with your consent)",
            "Respond to your comments, questions, and requests",
            "Analyze usage patterns to improve our content and user experience",
            "Detect, prevent, and address technical issues",
          ],
        },
        {
          title: "Cookies and Tracking",
          paragraphs: [
            "We use cookies and similar tracking technologies to track activity on our website. Cookies are files with a small amount of data that may include an anonymous unique identifier.",
            "We use both session cookies and persistent cookies to provide a more personal and interactive experience.",
          ],
        },
        {
          title: "Third-Party Services",
          paragraphs: [
            "We may employ third-party companies and individuals to facilitate our service or assist us in analyzing how our service is used. They only access your data to perform specific tasks.",
          ],
        },
        {
          title: "Data Security",
          paragraphs: [
            "The security of your data is important to us. We implement appropriate technical and organizational measures, but no method is 100% secure.",
          ],
        },
        {
          title: "Your Rights",
          paragraphs: ["Depending on your location, you may have rights regarding your personal data, including:"],
          bullets: [
            "The right to access your personal data",
            "The right to request correction of inaccurate data",
            "The right to request deletion of your data",
            "The right to opt-out of marketing communications",
            "The right to data portability",
          ],
        },
        {
          title: "Children's Privacy",
          paragraphs: [
            "Our service is not directed to anyone under the age of 13. We do not knowingly collect personal information from children under 13.",
          ],
        },
        {
          title: "Changes to This Policy",
          paragraphs: [
            "We may update our Privacy Policy from time to time. We will post the updated policy on this page.",
          ],
        },
      ] satisfies Section[],
      footer: "If you have any questions about this Privacy Policy, please contact us at privacy@wisdomia.com.",
    };

  return (
    <main className="min-h-screen bg-base transition-colors duration-300">
      <div className="bg-surface pt-28 pb-20 px-6 text-center">
        <MotionWrapper type="slide-up">
          <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-main mb-6 block">{content.badge}</span>
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-main tracking-tighter leading-[0.9]">
            {content.title}
          </h1>
          <p className="text-muted mt-6 max-w-xl mx-auto">{content.updated}</p>
        </MotionWrapper>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <MotionWrapper type="fade-in" className="prose prose-lg dark:prose-invert max-w-none">
          {content.sections.map((section) => (
            <section key={section.title} className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-main mb-4">{section.title}</h2>

              {section.subheading && (
                <h3 className="text-xl font-serif font-medium text-main mb-3">{section.subheading}</h3>
              )}

              {section.subParagraphs?.map((p) => (
                <p key={p} className="text-secondary leading-relaxed mb-4">{p}</p>
              ))}

              {section.subBullets && (
                <ul className="list-disc pl-6 text-secondary space-y-2 mb-6">
                  {section.subBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.paragraphs?.map((p) => (
                <p key={p} className="text-secondary leading-relaxed mb-4">{p}</p>
              ))}

              {section.bullets && (
                <ul className="list-disc pl-6 text-secondary space-y-2">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="pt-8 border-t border-border">
            <p className="text-muted text-sm">
              {content.footer} <a href="mailto:privacy@wisdomia.com" className="text-accent hover:underline">privacy@wisdomia.com</a>.
            </p>
          </section>
        </MotionWrapper>
      </div>
    </main>
  );
}
