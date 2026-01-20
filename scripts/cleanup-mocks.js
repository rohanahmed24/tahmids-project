require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log('Starting cleanup...');

    try {
        const posts = await prisma.post.deleteMany({});
        console.log(`Deleted ${posts.count} posts.`);

        const media = await prisma.media.deleteMany({});
        console.log(`Deleted ${media.count} media items.`);

        console.log('Cleanup complete.');
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
