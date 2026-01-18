const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Admin User
    const adminEmail = 'admin@thewisdomia.com';
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            role: 'admin',
            image: 'https://ui-avatars.com/api/?name=Admin+User',
            password: '$2a$10$EpWaTGVQ7J.JE.8s.pO7Hu/y.u.B.e.P.e.r.s.o.n.a.l.H.a.s.h', // Placeholder hash
        },
    });
    console.log(`Created user: ${admin.name}`);

    // Sample Posts Data
    const posts = [
        {
            title: 'Global Political Shifts in 2026',
            slug: 'global-political-shifts-2026',
            excerpt: 'An in-depth analysis of the changing political landscape.',
            content: '# Politics\n\nMajor changes are happening...',
            category: 'Politics',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'The Great Mystery of the Deep Sea',
            slug: 'mystery-deep-sea',
            excerpt: 'What lies beneath the ocean surface?',
            content: '# Mystery\n\nUnexplained phenomena...',
            category: 'Mystery',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Cold Cases Solved',
            slug: 'cold-cases-solved',
            excerpt: 'Recent breakthroughs in forensic science.',
            content: '# Crime\n\nJustice served...',
            category: 'Crime',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1453873419-481dc7251185?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Ancient Civilizations Unearthed',
            slug: 'ancient-civilizations',
            excerpt: 'New discoveries rewriting history books.',
            content: '# History\n\nDigging into the past...',
            category: 'History',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Breaking: Major Tech Announcement',
            slug: 'breaking-tech-news',
            excerpt: 'The biggest news of the day.',
            content: '# News\n\nRead all about it...',
            category: 'News',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Mars Colonization Update',
            slug: 'mars-colonization',
            excerpt: 'Are we ready to live on the red planet?',
            content: '# Science\n\nSpace exploration...',
            category: 'Science',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
        }
    ];

    for (const post of posts) {
        const p = await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: post,
        });
        console.log(`Created post: ${p.title}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
