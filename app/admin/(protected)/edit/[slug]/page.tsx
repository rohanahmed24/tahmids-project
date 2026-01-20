import { getPostBySlug } from "@/lib/posts";
import { updatePost } from "@/actions/posts";
import { verifyAdmin } from "@/actions/admin-auth";
import { redirect, notFound } from "next/navigation";
import Editor from "@/app/admin/components/Editor";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        redirect("/signin");
    }

    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Bind the slug to the server action
    const updateAction = updatePost.bind(null, slug);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary p-6 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2 text-text-primary">Edit Story</h1>
                    <p className="text-text-secondary">Editing: <span className="text-accent-main">{post.title}</span></p>
                </div>

                <Editor
                    initialData={{
                        title: post.title,
                        slug: post.slug,
                        category: post.category,
                        content: post.content || "",
                        coverImage: post.coverImage || undefined,
                        videoUrl: post.videoUrl || undefined,
                        subtitle: post.subtitle || undefined,
                        topic_slug: post.topic_slug || undefined,
                        accent_color: post.accent_color || undefined,
                        featured: post.featured
                    }}
                    action={updateAction}
                />
            </div>
        </main>
    );
}
