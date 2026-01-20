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
    role: 'user' | 'admin';
    created_at: string;
    updated_at?: string;
    image?: string;
    email_verified?: string | null;
    article_count?: number;
    // Legacy fields for compatibility
    avatar?: string;
    plan?: string;
    status?: string;
    articles?: number;
    joined?: string;
    bio?: string;
}

export interface CurrentUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatar?: string;
    bio?: string;
    role?: string;
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
