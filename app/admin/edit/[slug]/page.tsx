import { getPostBySlug } from "@/lib/posts";
import { updatePost } from "@/actions/posts";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Bind the slug to the server action
    const updateAction = updatePost.bind(null, slug);

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-serif mb-2">Edit Article</h1>
                        <p className="text-gray-400">Editing: <span className="text-purple-400">{post.title}</span></p>
                    </div>
                    <a href="/admin/dashboard" className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                        Back to Dashboard
                    </a>
                </header>

                <form action={updateAction} className="space-y-6 bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Title</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={post.title}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white"
                        />
                    </div>

                    {/* Slug (Read-only for now) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Slug</label>
                        <input
                            type="text"
                            value={post.slug}
                            readOnly
                            disabled
                            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Cover Image URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Cover Image URL</label>
                        <input
                            type="text"
                            name="coverImage"
                            defaultValue={post.coverImage}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">
                            Use a path from /imgs/... or an external URL.
                        </p>
                    </div>

                     {/* Video URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Video URL (Optional)</label>
                         <input
                            type="text"
                            name="videoUrl"
                            defaultValue={post.videoUrl || ''}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white font-mono text-sm"
                        />
                    </div>

                    {/* Content (MDX) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Content (MDX)</label>
                        <textarea
                            name="content"
                            defaultValue={post.content}
                            rows={20}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white font-mono text-sm leading-relaxed"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-800">
                        <button type="button" className="px-6 py-3 text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
