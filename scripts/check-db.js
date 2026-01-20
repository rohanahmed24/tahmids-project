const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        // Check posts
        const postsCount = await prisma.post.count();
        const recentPosts = await prisma.post.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, slug: true, title: true, published: true, coverImage: true, videoUrl: true }
        });

        // Check users
        const usersCount = await prisma.user.count();
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true }
        });

        // Check media
        const mediaCount = await prisma.media.count();
        const recentMedia = await prisma.media.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, filename: true, path: true }
        });

        // Check navbar links
        const navLinks = await prisma.navbarLink.findMany();

        console.log('=== DATABASE STATUS ===');
        console.log('Posts:', postsCount);
        console.log('Users:', usersCount);
        console.log('Media:', mediaCount);
        console.log('Navbar Links:', navLinks.length);

        console.log('\n=== RECENT POSTS ===');
        recentPosts.forEach(p => {
            console.log(`- [${p.id}] ${p.title}`);
            console.log(`  slug: ${p.slug}, published: ${p.published}`);
            console.log(`  hasImage: ${!!p.coverImage}, hasVideo: ${!!p.videoUrl}`);
        });

        console.log('\n=== USERS ===');
        users.forEach(u => {
            console.log(`- [${u.id}] ${u.name} <${u.email}> - ${u.role}`);
        });

        console.log('\n=== RECENT MEDIA ===');
        recentMedia.forEach(m => {
            console.log(`- [${m.id}] ${m.filename}`);
            console.log(`  path: ${m.path}`);
        });

        console.log('\n=== NAVBAR LINKS ===');
        navLinks.forEach(n => {
            console.log(`- [${n.id}] ${n.label} -> ${n.href}`);
        });

        // Test CRUD - Create a test post and delete it
        console.log('\n=== CRUD TEST ===');
        const testPost = await prisma.post.create({
            data: {
                slug: 'test-crud-' + Date.now(),
                title: 'CRUD Test Post',
                published: false,
                content: 'Test content',
                category: 'test'
            }
        });
        console.log('CREATE: Created test post with id:', testPost.id);

        const readPost = await prisma.post.findUnique({ where: { id: testPost.id } });
        console.log('READ: Found post:', readPost ? 'YES' : 'NO');

        const updatedPost = await prisma.post.update({
            where: { id: testPost.id },
            data: { title: 'Updated CRUD Test Post' }
        });
        console.log('UPDATE: Updated title to:', updatedPost.title);

        await prisma.post.delete({ where: { id: testPost.id } });
        console.log('DELETE: Deleted test post');

        console.log('\n✅ All CRUD operations working correctly!');

    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
