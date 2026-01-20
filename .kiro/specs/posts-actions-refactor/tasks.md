# Posts Actions Refactoring - Implementation Tasks

## Task List

- [ ] 1. Add constants and configuration
  - [ ] 1.1 Add CACHE_TAGS constant object
  - [ ] 1.2 Add POST_CONFIG constant object
  - [ ] 1.3 Export constants for reuse in other files

- [ ] 2. Create utility functions
  - [ ] 2.1 Implement `invalidatePostCaches()` function
  - [ ] 2.2 Implement `PostActionError` class
  - [ ] 2.3 Implement `handlePrismaError()` function
  - [ ] 2.4 Enhance `handleFileUpload()` with validation
  - [ ] 2.5 Create `extractPostFormData()` utility

- [ ] 3. Fix immediate bug in deletePost()
  - [ ] 3.1 Remove invalid second parameter from revalidateTag() calls in deletePost()
  - [ ] 3.2 Replace with invalidatePostCaches() call

- [ ] 4. Refactor createPost() function
  - [ ] 4.1 Use extractPostFormData() for form extraction
  - [ ] 4.2 Use POST_CONFIG constants
  - [ ] 4.3 Use invalidatePostCaches() for cache invalidation
  - [ ] 4.4 Use handlePrismaError() for error handling

- [ ] 5. Refactor updatePost() function
  - [ ] 5.1 Use extractPostFormData() for form extraction
  - [ ] 5.2 Use POST_CONFIG constants
  - [ ] 5.3 Use invalidatePostCaches() for cache invalidation
  - [ ] 5.4 Use handlePrismaError() for error handling

- [ ] 6. Refactor togglePostStatus() function
  - [ ] 6.1 Use invalidatePostCaches() for cache invalidation
  - [ ] 6.2 Use handlePrismaError() for error handling
  - [ ] 6.3 Use POST_CONFIG constants for paths

- [ ] 7. Add type definitions
  - [ ] 7.1 Create PostFormData interface
  - [ ] 7.2 Add FileUploadOptions interface
  - [ ] 7.3 Add explicit return types to all functions

- [ ] 8. Write unit tests
  - [ ] 8.1 Test extractPostFormData() with various inputs
  - [ ] 8.2 Test generateSlug() with edge cases
  - [ ] 8.3 Test handleFileUpload() validation
  - [ ] 8.4 Test PostActionError creation

- [ ] 9. Write integration tests
  - [ ] 9.1 Test createPost() full flow
  - [ ] 9.2 Test updatePost() with file upload
  - [ ] 9.3 Test deletePost() cache invalidation
  - [ ] 9.4 Test authorization failures

- [ ] 10. Update documentation
  - [ ] 10.1 Add JSDoc comments to all public functions
  - [ ] 10.2 Document error codes and handling
  - [ ] 10.3 Add usage examples in comments

## Task Details

### Task 1.1: Add CACHE_TAGS constant object
Create a constant object containing all cache tag strings used in the application.

**Implementation**:
```typescript
const CACHE_TAGS = {
  POSTS: 'posts',
  STATS: 'stats',
  HOT_TOPICS: 'hot-topics',
  RECENT: 'recent',
  FEATURED: 'featured',
} as const;
```

### Task 1.2: Add POST_CONFIG constant object
Create a configuration object for all magic numbers and strings.

**Implementation**:
```typescript
const POST_CONFIG = {
  EXCERPT_LENGTH: 200,
  DEFAULT_ACCENT_COLOR: '#3B82F6',
  UPLOAD_DIR: 'public/imgs/uploads',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ROUTES: {
    ADMIN_DASHBOARD: '/admin/dashboard',
    HOME: '/',
  },
} as const;
```

### Task 2.1: Implement invalidatePostCaches() function
Create a centralized function for cache invalidation.

**Implementation**:
```typescript
function invalidatePostCaches(): void {
  revalidateTag(CACHE_TAGS.POSTS);
  revalidateTag(CACHE_TAGS.STATS);
  revalidateTag(CACHE_TAGS.HOT_TOPICS);
  revalidateTag(CACHE_TAGS.RECENT);
  revalidateTag(CACHE_TAGS.FEATURED);
}
```

### Task 3.1: Fix deletePost() revalidateTag bug
The deletePost() function currently uses an invalid second parameter 'max' in revalidateTag() calls.

**Current Code** (Lines 121-125):
```typescript
revalidateTag('posts', 'max');
revalidateTag('stats', 'max');
revalidateTag('hot-topics', 'max');
revalidateTag('recent', 'max');
revalidateTag('featured', 'max');
```

**Fixed Code**:
```typescript
invalidatePostCaches();
```

### Task 4.1: Use extractPostFormData() in createPost()
Replace manual form data extraction with utility function.

**Before**:
```typescript
const title = formData.get("title") as string;
const content = formData.get("content") as string;
// ... 10+ more lines
```

**After**:
```typescript
const postData = extractPostFormData(formData, { authorName: session.name });
```

### Task 8.2: Test generateSlug() with edge cases
Test the slug generation function with various inputs.

**Test Cases**:
- Empty string
- Special characters
- Unicode characters
- Very long strings
- Strings with multiple spaces
- Strings starting/ending with hyphens

## Priority Order

1. **Critical**: Task 3 (Fix immediate bug)
2. **High**: Tasks 1-2 (Add infrastructure)
3. **High**: Tasks 4-6 (Refactor functions)
4. **Medium**: Task 7 (Type definitions)
5. **Medium**: Tasks 8-9 (Testing)
6. **Low**: Task 10 (Documentation)

## Estimated Effort

- Task 1: 15 minutes
- Task 2: 45 minutes
- Task 3: 10 minutes
- Task 4: 30 minutes
- Task 5: 30 minutes
- Task 6: 20 minutes
- Task 7: 20 minutes
- Task 8: 60 minutes
- Task 9: 90 minutes
- Task 10: 30 minutes

**Total**: ~5.5 hours
