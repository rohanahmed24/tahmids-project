# Posts Actions Refactoring - Design Document

## Architecture Overview

This refactoring will transform `actions/posts.ts` from a monolithic file into a well-structured module with clear separation of concerns, following the Single Responsibility Principle and DRY principles.

## Design Decisions

### 1. Cache Invalidation Abstraction

**Problem**: Repetitive cache invalidation code across 4 functions.

**Solution**: Create a centralized cache invalidation utility.

```typescript
// Constants for cache tags
const CACHE_TAGS = {
  POSTS: 'posts',
  STATS: 'stats',
  HOT_TOPICS: 'hot-topics',
  RECENT: 'recent',
  FEATURED: 'featured',
} as const;

// Centralized invalidation function
function invalidatePostCaches() {
  revalidateTag(CACHE_TAGS.POSTS);
  revalidateTag(CACHE_TAGS.STATS);
  revalidateTag(CACHE_TAGS.HOT_TOPICS);
  revalidateTag(CACHE_TAGS.RECENT);
  revalidateTag(CACHE_TAGS.FEATURED);
}
```

**Benefits**:
- Single source of truth for cache invalidation
- Easy to add/remove cache tags
- Prevents typos in tag names
- Reduces code duplication by ~20 lines

### 2. Configuration Constants

**Problem**: Magic numbers and strings scattered throughout code.

**Solution**: Define configuration object.

```typescript
const POST_CONFIG = {
  EXCERPT_LENGTH: 200,
  DEFAULT_ACCENT_COLOR: '#3B82F6',
  UPLOAD_DIR: 'public/imgs/uploads',
  ROUTES: {
    ADMIN_DASHBOARD: '/admin/dashboard',
    HOME: '/',
  },
} as const;
```

### 3. Form Data Extraction

**Problem**: Repetitive form data extraction with type casting.

**Solution**: Create typed extraction utilities.

```typescript
interface PostFormData {
  title: string;
  content: string;
  category: string;
  authorName?: string;
  videoUrl?: string;
  subtitle?: string;
  topic_slug?: string;
  accent_color?: string;
  featured: boolean;
  published: boolean;
  slug?: string;
  coverImage?: string;
  coverImageFile?: File;
}

function extractPostFormData(formData: FormData, defaults: Partial<PostFormData> = {}): PostFormData {
  return {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    authorName: (formData.get("authorName") as string) || defaults.authorName,
    videoUrl: (formData.get("videoUrl") as string) || undefined,
    subtitle: (formData.get("subtitle") as string) || undefined,
    topic_slug: (formData.get("topic_slug") as string) || undefined,
    accent_color: (formData.get("accent_color") as string) || POST_CONFIG.DEFAULT_ACCENT_COLOR,
    featured: formData.get("featured") === "true",
    published: formData.get("published") !== "false",
    slug: (formData.get("slug") as string) || undefined,
    coverImage: (formData.get("coverImage") as string) || undefined,
    coverImageFile: formData.get("coverImageFile") as File,
  };
}
```

### 4. Error Handling Strategy

**Problem**: Inconsistent error messages and handling.

**Solution**: Define error types and consistent error handling.

```typescript
class PostActionError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'DUPLICATE' | 'VALIDATION' | 'SYSTEM',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'PostActionError';
  }
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new PostActionError(
        'A story with this title/slug already exists. Please change the title.',
        'DUPLICATE',
        error
      );
    }
    if (error.code === 'P2025') {
      throw new PostActionError('Post not found', 'NOT_FOUND', error);
    }
  }
  console.error('Database error:', error);
  throw new PostActionError('Database operation failed', 'SYSTEM', error);
}
```

### 5. Authorization Middleware Pattern

**Problem**: Repeated authorization checks in every function.

**Solution**: Create a higher-order function for admin actions.

```typescript
async function withAdminAuth<T>(
  action: () => Promise<T>
): Promise<T> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new PostActionError('Unauthorized', 'UNAUTHORIZED');
  }
  return action();
}
```

### 6. File Upload Improvements

**Problem**: File upload logic mixed with post creation.

**Solution**: Enhanced file upload utility with validation.

