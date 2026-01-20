

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up legacy Unsplash posts...');

    // Find posts with Unsplash images
    const legacyPosts = await prisma.post.findMany({
        where: {
            coverImage: {
                startsWith: 'http'
            }
        }
    });

    console.log(`Found ${legacyPosts.length} legacy posts to delete.`);
    legacyPosts.forEach(p => console.log(`- ${p.title} (${p.slug})`));

    if (legacyPosts.length > 0) {
        const deleted = await prisma.post.deleteMany({
            where: {
                coverImage: {
                    startsWith: 'http'
                }
            }
        });
        console.log(`Deleted ${deleted.count} posts.`);
    } else {
        console.log('No legacy posts found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        // No disconnect to avoid script error, process will exit
    });
