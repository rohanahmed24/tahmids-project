"use client";

import { ReactNode } from "react";

export function ArticleContent({ children }: { children: ReactNode }) {
    return (
        <article
            id="article-content"
            className="prose prose-lg md:prose-xl dark:prose-invert max-w-none min-w-0 break-words [overflow-wrap:anywhere] font-sans text-text-secondary leading-loose"
        >
            {children}
        </article>
    );
}
