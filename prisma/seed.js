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
            title: 'Welcome to The Wisdomia',
            slug: 'welcome-to-the-wisdomia',
            excerpt: 'This is the first post on our new platform. Stay tuned for more updates!',
            content: '# Welcome\n\nWe are excited to launch The Wisdomia. This platform is dedicated to sharing knowledge and insights.',
            category: 'General',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1499750310159-54100fff19f4?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'The Future of Artificial Intelligence',
            slug: 'future-of-ai',
            excerpt: 'Exploring how AI will shape our lives in the coming decades.',
            content: '# AI Future\n\nArtificial Intelligence is rapidly evolving. From machine learning to generative models...',
            category: 'Technology',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: '10 Tips for a Healthy Lifestyle',
            slug: 'healthy-lifestyle-tips',
            excerpt: 'Simple habits that can improve your physical and mental well-being.',
            content: '# Healthy Living\n\n1. Drink water\n2. Sleep well\n3. Exercise daily...',
            category: 'Lifestyle',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Top Travel Destinations for 2026',
            slug: 'top-travel-destinations-2026',
            excerpt: 'Discover the most beautiful places to visit this year.',
            content: '# Travel 2026\n\nPack your bags! Here are the top spots...',
            category: 'Travel',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Understanding Global Economics',
            slug: 'understanding-global-economics',
            excerpt: 'A deep dive into the current state of the world economy.',
            content: '# Global Economy\n\nInflation, interest rates, and trade...',
            category: 'Finance',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80'
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
