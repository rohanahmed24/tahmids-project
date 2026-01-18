
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting cleanup...');

    // Delete posts with Unsplash URLs (legacy data)
    const unsplash = await prisma.post.deleteMany({
        where: {
            coverImage: {
                startsWith: 'http'
            }
        }
    });
    console.log(`Deleted ${unsplash.count} posts with external/Unsplash images.`);

    // Delete specific "Welcome" post if not caught above
    const welcome = await prisma.post.deleteMany({
        where: {
            title: {
                contains: 'Welcome to The Wisdomia'
            }
        }
    });
    console.log(`Deleted ${welcome.count} Welcome posts.`);

    console.log('Cleanup finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
