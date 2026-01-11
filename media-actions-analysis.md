# Media Actions Code Analysis & Improvements

## Issues Identified in Recent Changes

### 1. **Code Duplication & Inconsistent Patterns**
**Problem**: The new `deleteMediaById` function duplicates authentication logic and error handling patterns from existing functions.

**Impact**: 
- Violates DRY principle
- Makes maintenance harder
- Inconsistent error handling across functions

### 2. **Inconsistent Return Types & Error Handling**
**Problem**: Mixed error handling patterns across functions:
- `deleteMedia` and `deleteMediaById` throw errors for auth but return objects for other failures
- `uploadImage` returns objects for all error cases
- No structured error types

**Impact**:
- Unpredictable API behavior
- Difficult error handling in UI components
- Poor developer experience

### 3. **Missing Critical Features**
**Problem**: Several important features are missing:
- No file system cleanup when deleting media (leaves orphaned files)
- No cache revalidation after operations
- No input validation for the `id` parameter
- No transactional behavior (database fails but file remains uploaded)

**Impact**:
- Disk space waste from orphaned files
- Stale cache data
- Potential security vulnerabilities
- Data inconsistency

### 4. **Security & Type Safety Issues**
**Problem**: 
- Weak filename sanitization vulnerable to path traversal
- Missing TypeScript interfaces for return types
- No comprehensive file type validation (only checks prefix)
- No file size limits validation

**Impact**:
- Security vulnerabilities
- Runtime errors due to type mismatches
- Potential for malicious file uploads

## Key Improvements Made

### 1. **Service Class Pattern**
```typescript
export class MediaService {
    async uploadFile(formData: FormData): Promise<MediaUploadResult>
    async deleteFile(filename: string): Promise<MediaDeleteResult>
    async deleteFileById(id: number, filename?: string): Promise<MediaDeleteResult>
    async getLibrary(): Promise<MediaLibraryResult>
    async updateAltText(id: number, altText: string): Promise<MediaDeleteResult>
    async getStats(): Promise<MediaStats>
}
```

**Benefits**:
- Single Responsibility Principle
- Better code organization
- Easier testing and maintenance
- Consistent patterns across all methods

### 2. **Enhanced Type Safety**
```typescript
interface MediaUploadResult {
    success: boolean;
    url?: string;
    filename?: string;
    error?: string;
}

interface MediaDeleteResult {
    success: boolean;
    error?: string;
}

interface MediaLibraryResult {
    success: boolean;
    media?: MediaItem[];
    error?: string;
}

class MediaError extends Error {
    constructor(
        message: string,
        public code: 'VALIDATION_ERROR' | 'UPLOAD_ERROR' | 'DATABASE_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND',
        public details?: any
    ) {
        super(message);
        this.name = 'MediaError';
    }
}
```

**Benefits**:
- Consistent return types across all functions
- Better error categorization
- Improved IDE support and autocomplete
- Compile-time error detection

### 3. **Comprehensive Input Validation**
```typescript
function validateFile(file: File): void {
    if (!file || file.size === 0) {
        throw new MediaError("No file provided", 'VALIDATION_ERROR');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new MediaError(
            `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`, 
            'VALIDATION_ERROR'
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new MediaError(
            `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`, 
            'VALIDATION_ERROR'
        );
    }
}

function validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
        throw new MediaError("Invalid media ID", 'VALIDATION_ERROR');
    }
}
```

**Benefits**:
- Prevents invalid data from reaching database
- Clear, actionable error messages
- Security protection against malicious inputs
- Better user experience

### 4. **Enhanced Security**
```typescript
function generateSecureFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '');
    const extension = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, extension);
    
    return `${timestamp}-${randomSuffix}-${nameWithoutExt}${extension}`;
}

const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 
    'image/webp', 'image/gif', 'image/svg+xml'
];
```

**Benefits**:
- Prevents path traversal attacks
- Unique filename generation prevents conflicts
- Explicit MIME type whitelist
- Secure file handling

