import { createPost } from "@/actions/posts";
import Editor from "@/app/admin/components/Editor";

export default function WritePage() {
    return (
        <main className="min-h-screen bg-gray-950 text-white p-6 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2">Create New Story</h1>
                    <p className="text-gray-400">Share your thoughts with the world.</p>
                </div>

                <Editor action={createPost} />
            </div>
        </main>
    );
}
