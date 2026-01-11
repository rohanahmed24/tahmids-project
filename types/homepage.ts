import { Post } from "@/lib/posts";

// Homepage-specific types
export interface CategoryConfig {
  readonly key: string;
  readonly title: string;
  readonly slug: string;
}

export interface HomepageData {
  hotTopics: Post[];
  recentPosts: Post[];
  categoryData: Record<string, Post[]>;
}

export interface HomepageProps {
  initialData?: HomepageData;
  fallbackMode?: boolean;
}

// Error types for better error handling
export class HomepageDataError extends Error {
  constructor(
    message: string,
    public readonly code: 'FETCH_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'HomepageDataError';
  }
}

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  error?: HomepageDataError;
  retryCount: number;
}

// SEO and metadata types
export interface HomepageMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    type: string;
    image?: string;
  };
}