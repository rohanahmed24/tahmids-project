import { getAllPosts } from "@/lib/posts";
import DashboardClient from "./DashboardClient";
import { verifyAdmin } from "@/actions/admin-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        redirect("/admin");
    }

    const posts = await getAllPosts();

    const mappedPosts = posts.map((post, index) => ({
        id: index + 1, // temporary ID
        title: post.title,
        author: post.author,
        category: post.category,
        status: "published", // Assuming all in DB are published for now
        views: 0, // No views tracking yet
        date: post.date,
        img: post.coverImage || "/imgs/Chernobyl.png",
        slug: post.slug // Needed for edit link
    }));

    return <DashboardClient initialArticles={mappedPosts} />;
}
