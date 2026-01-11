import { getHotTopics, getRecentPosts, getPostsByCategories } from "@/lib/posts";
import { HomepageData, HomepageDataError, CategoryConfig } from "@/types/homepage";

// Service class for homepage data management
export class HomepageService {
  private static readonly CATEGORIES: readonly CategoryConfig[] = [
    { key: 'Politics', title: 'Politics', slug: 'politics' },
    { key: 'Mystery', title: 'Mystery', slug: 'mystery' },
    { key: 'Crime', title: 'Crime', slug: 'crime' },
    { key: 'History', title: 'History', slug: 'history' },
    { key: 'News', title: 'Breaking News', slug: 'news' },
    { key: 'Science', title: 'Science', slug: 'science' },
  ] as const;

  private static readonly TIMEOUT_MS = 5000; // 5 second timeout

  static getCategories(): readonly CategoryConfig[] {
    return this.CATEGORIES;
  }

  static async fetchHomepageData(): Promise<HomepageData> {
    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new HomepageDataError(
            'Homepage data fetch timeout',
            'TIMEOUT_ERROR'
          ));
        }, this.TIMEOUT_MS);
      });

      // Race between data fetching and timeout
      const dataPromise = this.fetchDataWithRetry();
      
      return await Promise.race([dataPromise, timeoutPromise]);
      
    } catch (error) {
      console.error("Homepage data fetch failed:", error);
      
      if (error instanceof HomepageDataError) {
        throw error;
      }
      
      throw new HomepageDataError(
        'Failed to fetch homepage data',
        'FETCH_ERROR',
        error
      );
    }
  }

  private static async fetchDataWithRetry(maxRetries: number = 2): Promise<HomepageData> {
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Parallel data fetching with proper error handling
        const [hotTopics, recentPosts, categoryData] = await Promise.allSettled([
          getHotTopics(6), // Limit to 6 for performance
          getRecentPosts(12), // Get more recent posts for various sections
          getPostsByCategories(this.CATEGORIES.map(c => c.key), 4) // 4 per category
        ]);

        // Process results and handle partial failures
        const processedData: HomepageData = {
          hotTopics: hotTopics.status === 'fulfilled' ? hotTopics.value : [],
          recentPosts: recentPosts.status === 'fulfilled' ? recentPosts.value : [],
          categoryData: categoryData.status === 'fulfilled' ? categoryData.value : {}
        };

        // Validate that we have at least some data
        if (this.validateHomepageData(processedData)) {
          return processedData;
        }
        
        throw new HomepageDataError(
          'Insufficient data returned from database',
          'VALIDATION_ERROR'
        );
        
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          console.warn(`Homepage data fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        }
      }
    }
    
    throw lastError;
  }

  private static validateHomepageData(data: HomepageData): boolean {
    // Ensure we have at least some content to display
    return (
      Array.isArray(data.hotTopics) &&
      Array.isArray(data.recentPosts) &&
      typeof data.categoryData === 'object' &&
      (data.hotTopics.length > 0 || data.recentPosts.length > 0)
    );
  }

  static getFallbackData(): HomepageData {
    return {
      hotTopics: [],
      recentPosts: [],
      categoryData: {}
    };
  }

  // Cache management (could be extended with Redis in production)
  private static cache = new Map<string, { data: HomepageData; timestamp: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static async getCachedHomepageData(): Promise<HomepageData> {
    const cacheKey = 'homepage-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    
    const data = await this.fetchHomepageData();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}