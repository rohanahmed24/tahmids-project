export interface Article {
    id: number;
    title: string;
    author: string;
    category: string;
    status: string;
    views: number;
    date: string;
    img: string;
    slug: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    plan: string;
    status: string;
    articles: number;
    joined: string;
}

export interface Stat {
    id: number;
    label: string;
    value: string;
    change: string;
    trend: string;
    iconName: string;
    color: string;
    bgColor: string;
}

export interface SiteSettings {
    siteName: string;
    siteDescription: string;
}
