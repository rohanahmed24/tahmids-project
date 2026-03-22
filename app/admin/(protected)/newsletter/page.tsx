import { redirect } from "next/navigation";
import { Mail, UserCheck, Users } from "lucide-react";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { getAllUsers } from "@/lib/users";
import { getNewsletterSubscribers } from "@/lib/newsletter";
import { NewsletterAudiencePanel } from "@/components/admin/NewsletterAudiencePanel";

export default async function NewsletterPage() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    const [users, subscribers] = await Promise.all([
        getAllUsers(),
        getNewsletterSubscribers(),
    ]);

    const uniqueAudience = new Set([
        ...users.map((user) => user.email.trim().toLowerCase()),
        ...subscribers.map((subscriber) => subscriber.email.trim().toLowerCase()),
    ]).size;

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent-primary">
                            <Mail className="h-3.5 w-3.5" />
                            <span>Newsletter</span>
                        </div>
                        <h1 className="mt-3 text-3xl font-bold text-text-primary">Newsletter Audience</h1>
                        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                            View direct subscriber emails, combine them with registered users, and prepare exports for bulk sending.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{subscribers.length}</p>
                                <p className="text-sm text-text-secondary">Direct Subscribers</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{users.length}</p>
                                <p className="text-sm text-text-secondary">Registered Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{uniqueAudience}</p>
                                <p className="text-sm text-text-secondary">Unique Audience</p>
                            </div>
                        </div>
                    </div>
                </div>

                <NewsletterAudiencePanel
                    subscribers={subscribers}
                    registeredUsers={users.map((user) => ({
                        email: user.email,
                        name: user.name,
                        createdAt: user.created_at,
                    }))}
                />
            </div>
        </div>
    );
}
