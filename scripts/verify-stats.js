const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const articleCount = await prisma.posts.count({ where: { published: true } });
        const viewsAgg = await prisma.posts.aggregate({
            _sum: { views: true }
        });
        console.log("DB_STATS_OUTPUT_BEGIN");
        console.log(`Users: ${userCount}`);
        console.log(`Articles: ${articleCount}`);
        console.log(`Views: ${viewsAgg._sum.views}`);
        console.log("DB_STATS_OUTPUT_END");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
