import { Assets } from "@/lib/assets";
import { StaticImageData } from "next/image";

export interface Article {
    id: number | string;
    title: string;
    author: string;
    date: string;
    img: string | StaticImageData;
    category: string;
    slug: string;
    topicSlug?: string | null;
    accent?: string;
    subtitle?: string;
}

export const hotTopics: Article[] = [
    {
        id: 1,
        title: "The Art of Digital Silence",
        subtitle: "Exploring minimalism in the age of noise",
        category: "Technology",
        img: Assets.imgPlaceholderImage7,
        slug: "slow-interfaces",
        accent: "from-purple-600/80 to-blue-600/80",
        author: "Sarah Jenkins",
        date: "Dec 24",
    },
    {
        id: 2,
        title: "Building a Digital Garden",
        subtitle: "Creating spaces for thought to grow",
        category: "Philosophy",
        img: Assets.imgPlaceholderImage5,
        slug: "digital-garden",
        accent: "from-emerald-600/80 to-teal-600/80",
        author: "John Smith",
        date: "Dec 23",
    },
    {
        id: 3,
        title: "The Ethics of AI",
        subtitle: "Navigating the moral landscape of intelligence",
        category: "AI & Future",
        img: Assets.imgArticleAiEthics,
        slug: "ai-ethics",
        accent: "from-red-600/80 to-orange-600/80",
        author: "David Miller",
        date: "Dec 15",
    },
    {
        id: 4,
        title: "Cities of Tomorrow",
        subtitle: "Architecture reimagined for the future",
        category: "Future Tech",
        img: Assets.imgArticleFutureCities,
        slug: "future-cities",
        accent: "from-cyan-600/80 to-blue-600/80",
        author: "James L.",
        date: "Dec 14",
    },
    {
        id: 5,
        title: "Mindful Living",
        subtitle: "The psychology of presence",
        category: "Psychology",
        img: Assets.imgStoryScience,
        slug: "mindful-living",
        accent: "from-amber-600/80 to-yellow-600/80",
        author: "Emily Rose",
        date: "Dec 13",
    },
];

export const articles: Article[] = [
    { id: 1, title: "The quiet revolution of slow interfaces", author: "Sarah Jenkins", date: "Dec 24", img: Assets.imgArticleBreakout, category: "Design", slug: "slow-interfaces", topicSlug: "design-culture" },
    { id: 2, title: "Why we need less information, not more", author: "David Miller", date: "Dec 23", img: Assets.imgStoryHistory, category: "Tech", slug: "less-information", topicSlug: "technology-ai" },
    { id: 3, title: "Building a digital garden for the mind", author: "John Smith", date: "Dec 22", img: Assets.imgArticleHero, category: "Philosophy", slug: "digital-garden", topicSlug: null },
    { id: 4, title: "The Ethics of Artificial Intelligence", author: "David Miller", date: "Dec 15", img: Assets.imgArticleAiEthics, category: "Technology", slug: "ai-ethics", topicSlug: "technology-ai" },
    { id: 5, title: "Cities of Tomorrow", author: "James L.", date: "Dec 14", img: Assets.imgArticleFutureCities, category: "Future Tech", slug: "future-cities", topicSlug: "future-tech" },
    { id: 6, title: "The Art of Mindful Living", author: "Emily Rose", date: "Dec 13", img: Assets.imgStoryScience, category: "Psychology", slug: "mindful-living", topicSlug: "psychology" },
    { id: 7, title: "The Creative Process Unveiled", author: "Sarah Jenkins", date: "Dec 12", img: Assets.imgStoryArt, category: "Design", slug: "creative-process", topicSlug: "design-culture" },
    { id: 8, title: "The Remote Work Revolution", author: "David Miller", date: "Dec 11", img: Assets.imgStoryCulture, category: "Culture", slug: "remote-work", topicSlug: "design-culture" },
    { id: 9, title: "Understanding Modern Architecture", author: "Sarah Jenkins", date: "Dec 10", img: Assets.imgArticleBreakout, category: "Design", slug: "modern-architecture", topicSlug: "design-culture" },
    { id: 10, title: "The Future of Work and Automation", author: "David Miller", date: "Dec 9", img: Assets.imgStoryHistory, category: "Tech", slug: "future-work", topicSlug: "technology-ai" },
    { id: 11, title: "Meditation and Mental Health", author: "Emily Rose", date: "Dec 8", img: Assets.imgStoryScience, category: "Psychology", slug: "meditation", topicSlug: "psychology" },
    { id: 12, title: "Sustainable Living in Urban Spaces", author: "James L.", date: "Dec 7", img: Assets.imgArticleFutureCities, category: "Lifestyle", slug: "sustainable-living", topicSlug: "future-tech" },
];

