"use client";

import { useState } from "react";

export function LanguageToggle() {
    // State for language selection (en/bn)
    const [language, setLanguage] = useState<"en" | "bn">("en");

    return (
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1.5 border border-white/10">
            <button
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${language === "en" ? "bg-accent text-white shadow-sm" : "hover:bg-white/10 opacity-60 hover:opacity-100"
                    }`}
                title="English"
            >
                <span className="text-base">🇺🇸</span>
                <span>EN</span>
            </button>
            <button
                onClick={() => setLanguage("bn")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full transition-all ${language === "bn" ? "bg-accent text-white shadow-sm" : "hover:bg-white/10 opacity-60 hover:opacity-100"
                    }`}
                title="বাংলা"
            >
                <span className="text-base">🇧🇩</span>
                <span>বাংলা</span>
            </button>
        </div>
    );
}