```typescript
interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

async function handleFileUpload(
  file: File | null,
  options: FileUploadOptions = {}
): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;

  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/'] } = options;

  // Validate file size
  if (file.size > maxSize) {
    throw new PostActionError(
      `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
      'VALIDATION'
    );
  }

  // Validate file type
  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    throw new PostActionError(
      `File type ${file.type} not allowed`,
      'VALIDATION'
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  const uploadDir = path.join(process.cwd(), POST_CONFIG.UPLOAD_DIR);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/imgs/uploads/${filename}`;
}
```

## Refactored Structure

```
actions/posts.ts
├── Constants
│   ├── CACHE_TAGS
│   └── POST_CONFIG
├── Types
│   ├── PostFormData
│   └── PostActionError
├── Utilities
│   ├── invalidatePostCaches()
│   ├── extractPostFormData()
│   ├── handleFileUpload()
│   ├── generateSlug()
│   ├── handlePrismaError()
│   └── withAdminAuth()
└── Public Actions
    ├── createPost()
    ├── updatePost()
    ├── deletePost()
    └── togglePostStatus()
```

## Implementation Strategy

### Phase 1: Add Utilities (Non-Breaking)
1. Add constants at top of file
2. Add utility functions
3. Add error handling utilities

### Phase 2: Refactor Functions
1. Update `createPost()` to use utilities
2. Update `updatePost()` to use utilities
3. Update `deletePost()` to use utilities (fix inconsistent revalidateTag usage)
4. Update `togglePostStatus()` to use utilities

### Phase 3: Testing & Validation
1. Test all CRUD operations
2. Verify cache invalidation works
3. Test error scenarios
4. Verify file uploads work

## Performance Considerations

- No performance degradation expected
- File upload validation prevents large file processing
- Cache invalidation remains the same
- Database queries unchanged

## Security Considerations

- File upload validation prevents malicious files
- File size limits prevent DoS attacks
- Authorization checks remain intact
- Error messages don't leak sensitive information

## Backward Compatibility

All public function signatures remain unchanged:
- `createPost(formData: FormData)`
- `updatePost(originalSlug: string, formData: FormData)`
- `deletePost(slug: string)`
- `togglePostStatus(slug: string, published: boolean)`

## Testing Strategy

### Unit Tests
- Test `extractPostFormData()` with various inputs
- Test `generateSlug()` with edge cases
- Test `handleFileUpload()` with invalid files
- Test error handling utilities

### Integration Tests
- Test full post creation flow
- Test post update with file upload
- Test cache invalidation
- Test authorization failures

## Correctness Properties

### Property 1: Cache Consistency
**Description**: After any post mutation, all related caches must be invalidated.

**Formal Property**: 
```
∀ mutation ∈ {create, update, delete, toggleStatus}:
  mutation(post) ⟹ invalidated(CACHE_TAGS.*)
```

**Test Strategy**: Verify cache tags are called after each mutation.

### Property 2: Authorization Invariant
**Description**: No post mutation can succeed without admin authorization.

**Formal Property**:
```
∀ mutation ∈ {create, update, delete, toggleStatus}:
  ¬isAdmin(user) ⟹ throws(PostActionError('UNAUTHORIZED'))
```

**Test Strategy**: Attempt mutations with non-admin users.

### Property 3: Slug Uniqueness
**Description**: No two posts can have the same slug.

**Formal Property**:
```
∀ post1, post2 ∈ Posts:
  post1.slug = post2.slug ⟹ post1.id = post2.id
```

**Test Strategy**: Attempt to create posts with duplicate slugs.

### Property 4: File Upload Safety
**Description**: Only valid files within size limits can be uploaded.

**Formal Property**:
```
∀ file: upload(file) ⟹ 
  (file.size ≤ maxSize) ∧ 
  (file.type ∈ allowedTypes)
```

**Test Strategy**: Test with oversized files and invalid types.

## Migration Path

1. Deploy refactored code (backward compatible)
2. Monitor for errors in production
3. Verify cache invalidation works correctly
4. No database migrations needed
5. No API changes needed

## Future Enhancements

- Add input validation using Zod or similar
- Add rate limiting for post creation
- Add image optimization pipeline
- Add post versioning/history
- Add bulk operations support
