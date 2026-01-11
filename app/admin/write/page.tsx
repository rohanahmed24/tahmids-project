import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { verifyAdmin } from "@/actions/admin-auth";
import { createPost } from "@/actions/posts";
import Editor from "@/app/admin/components/Editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function WritePage() {
    const session = await auth();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin/dashboard"
                            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="w-px h-6 bg-border-primary"></div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Create New Article</h1>
                            <p className="text-text-secondary mt-1">Share your story with the world</p>
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
                    <Editor action={createPost} />
                </div>
            </div>
        </div>
    );
}
