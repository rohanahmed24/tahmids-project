const DEFAULT_AUTHOR_AVATAR = "/imgs/default-avatar.svg";

export const authors = [
    {
        name: "Sarah Jenkins",
        role: "Design Lead",
        bio: "Exploring the intersection of design and humanity.",
        img: DEFAULT_AUTHOR_AVATAR
    },
    {
        name: "David Miller",
        role: "Tech Journalist",
        bio: "Reporting on the future of AI and robotics.",
        img: DEFAULT_AUTHOR_AVATAR
    },
    {
        name: "Emily Rose",
        role: "Cultural Critic",
        bio: "Writing about movies, music, and modern life.",
        img: DEFAULT_AUTHOR_AVATAR
    },
    {
        name: "James L.",
        role: "Architect",
        bio: "Designing sustainable homes for tomorrow.",
        img: DEFAULT_AUTHOR_AVATAR
    },
];

export function getAuthorByName(name?: string | null) {
    const safeName = typeof name === "string" ? name.trim() : "";
    if (!safeName) {
        return {
            name: "Anonymous",
            role: "",
            bio: "",
            img: DEFAULT_AUTHOR_AVATAR
        };
    }

    const found = authors.find(author => author.name.toLowerCase() === safeName.toLowerCase());
    if (found) return found;
    
    // Return dynamic author object for custom author names
    return {
        name: safeName,
        role: "",
        bio: "",
        img: DEFAULT_AUTHOR_AVATAR
    };
}
