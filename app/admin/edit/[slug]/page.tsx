import { getPostBySlug } from "@/lib/posts";
import { updatePost } from "@/actions/posts";
import { notFound } from "next/navigation";
import Editor from "@/app/admin/components/Editor";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Bind the slug to the server action
    const updateAction = updatePost.bind(null, slug);

    return (
        <main className="min-h-screen bg-gray-950 text-white p-6 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2">Edit Story</h1>
                    <p className="text-gray-400">Editing: <span className="text-purple-400">{post.title}</span></p>
                </div>

                <Editor
                    initialData={{
                        title: post.title,
                        slug: post.slug,
                        category: post.category,
                        content: post.content,
                        coverImage: post.coverImage,
                        videoUrl: post.videoUrl,
                        subtitle: post.subtitle,
                        topic_slug: post.topic_slug,
                        accent_color: post.accent_color,
                        featured: post.featured
                    }}
                    action={updateAction}
                />
            </div>
        </main>
    );
}
