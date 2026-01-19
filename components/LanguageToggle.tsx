"use client";

import { useState } from "react";

export function LanguageToggle() {
    // State for language selection (en/bn)
    // Note: This currently only manages UI state. Real implementation would toggle routes/context.
    const [language, setLanguage] = useState<"en" | "bn">("en");

    return (
        <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-bg-tertiary transition-all border border-border-primary text-text-primary"
            title={language === "en" ? "Switch to Bangla" : "Switch to English"}
        >
            {language === "en" ? (
                <>
                    <span className="text-base">🇧🇩</span>
                    <span className="hidden sm:inline">বাংলা</span>
                    <span className="sm:hidden">BN</span>
                </>
            ) : (
                <>
                    <span className="text-base">🇺🇸</span>
                    <span className="hidden sm:inline">English</span>
                    <span className="sm:hidden">EN</span>
                </>
            )}
        </button>
    );
}
