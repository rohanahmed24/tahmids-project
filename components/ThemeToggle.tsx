"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render a placeholder with the same dimensions to prevent layout shift
        return (
            <div className="w-5 h-5 opacity-0" />
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <>
                    <Sun className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Light</span>
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Dark</span>
                </>
            )}
        </button>
    )
}

