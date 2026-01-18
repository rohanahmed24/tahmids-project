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
            password: '$2b$10$72MbE1yQMq8VB6PEve1Yv.hy1R4UcIC5pGT122/shOtQGI8GEqui2', // Hash for 'wisdomia2024'
        },
    });
    console.log(`Created user: ${admin.name}`);

    // Helper to map Asset variables to real paths
    const getImg = (key) => {
        const map = {
            'imgPlaceholderImage': "/imgs/Chernobyl.png",
            'imgPlaceholderImage1': "/imgs/Arab Spring.png",
            'imgPlaceholderImage2': "/imgs/Stonehenge.jpeg",
            'imgPlaceholderImage3': "/imgs/Jack the Ripper.jpeg",
            'imgPlaceholderImage4': "/imgs/Genetic Memory.png",
            'imgPlaceholderImage5': "/imgs/Deja Vu.png",
            'imgPlaceholderImage6': "/imgs/Great Wall of China.jpeg",
            'imgPlaceholderImage7': "/imgs/Nazka Lines.png",
            'imgStoryHistory': "/imgs/Great Wall of China.jpeg",
            'imgStoryPolitics': "/imgs/Arab Spring.png",
            'imgStoryCrime': "/imgs/Jack the Ripper.jpeg",
            'imgStoryCulture': "/imgs/Stonehenge.jpeg",
            'imgStoryArt': "/imgs/Nazka Lines.png",
            'imgStoryScience': "/imgs/Genetic Memory.png",
            'imgArticleHero': "/imgs/Chernobyl.png"
        };
        return map[key] || '/imgs/Chernobyl.png';
    };

    // Restored Data from lib/mock-data.ts
    const rawPosts = [
        // Politics
        { category: 'Politics', title: "The Changing Landscape of Global Democracy", imgKey: 'imgPlaceholderImage1', author: "John Smith" },
        { category: 'Politics', title: "Election Reforms: What's Next for Voting Rights", imgKey: 'imgPlaceholderImage2', author: "Sarah Lee" },
        { category: 'Politics', title: "International Relations in the Modern Era", imgKey: 'imgPlaceholderImage3', author: "Mike Chen" },
        { category: 'Politics', title: "The Rise of Political Activism Online", imgKey: 'imgPlaceholderImage4', author: "Emma Wilson" },
        { category: 'Politics', title: "Climate Policy and Political Will", imgKey: 'imgStoryCulture', author: "David Miller" },
        { category: 'Politics', title: "Understanding Political Polarization", imgKey: 'imgStoryScience', author: "Lisa Park" },

        // Mystery
        { category: 'Mystery', title: "The Bermuda Triangle: Science vs Legend", imgKey: 'imgPlaceholderImage2', author: "James Wright" },
        { category: 'Mystery', title: "Unsolved: The Zodiac Killer's Final Cipher", imgKey: 'imgPlaceholderImage3', author: "Rachel Green" },
        { category: 'Mystery', title: "Ancient Mysteries of the Pyramids", imgKey: 'imgPlaceholderImage4', author: "Tom Baker" },
        { category: 'Mystery', title: "The Lost City of Atlantis: Myth or Reality?", imgKey: 'imgPlaceholderImage1', author: "Nina Patel" },
        { category: 'Mystery', title: "Mysterious Disappearances That Baffled Experts", imgKey: 'imgStoryArt', author: "Alex Kim" },
        { category: 'Mystery', title: "The Oak Island Money Pit Mystery", imgKey: 'imgStoryHistory', author: "Chris Evans" },

        // Crime
        { category: 'Crime', title: "Inside the Mind of Criminal Profilers", imgKey: 'imgPlaceholderImage3', author: "Dr. Sarah Chen" },
        { category: 'Crime', title: "The Evolution of Forensic Science", imgKey: 'imgPlaceholderImage4', author: "Mark Johnson" },
        { category: 'Crime', title: "Cybercrime: The New Frontier of Law Enforcement", imgKey: 'imgPlaceholderImage1', author: "Tech Weekly" },
        { category: 'Crime', title: "Cold Cases Solved by Modern DNA Technology", imgKey: 'imgPlaceholderImage2', author: "Jane Foster" },
        { category: 'Crime', title: "The Psychology Behind White Collar Crime", imgKey: 'imgStoryCulture', author: "Prof. Williams" },
        { category: 'Crime', title: "True Crime Podcasts: Entertainment or Education?", imgKey: 'imgStoryScience', author: "Media Watch" },

        // History
        { category: 'History', title: "The Rise and Fall of Ancient Empires", imgKey: 'imgPlaceholderImage4', author: "Prof. Anderson" },
        { category: 'History', title: "World War II: Stories Never Told", imgKey: 'imgPlaceholderImage1', author: "Military History" },
        { category: 'History', title: "The Renaissance: Art, Science, and Revolution", imgKey: 'imgPlaceholderImage2', author: "Art Institute" },
        { category: 'History', title: "Industrial Revolution: How It Changed Everything", imgKey: 'imgPlaceholderImage3', author: "Economic Times" },
        { category: 'History', title: "Ancient Civilizations and Their Legacies", imgKey: 'imgStoryArt', author: "Archaeology Today" },
        { category: 'History', title: "The Space Race: A Cold War Story", imgKey: 'imgStoryHistory', author: "NASA Archives" },

        // News
        { category: 'News', title: "Global Markets React to Economic Shifts", imgKey: 'imgPlaceholderImage1', author: "Finance Desk" },
        { category: 'News', title: "Climate Summit: World Leaders Make New Pledges", imgKey: 'imgPlaceholderImage2', author: "Environment" },
        { category: 'News', title: "Tech Giants Face New Regulatory Challenges", imgKey: 'imgPlaceholderImage3', author: "Tech News" },
        { category: 'News', title: "Healthcare Innovation: Breakthrough Treatments", imgKey: 'imgPlaceholderImage4', author: "Health Desk" },
        { category: 'News', title: "Sports: Championship Finals Draw Record Viewers", imgKey: 'imgStoryCulture', author: "Sports Desk" },
        { category: 'News', title: "Entertainment: Award Season Predictions", imgKey: 'imgStoryScience', author: "Entertainment" },

        // Science
        { category: 'Science', title: "James Webb Telescope: New Discoveries Unveiled", imgKey: 'imgStoryScience', author: "NASA" },
        { category: 'Science', title: "The Future of Quantum Computing", imgKey: 'imgPlaceholderImage1', author: "Tech Labs" },
        { category: 'Science', title: "Climate Science: Understanding the Data", imgKey: 'imgPlaceholderImage2', author: "IPCC" },
        { category: 'Science', title: "Neuroscience: Mapping the Human Brain", imgKey: 'imgPlaceholderImage3', author: "Brain Institute" },
        { category: 'Science', title: "Gene Editing: CRISPR's Next Frontier", imgKey: 'imgPlaceholderImage4', author: "Bio Weekly" },
        { category: 'Science', title: "Renewable Energy Breakthroughs", imgKey: 'imgStoryCulture', author: "Green Tech" },

        // Original Seed posts (Persisting because they are good anchors)
        { category: 'Politics', title: "The Impact of the Arab Spring", imgKey: 'imgPlaceholderImage1', author: "Admin" },
        { category: 'Mystery', title: "The Mystery of Stonehenge", imgKey: 'imgPlaceholderImage2', author: "Admin" },
        { category: 'Crime', title: "Jack the Ripper: Case Closed?", imgKey: 'imgPlaceholderImage3', author: "Admin" },
        { category: 'History', title: "The Great Wall: A History", imgKey: 'imgPlaceholderImage6', author: "Admin" },
    ];

    function slugify(text) {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-') + '-' + Math.floor(Math.random() * 1000); // Add random suffix to allow duplicate titles
    }

    for (const p of rawPosts) {
        const slug = slugify(p.title);

        await prisma.post.upsert({
            where: { slug: slug }, // unlikely to collide due to random suffix
            update: {
                coverImage: getImg(p.imgKey),
                category: p.category,
            },
            create: {
                title: p.title,
                slug: slug,
                excerpt: `${p.title} - An exploration into the details of this fascinating topic.`,
                content: `# ${p.title}\n\nLorem ipsum dolor sit amet...`,
                category: p.category,
                featured: Math.random() < 0.3, // Randomly feature some
                published: true,
                date: new Date(),
                authorId: admin.id,
                authorName: p.author || admin.name,
                coverImage: getImg(p.imgKey),
                views: Math.floor(Math.random() * 1000)
            },
        });
        console.log(`Processed: ${p.title}`);
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