export const breakingNews: Article[] = [
    { id: "01", category: "Design", title: "The quiet revolution of slow interfaces", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Sarah Jenkins", date: "Dec 24" },
    { id: "02", category: "Tech", title: "Why we need less information, not more", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "David Miller", date: "Dec 23" },
    { id: "03", category: "Philosophy", title: "Building a digital garden for the mind", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "John Smith", date: "Dec 22" },
    { id: "04", category: "Technology", title: "The Ethics of Artificial Intelligence", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "David Miller", date: "Dec 15" },
    { id: "05", category: "Science", title: "The Science of Sleep: Why Rest Matters", img: Assets.imgStoryCulture, slug: "science-sleep", author: "Emily Rose", date: "Dec 9" },
    { id: "06", category: "Lifestyle", title: "Mindful Living in a Digital Age", img: Assets.imgStoryScience, slug: "mindful-living", author: "Sarah Jenkins", date: "Dec 18" },
    { id: "07", category: "Future Tech", title: "Cities of Tomorrow: Reimagining Urban Life", img: Assets.imgStoryArt, slug: "future-cities", author: "James L.", date: "Dec 14" },
    { id: "08", category: "Culture", title: "The Creative Process Unveiled", img: Assets.imgStoryHistory, slug: "creative-process", author: "Sarah Jenkins", date: "Dec 12" },
    { id: "09", category: "Design", title: "Minimalism in Modern Design", img: Assets.imgPlaceholderImage1, slug: "minimalism-design", author: "Sarah Jenkins", date: "Dec 11" },
    { id: "10", category: "Tech", title: "Blockchain and the Future", img: Assets.imgPlaceholderImage2, slug: "blockchain-future", author: "David Miller", date: "Dec 10" },
    { id: "11", category: "Science", title: "Climate Change Solutions", img: Assets.imgStoryCulture, slug: "climate-solutions", author: "Emily Rose", date: "Dec 9" },
    { id: "12", category: "Culture", title: "The Art of Storytelling", img: Assets.imgStoryHistory, slug: "art-storytelling", author: "John Smith", date: "Dec 8" },
];

export const categoryData = {
    politics: {
        title: "Politics",
        slug: "politics",
        articles: [
            { id: "p1", title: "The Changing Landscape of Global Democracy", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "John Smith", date: "Dec 20", category: "Politics" },
            { id: "p2", title: "Election Reforms: What's Next for Voting Rights", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Sarah Lee", date: "Dec 18", category: "Politics" },
            { id: "p3", title: "International Relations in the Modern Era", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Mike Chen", date: "Dec 15", category: "Politics" },
            { id: "p4", title: "The Rise of Political Activism Online", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Emma Wilson", date: "Dec 12", category: "Politics" },
            { id: "p5", title: "Climate Policy and Political Will", img: Assets.imgStoryCulture, slug: "science-sleep", author: "David Miller", date: "Dec 10", category: "Politics" },
            { id: "p6", title: "Understanding Political Polarization", img: Assets.imgStoryScience, slug: "mindful-living", author: "Lisa Park", date: "Dec 8", category: "Politics" },
        ]
    },
    mystery: {
        title: "Mystery",
        slug: "mystery",
        articles: [
            { id: "m1", title: "The Bermuda Triangle: Science vs Legend", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "James Wright", date: "Dec 22", category: "Mystery" },
            { id: "m2", title: "Unsolved: The Zodiac Killer's Final Cipher", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Rachel Green", date: "Dec 19", category: "Mystery" },
            { id: "m3", title: "Ancient Mysteries of the Pyramids", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Tom Baker", date: "Dec 16", category: "Mystery" },
            { id: "m4", title: "The Lost City of Atlantis: Myth or Reality?", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Nina Patel", date: "Dec 13", category: "Mystery" },
            { id: "m5", title: "Mysterious Disappearances That Baffled Experts", img: Assets.imgStoryArt, slug: "future-cities", author: "Alex Kim", date: "Dec 11", category: "Mystery" },
            { id: "m6", title: "The Oak Island Money Pit Mystery", img: Assets.imgStoryHistory, slug: "creative-process", author: "Chris Evans", date: "Dec 9", category: "Mystery" },
        ]
    },
    crime: {
        title: "Crime",
        slug: "crime",
        articles: [
            { id: "c1", title: "Inside the Mind of Criminal Profilers", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Dr. Sarah Chen", date: "Dec 21", category: "Crime" },
            { id: "c2", title: "The Evolution of Forensic Science", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Mark Johnson", date: "Dec 18", category: "Crime" },
            { id: "c3", title: "Cybercrime: The New Frontier of Law Enforcement", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Tech Weekly", date: "Dec 15", category: "Crime" },
            { id: "c4", title: "Cold Cases Solved by Modern DNA Technology", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Jane Foster", date: "Dec 12", category: "Crime" },
            { id: "c5", title: "The Psychology Behind White Collar Crime", img: Assets.imgStoryCulture, slug: "science-sleep", author: "Prof. Williams", date: "Dec 10", category: "Crime" },
            { id: "c6", title: "True Crime Podcasts: Entertainment or Education?", img: Assets.imgStoryScience, slug: "mindful-living", author: "Media Watch", date: "Dec 8", category: "Crime" },
        ]
    },
    history: {
        title: "History",
        slug: "history",
        articles: [
            { id: "h1", title: "The Rise and Fall of Ancient Empires", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Prof. Anderson", date: "Dec 23", category: "History" },
            { id: "h2", title: "World War II: Stories Never Told", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Military History", date: "Dec 20", category: "History" },
            { id: "h3", title: "The Renaissance: Art, Science, and Revolution", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Art Institute", date: "Dec 17", category: "History" },
            { id: "h4", title: "Industrial Revolution: How It Changed Everything", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Economic Times", date: "Dec 14", category: "History" },
            { id: "h5", title: "Ancient Civilizations and Their Legacies", img: Assets.imgStoryArt, slug: "future-cities", author: "Archaeology Today", date: "Dec 11", category: "History" },
            { id: "h6", title: "The Space Race: A Cold War Story", img: Assets.imgStoryHistory, slug: "creative-process", author: "NASA Archives", date: "Dec 9", category: "History" },
        ]
    },
    news: {
        title: "Breaking News",
        slug: "news",
        articles: [
            { id: "n1", title: "Global Markets React to Economic Shifts", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Finance Desk", date: "Today", category: "News" },
            { id: "n2", title: "Climate Summit: World Leaders Make New Pledges", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "Environment", date: "Today", category: "News" },
            { id: "n3", title: "Tech Giants Face New Regulatory Challenges", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Tech News", date: "Yesterday", category: "News" },
            { id: "n4", title: "Healthcare Innovation: Breakthrough Treatments", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Health Desk", date: "Yesterday", category: "News" },
            { id: "n5", title: "Sports: Championship Finals Draw Record Viewers", img: Assets.imgStoryCulture, slug: "science-sleep", author: "Sports Desk", date: "2 days ago", category: "News" },
            { id: "n6", title: "Entertainment: Award Season Predictions", img: Assets.imgStoryScience, slug: "mindful-living", author: "Entertainment", date: "2 days ago", category: "News" },
        ]
    },
    science: {
        title: "Science",
        slug: "science",
        articles: [
            { id: "s1", title: "James Webb Telescope: New Discoveries Unveiled", img: Assets.imgStoryScience, slug: "science-sleep", author: "NASA", date: "Dec 22", category: "Science" },
            { id: "s2", title: "The Future of Quantum Computing", img: Assets.imgPlaceholderImage1, slug: "slow-interfaces", author: "Tech Labs", date: "Dec 19", category: "Science" },
            { id: "s3", title: "Climate Science: Understanding the Data", img: Assets.imgPlaceholderImage2, slug: "less-information", author: "IPCC", date: "Dec 16", category: "Science" },
            { id: "s4", title: "Neuroscience: Mapping the Human Brain", img: Assets.imgPlaceholderImage3, slug: "digital-garden", author: "Brain Institute", date: "Dec 13", category: "Science" },
            { id: "s5", title: "Gene Editing: CRISPR's Next Frontier", img: Assets.imgPlaceholderImage4, slug: "ai-ethics", author: "Bio Weekly", date: "Dec 10", category: "Science" },
            { id: "s6", title: "Renewable Energy Breakthroughs", img: Assets.imgStoryCulture, slug: "mindful-living", author: "Green Tech", date: "Dec 8", category: "Science" },
        ]
    },
};
