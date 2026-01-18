
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.findMany({
        where: {
            title: {
                contains: 'Welcome'
            }
        }
    });
    console.log('Found posts:', JSON.stringify(posts, null, 2));

    // Also check featured posts just in case
    const featured = await prisma.post.findMany({
        where: { featured: true },
        select: { title: true, coverImage: true, slug: true },
        take: 5
    });
    console.log('Featured posts:', JSON.stringify(featured, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
