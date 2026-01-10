import { Assets } from "@/lib/assets";

export const authors = [
    {
        name: "Sarah Jenkins",
        role: "Design Lead",
        bio: "Exploring the intersection of design and humanity.",
        img: Assets.imgAvatarImage1
    },
    {
        name: "David Miller",
        role: "Tech Journalist",
        bio: "Reporting on the future of AI and robotics.",
        img: Assets.imgAvatarImage2
    },
    {
        name: "Emily Rose",
        role: "Cultural Critic",
        bio: "Writing about movies, music, and modern life.",
        img: Assets.imgAvatarImage3
    },
    {
        name: "James L.",
        role: "Architect",
        bio: "Designing sustainable homes for tomorrow.",
        img: Assets.imgAvatarImage4
    },
];

export function getAuthorByName(name: string) {
    return authors.find(author => author.name === name) || authors[0];
}
