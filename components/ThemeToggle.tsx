"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
    className?: string
    showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render a placeholder with the same dimensions to prevent layout shift
        return (
            <div className={cn(showLabel ? "h-10 w-20" : "h-10 w-10 shrink-0", "opacity-0", className)} />
        )
    }

    const isDark = theme === "dark"

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border border-border-primary bg-bg-secondary/80 text-text-primary transition-colors hover:bg-bg-tertiary",
                showLabel ? "px-3 py-2 text-xs font-bold uppercase tracking-wider" : "!h-10 !w-10 !p-0 shrink-0",
                className,
            )}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <>
                    <Sun className="w-4 h-4" />
                    {showLabel && <span>Light</span>}
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4" />
                    {showLabel && <span>Dark</span>}
                </>
            )}
        </button>
    )
}
