const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVideoUrls() {
    const posts = await prisma.post.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
            title: true,
            slug: true,
            videoUrl: true
        }
    });

    console.log("Checking recent posts for videoUrl:");
    posts.forEach(post => {
        console.log(`Title: ${post.title.substring(0, 30)}... | Has videoUrl: ${!!post.videoUrl} | Value: '${post.videoUrl}'`);
    });
}

checkVideoUrls()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
