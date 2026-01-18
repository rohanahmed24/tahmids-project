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
            title: 'The Impact of the Arab Spring',
            slug: 'arab-spring-impact',
            excerpt: 'Analyzing the long-term political shifts in the Middle East.',
            content: '# Politics\n\nA decade later, the effects are still felt...',
            category: 'Politics',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: '/imgs/Arab Spring.png'
        },
        {
            title: 'The Mystery of Stonehenge',
            slug: 'mystery-stonehenge',
            excerpt: 'Who built it and why? New theories emerge.',
            content: '# Mystery\n\nAncient stones tell a story...',
            category: 'Mystery',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: '/imgs/Stonehenge.jpeg'
        },
        {
            title: 'Jack the Ripper: Case Closed?',
            slug: 'jack-the-ripper',
            excerpt: 'New DNA evidence sheds light on the infamous killer.',
            content: '# Crime\n\nThe whitechapel murders...',
            category: 'Crime',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: '/imgs/Jack the Ripper.jpeg'
        },
        {
            title: 'The Great Wall: A History',
            slug: 'great-wall-history',
            excerpt: 'Beyond the myths: The true story of the Great Wall.',
            content: '# History\n\nBuilt over centuries...',
            category: 'History',
            featured: false,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: '/imgs/Great Wall of China.jpeg'
        },
        {
            title: 'Global Financial Update: Petrodollar',
            slug: 'global-finance-petrodollar',
            excerpt: 'Understanding the shifts in global currency markets.',
            content: '# News\n\nEconomic tides are turning...',
            category: 'News',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: '/imgs/Petrodollar.png'
        },
        {
            title: 'Genetic Memory: Fact or Fiction?',
            slug: 'genetic-memory',
            excerpt: 'Can we inherit memories from our ancestors?',
            content: '# Science\n\nThe science of epigenetics...',
            category: 'Science',
            featured: true,
            published: true,
            date: new Date(),
            authorId: admin.id,
            authorName: admin.name,
            coverImage: '/imgs/Genetic Memory.png'
        }
    ];

    for (const post of posts) {
        const p = await prisma.post.upsert({
            where: { slug: post.slug },
            update: {
                coverImage: post.coverImage,
                title: post.title,
                excerpt: post.excerpt
            },
            create: post,
        });
        console.log(`Upserted post: ${p.title}`);
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
