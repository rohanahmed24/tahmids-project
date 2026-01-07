import { createPost } from "@/actions/posts";

export default function WritePage() {
    return (
        <main className="min-h-screen bg-gray-950 text-white p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-serif mb-2">Write New Article</h1>
                        <p className="text-gray-400">Create a new story for Wisdomia</p>
                    </div>
                    <a href="/admin/dashboard" className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                        Back to Dashboard
                    </a>
                </header>

                <form action={createPost} className="space-y-6 bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="Enter article title..."
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Category</label>
                        <select
                            name="category"
                            required
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white"
                        >
                            <option value="Technology">Technology</option>
                            <option value="Philosophy">Philosophy</option>
                            <option value="History">History</option>
                            <option value="Culture">Culture</option>
                            <option value="Science">Science</option>
                            <option value="Art">Art</option>
                        </select>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Cover Image</label>
                         <div className="flex flex-col gap-4">
                            <input
                                type="file"
                                name="coverImageFile"
                                accept="image/*"
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 transition-colors"
                            />
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-gray-900 px-2 text-gray-500">Or use URL</span>
                                </div>
                            </div>
                            <input
                                type="text"
                                name="coverImage"
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white font-mono text-sm"
                            />
                        </div>
                    </div>

                     {/* Video URL */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Video URL (Optional)</label>
                         <input
                            type="text"
                            name="videoUrl"
                            placeholder="https://youtube.com/..."
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white font-mono text-sm"
                        />
                    </div>

                    {/* Content (MDX) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Content (MDX)</label>
                        <textarea
                            name="content"
                            required
                            placeholder="# Write your story here..."
                            rows={20}
                            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-white font-mono text-sm leading-relaxed"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-800">
                        <a href="/admin/dashboard" className="px-6 py-3 text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </a>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Publish Article
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
