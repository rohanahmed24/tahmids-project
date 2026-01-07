"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * SessionSync
 *
 * This component is a temporary bridge to maintain compatibility with legacy code
 * that relies on `localStorage` for user session management ("wisdomia_current_user").
 *
 * Once the entire application is migrated to use `useSession` from NextAuth,
 * this component and the localStorage logic can be removed.
 */
export function SessionSync() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            localStorage.setItem("wisdomia_current_user", JSON.stringify({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
            }));
        }
    }, [session]);

    return null;
}
