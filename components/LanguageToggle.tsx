"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/translations";

export function LanguageToggle() {
    const { locale, setLocale } = useLocale();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleLanguage = async () => {
        const nextLocale = locale === "en" ? "bn" : "en";
        setIsUpdating(true);
        try {
            const res = await fetch("/api/locale", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locale: nextLocale }),
            });
            if (!res.ok) {
                throw new Error("Failed to update locale");
            }
            setLocale(nextLocale);
            router.refresh();
        } catch (error) {
            console.error("Failed to update language:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isUpdating}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-bg-tertiary transition-all border border-border-primary text-text-primary"
            title={locale === "en" ? t(locale, "switchToBangla") : t(locale, "switchToEnglish")}
        >
            {locale === "en" ? (
                <>
                    <span className="text-base">🇧🇩</span>
                    <span className="hidden sm:inline">{t(locale, "switchToBangla")}</span>
                    <span className="sm:hidden">BN</span>
                </>
            ) : (
                <>
                    <span className="text-base">🇺🇸</span>
                    <span className="hidden sm:inline">{t(locale, "switchToEnglish")}</span>
                    <span className="sm:hidden">EN</span>
                </>
            )}
        </button>
    );
}
