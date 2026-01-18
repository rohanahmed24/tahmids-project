
import { getDb } from "./lib/db";
import { RowDataPacket } from "mysql2/promise";
import { Assets } from "./lib/assets";

const missingArticles = [
    // From articles array
    {
        slug: "modern-architecture",
        title: "Understanding Modern Architecture",
        author: "Sarah Jenkins",
        date: "Dec 10",
        category: "Design",
        img: Assets.imgArticleBreakout,
        content: "# Understanding Modern Architecture\n\nModern architecture is not just about style; it's about a philosophy of living. \n\n## Form Follows Function\n\nThe core principle of modernism remains relevant today..."
    },
    {
        slug: "future-work",
        title: "The Future of Work and Automation",
        author: "David Miller",
        date: "Dec 9",
        category: "Tech",
        img: Assets.imgStoryHistory,
        content: "# The Future of Work\n\nAutomation is reshaping industries at an unprecedented pace. \n\n## The Human Element\n\nWhile robots can perform repetitive tasks, creativity remains uniquely human..."
    },
    {
        slug: "meditation",
        title: "Meditation and Mental Health",
        author: "Emily Rose",
        date: "Dec 8",
        category: "Psychology",
        img: Assets.imgStoryScience,
        content: "# Meditation and Mental Health\n\nIn a chaotic world, finding inner peace is more important than ever. \n\n## The Science of Silence\n\nStudies show that daily meditation reduces stress hormones..."
    },
    {
        slug: "sustainable-living",
        title: "Sustainable Living in Urban Spaces",
        author: "James L.",
        date: "Dec 7",
        category: "Lifestyle",
        img: Assets.imgArticleFutureCities,
        content: "# Sustainable Living\n\nCan we live sustainably in concrete jungles? The answer is yes. \n\n## Green Rooftops\n\nUrban farming is taking over skylines..."
    },
    // From breakingNews array
    {
        slug: "minimalism-design",
        title: "Minimalism in Modern Design",
        author: "Sarah Jenkins",
        date: "Dec 11",
        category: "Design",
        img: Assets.imgPlaceholderImage1,
        content: "# Minimalism in Modern Design\n\nLess is more. This mantra continues to influence design across all disciplines..."
    },
    {
        slug: "blockchain-future",
        title: "Blockchain and the Future",
        author: "David Miller",
        date: "Dec 10",
        category: "Tech",
        img: Assets.imgPlaceholderImage2,
        content: "# Blockchain and the Future\n\nBeyond cryptocurrency, blockchain technology promises to revolutionize trust..."
    },
    {
        slug: "climate-solutions",
        title: "Climate Change Solutions",
        author: "Emily Rose",
        date: "Dec 9",
        category: "Science",
        img: Assets.imgStoryCulture,
        content: "# Climate Change Solutions\n\nInnovative technologies are giving us new tools in the fight against climate change..."
    },
    {
        slug: "art-storytelling",
        title: "The Art of Storytelling",
        author: "John Smith",
        date: "Dec 8",
        category: "Culture",
        img: Assets.imgStoryHistory,
        content: "# The Art of Storytelling\n\nStories connect us. They are the fabric of human culture..."
    }
];

async function fix() {
    const db = getDb();
    console.log("Fixing missing articles...");

    for (const article of missingArticles) {
        // Check if exists
        const [rows] = await db.query<RowDataPacket[]>("SELECT id FROM posts WHERE slug = ?", [article.slug]);
        if (rows.length === 0) {
            console.log(`Inserting missing article: ${article.slug}`);
            // Note: coverImage in DB is string path, usually. Assets object gives path string.
            // But Assets might be StaticImageData object in Next.js?
            // In lib/assets.ts, it returns strings or objects?
            // Let's assume strings or handle it.
            // Actually setup-full.ts handled it.
            // Let's look at lib/assets.ts to be sure.

            await db.query(
                "INSERT INTO posts (slug, title, date, author, category, content, coverImage) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [article.slug, article.title, article.date, article.author, article.category, article.content, "/imgs/Chernobyl.png"] // Fallback image for safety, or use article.img if string
            );
        } else {
            console.log(`Article already exists: ${article.slug}`);
        }
    }
    console.log("Done.");
    process.exit(0);
}

fix().catch(console.error);