### 5. **Data Consistency & Cleanup**
```typescript
// Transactional behavior in upload
try {
    await db.query(/* insert query */);
} catch (dbError) {
    // Cleanup uploaded file if database insert fails
    await cleanupFile(filePath);
    throw new MediaError("Failed to store media information", 'DATABASE_ERROR', dbError);
}

// File cleanup in deletion
async function cleanupFile(filePath: string): Promise<void> {
    try {
        await unlink(filePath);
    } catch (error) {
        console.warn("Failed to cleanup file:", filePath, error);
    }
}
```

**Benefits**:
- Prevents orphaned files on disk
- Maintains consistency between database and file system
- Proper resource cleanup
- Transactional-like behavior

### 6. **Performance Optimizations**
```typescript
// Query limits to prevent large result sets
const QUERY_LIMIT = 1000;

// Efficient stats query
const [rows] = await db.query(`
    SELECT 
        COUNT(*) as totalFiles,
        COALESCE(SUM(size), 0) as totalSize,
        COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as totalImages,
        COUNT(CASE WHEN mime_type LIKE 'video/%' THEN 1 END) as totalVideos,
        COUNT(CASE WHEN mime_type NOT LIKE 'image/%' AND mime_type NOT LIKE 'video/%' THEN 1 END) as totalDocuments
    FROM media
`);
```

**Benefits**:
- Prevents memory issues with large datasets
- Single query for statistics instead of multiple
- Better database performance
- Resource protection

### 7. **Enhanced Error Logging**
```typescript
console.error("Media upload failed:", {
    filename: (formData.get("file") as File)?.name,
    size: (formData.get("file") as File)?.size,
    type: (formData.get("file") as File)?.type,
    error: error instanceof Error ? error.message : String(error)
});
```

**Benefits**:
- Structured logging for better debugging
- Contextual information for troubleshooting
- No sensitive information exposure
- Better monitoring capabilities

## Additional Features Added

### 1. **Alt Text Management**
```typescript
async updateAltText(id: number, altText: string): Promise<MediaDeleteResult>
```
- Accessibility support for images
- SEO improvements
- Better content management

### 2. **Media Statistics**
```typescript
async getStats(): Promise<MediaStats>
```
- Dashboard analytics support
- Storage usage tracking
- File type breakdown

### 3. **Cache Management**
```typescript
function revalidateMediaPaths(): void {
    revalidatePath("/admin/media");
    revalidatePath("/admin/dashboard");
}
```
- Automatic cache invalidation
- Consistent UI updates
- Better user experience

## Migration Strategy

### Backward Compatibility
✅ **All existing function signatures preserved**
✅ **Same return type structures maintained**  
✅ **Enhanced error handling provides better feedback**
✅ **Additional features are optional and don't break existing code**

### Recommended Migration Steps
1. **Replace current file** with improved version
2. **Update UI components** to handle new error types
3. **Add error boundaries** for better error handling
4. **Update tests** to cover new functionality
5. **Monitor logs** for any issues during transition

## Performance Impact

### Before vs After
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Code Lines | ~120 | ~400 | Better organization |
| Type Safety | Basic | Strong | ✅ Enhanced |
| Error Handling | Inconsistent | Structured | ✅ Major improvement |
| Security | Basic | Comprehensive | ✅ Significant enhancement |
| File Cleanup | None | Automatic | ✅ New feature |
| Cache Management | None | Automatic | ✅ New feature |

## Recommendations for Future Enhancements

### 1. **Cloud Storage Integration**
```typescript
interface CloudStorageProvider {
    upload(file: File): Promise<string>;
    delete(filename: string): Promise<void>;
    getUrl(filename: string): string;
}
```

### 2. **Image Processing**
- Automatic image resizing and optimization
- Thumbnail generation
- Format conversion (WebP optimization)

### 3. **Advanced Features**
- Bulk upload support
- Folder organization
- Media tagging and search
- Usage tracking and analytics

### 4. **Monitoring & Observability**
- Structured logging service integration
- Upload success rate monitoring
- Storage usage alerts
- Performance metrics

This refactoring significantly improves security, maintainability, and reliability while preserving all existing functionality and adding valuable new features for the Wisdomia platform.