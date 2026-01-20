const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const post = await prisma.post.findFirst({
        where: { videoUrl: { not: null } },
        select: { slug: true, title: true, videoUrl: true, coverImage: true }
    });

    if (post) {
        console.log('Post with video found:');
        console.log('  slug:', post.slug);
        console.log('  title:', post.title);
        console.log('  videoUrl:', post.videoUrl);
        console.log('  coverImage:', post.coverImage);
    } else {
        console.log('No posts with video found');
    }

    await prisma.$disconnect();
}

check();
