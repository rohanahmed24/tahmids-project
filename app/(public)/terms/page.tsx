"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { useLocale } from "@/components/providers/LocaleProvider";

type TermsSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export default function TermsPage() {
  const { locale } = useLocale();

  const content = locale === "bn"
    ? {
      badge: "আইনি",
      title: "শর্তাবলি",
      updated: "সর্বশেষ হালনাগাদ: ২০ ডিসেম্বর, ২০২৪",
      sections: [
        {
          title: "১. শর্ত গ্রহণ",
          paragraphs: [
            "WISDOMIA ব্যবহার করলে আপনি এই শর্তাবলির সাথে সম্মত হন। যদি সম্মত না হন, অনুগ্রহ করে সেবা ব্যবহার করবেন না।",
          ],
        },
        {
          title: "২. ব্যবহার লাইসেন্স",
          paragraphs: [
            "ব্যক্তিগত, অ-ব্যবসায়িক উদ্দেশ্যে সীমিত লাইসেন্সে WISDOMIA-র উপকরণ দেখার অনুমতি দেওয়া হয়।",
          ],
          bullets: [
            "উপকরণ পরিবর্তন বা কপি করা যাবে না",
            "ব্যবসায়িক বা পাবলিক প্রদর্শনে ব্যবহার করা যাবে না",
            "ওয়েবসাইটের সফটওয়্যার রিভার্স ইঞ্জিনিয়ার করা যাবে না",
            "কপিরাইট বা মালিকানার নোটিশ সরানো যাবে না",
            "অন্য সার্ভারে উপকরণ মিরর করা যাবে না",
          ],
        },
        {
          title: "৩. কনটেন্ট মালিকানা",
          paragraphs: [
            "WISDOMIA-তে প্রকাশিত সকল লেখা, ছবি, গ্রাফিক্স ও মাল্টিমিডিয়া কনটেন্টের মালিকানা WISDOMIA বা সংশ্লিষ্ট নির্মাতার। অনুমতি ছাড়া ব্যবহার নিষিদ্ধ।",
          ],
        },
        {
          title: "৪. ব্যবহারকারীর অবদান",
          paragraphs: [
            "আপনি মন্তব্য, প্রতিক্রিয়া বা অন্য কনটেন্ট জমা দিলে, তা ব্যবহার/প্রকাশ/বিতরণের জন্য আপনি আমাদের নন-এক্সক্লুসিভ লাইসেন্স প্রদান করেন।",
          ],
        },
        {
          title: "৫. দায় অস্বীকার",
          paragraphs: [
            "WISDOMIA-র উপকরণ 'যেমন আছে' ভিত্তিতে প্রদান করা হয়। প্রযোজ্য আইনের সীমার মধ্যে সকল ধরনের প্রত্যক্ষ/পরোক্ষ ওয়ারেন্টি অস্বীকার করা হয়।",
          ],
        },
        {
          title: "৬. দায়-সীমাবদ্ধতা",
          paragraphs: [
            "WISDOMIA বা তার সরবরাহকারী কোনো প্রকার ক্ষতির জন্য দায়ী থাকবে না, যার মধ্যে ডেটা/লাভের ক্ষতি বা ব্যবসায়িক বিঘ্ন অন্তর্ভুক্ত।",
          ],
        },
        {
          title: "৭. সংশোধন",
          paragraphs: [
            "WISDOMIA যেকোনো সময় নোটিশ ছাড়া এই শর্তাবলি পরিবর্তন করতে পারে। ওয়েবসাইট ব্যবহার অব্যাহত রাখলে আপনি সংশোধিত শর্তে সম্মত বলে গণ্য হবেন।",
          ],
        },
        {
          title: "৮. প্রযোজ্য আইন",
          paragraphs: [
            "এই শর্তাবলি প্রযোজ্য আইন অনুযায়ী পরিচালিত ও ব্যাখ্যায়িত হবে এবং সংশ্লিষ্ট আদালতের একচেটিয়া এখতিয়ারে আপনি সম্মত থাকবেন।",
          ],
        },
      ] satisfies TermsSection[],
      footer: "এই শর্তাবলি সম্পর্কে কোনো প্রশ্ন থাকলে",
    }
    : {
      badge: "Legal",
      title: "Terms & Conditions",
      updated: "Last updated: December 20, 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing and using WISDOMIA, you accept and agree to be bound by these terms. If you do not agree, please do not use this service.",
          ],
        },
        {
          title: "2. Use License",
          paragraphs: [
            "Permission is granted to temporarily view materials on WISDOMIA for personal, non-commercial use only.",
          ],
          bullets: [
            "Do not modify or copy the materials",
            "Do not use the materials for commercial or public display",
            "Do not reverse engineer software on the Website",
            "Do not remove copyright/proprietary notices",
            "Do not mirror materials on other servers",
          ],
        },
        {
          title: "3. Content Ownership",
          paragraphs: [
            "All content on WISDOMIA is the property of WISDOMIA or its creators. Unauthorized use or distribution is prohibited.",
          ],
        },
        {
          title: "4. User Contributions",
          paragraphs: [
            "If you submit content to WISDOMIA, you grant us a non-exclusive license to use, modify, publish, and distribute that content.",
          ],
        },
        {
          title: "5. Disclaimer",
          paragraphs: [
            "Materials on WISDOMIA are provided 'as is'. We disclaim all warranties to the extent permitted by law.",
          ],
        },
        {
          title: "6. Limitations",
          paragraphs: [
            "WISDOMIA shall not be liable for any damages, including loss of data, profits, or business interruption.",
          ],
        },
        {
          title: "7. Revisions",
          paragraphs: [
            "WISDOMIA may revise these terms at any time without notice. Continued use means you accept the updated terms.",
          ],
        },
        {
          title: "8. Governing Law",
          paragraphs: [
            "These terms are governed by applicable laws, and disputes are subject to the exclusive jurisdiction of the relevant courts.",
          ],
        },
      ] satisfies TermsSection[],
      footer: "If you have any questions about these Terms & Conditions, please contact us at",
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
              {section.paragraphs.map((p) => (
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
              {content.footer} <a href="mailto:legal@wisdomia.com" className="text-accent hover:underline">legal@wisdomia.com</a>.
            </p>
          </section>
        </MotionWrapper>
      </div>
    </main>
  );
}
