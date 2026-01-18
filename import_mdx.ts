
import { prisma } from "./lib/db";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

async function importMdx() {
    const postsDir = path.join(process.cwd(), "content/posts");

    try {
        const files = await fs.readdir(postsDir);

        console.log(`Found ${files.length} files in ${postsDir}`);

        for (const file of files) {
            if (!file.endsWith(".mdx")) continue;

            const filePath = path.join(postsDir, file);
            const content = await fs.readFile(filePath, "utf-8");
            const { data, content: mdxContent } = matter(content);
            const slug = file.replace(".mdx", "");

            console.log(`Processing ${slug}...`);

            // Check if exists
            const existingPost = await prisma.post.findUnique({
                where: { slug }
            });

            if (existingPost) {
                console.log(`Updating existing post: ${slug}`);
                await prisma.post.update({
                    where: { slug },
                    data: {
                        title: data.title,
                        date: new Date(data.date),
                        authorName: data.author,
                        category: data.category,
                        content: mdxContent,
                        coverImage: data.coverImage,
                        videoUrl: data.videoUrl || null
                    }
                });
            } else {
                console.log(`Inserting new post: ${slug}`);
                await prisma.post.create({
                    data: {
                        slug,
                        title: data.title,
                        date: new Date(data.date),
                        authorName: data.author,
                        category: data.category,
                        content: mdxContent,
                        coverImage: data.coverImage,
                        videoUrl: data.videoUrl || null
                    }
                });
            }
        }
        console.log("Import complete.");
        process.exit(0);

    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

importMdx();
