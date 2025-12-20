"use client";

import { ReactNode } from "react";

export function ArticleContent({ children }: { children: ReactNode }) {
    return (
        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-text-secondary leading-loose">
            {children}
        </article>
    );
}
