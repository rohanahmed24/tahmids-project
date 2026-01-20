"use client";

import { useEffect } from "react";

export function DevToolsBlocker() {
    useEffect(() => {
        // Disable right-click context menu (except on form elements for copy/paste)
        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const tagName = target.tagName.toLowerCase();
            
            // Allow context menu on form elements for copy/paste functionality
            if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
                return; // Don't block on input/textarea elements
            }
            
            // Allow context menu on admin pages
            if (window.location.pathname.startsWith('/admin')) {
                return;
            }
            
            e.preventDefault();
        };

        // Disable keyboard shortcuts for dev tools
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === "F12") {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && e.key === "I") {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === "J") {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+C (Element picker)
            if (e.ctrlKey && e.shiftKey && e.key === "C") {
                e.preventDefault();
                return false;
            }
            // Ctrl+U (View source)
            if (e.ctrlKey && e.key === "u") {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}
