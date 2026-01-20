# Posts Actions Refactoring - Requirements

## Overview
Refactor the `actions/posts.ts` file to improve code quality, maintainability, and adherence to best practices while maintaining existing functionality.

## User Stories

### 1. As a developer, I want consistent cache invalidation
**Acceptance Criteria:**
- 1.1 All cache invalidation logic is centralized in a single reusable function
- 1.2 All post mutation functions use the same cache invalidation pattern
- 1.3 The `revalidateTag()` API is used correctly (single parameter only)
- 1.4 Cache tags are defined as constants to prevent typos

### 2. As a developer, I want better separation of concerns
**Acceptance Criteria:**
- 2.1 File upload logic is separated from post creation logic
- 2.2 Form data extraction is handled by dedicated utility functions
- 2.3 Authorization checks are consistent across all functions
- 2.4 Database operations are isolated from business logic

### 3. As a developer, I want improved error handling
**Acceptance Criteria:**
- 3.1 All errors include meaningful context about what failed
- 3.2 Database errors are properly typed and handled
- 3.3 File upload errors are caught and reported
- 3.4 Validation errors are distinguished from system errors

### 4. As a developer, I want maintainable configuration
**Acceptance Criteria:**
- 4.1 Magic numbers are replaced with named constants
- 4.2 Default values are defined in a configuration object
- 4.3 File paths are constructed using path utilities
- 4.4 Color values and other defaults are easily changeable

### 5. As a developer, I want type-safe form handling
**Acceptance Criteria:**
- 5.1 Form data extraction has proper type definitions
- 5.2 Optional fields are clearly marked in types
- 5.3 Type guards validate form data before processing
- 5.4 Return types are explicitly defined for all functions

## Technical Constraints

- Must maintain backward compatibility with existing API
- Must not break existing admin dashboard functionality
- Must preserve all current validation logic
- Must maintain current security checks (admin verification)
- Should not introduce new dependencies

## Non-Functional Requirements

- Code should follow Next.js 14+ server actions best practices
- Functions should be testable in isolation
- Performance should not degrade
- File upload functionality must remain secure
