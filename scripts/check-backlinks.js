const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBacklinks() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        title: true,
        backlinks: true,
        published: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log('Posts with backlinks data:');
    console.log('================================');

    for (const post of posts) {
      if (post.backlinks) {
        console.log(`\nTitle: ${post.title}`);
        console.log(`Slug: ${post.slug}`);
        console.log(`Published: ${post.published}`);
        console.log(`Backlinks type: ${Array.isArray(post.backlinks) ? 'Array' : typeof post.backlinks}`);
        console.log(`Backlinks value:`, JSON.stringify(post.backlinks, null, 2));
      }
    }

    console.log('\n================================');
    const postsWithBacklinks = posts.filter(p => p.backlinks && p.backlinks.length > 0);
    console.log(`Total posts checked: ${posts.length}`);
    console.log(`Posts with backlinks: ${postsWithBacklinks.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBacklinks();
