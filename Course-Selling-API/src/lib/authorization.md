# Authorization Rules

**Important:** Authorization logic belongs in route handlers/middleware, NOT in Zod validators.

## Permission Matrix

| Action | Student | Instructor |
|--------|---------|------------|
| Create course | ❌ | ✅ |
| Update course | ❌ | ✅ (own only) |
| Delete course | ❌ | ✅ (own only) |
| Add lesson | ❌ | ✅ (own course) |
| Purchase | ✅ | ❌ |

## Implementation Guide

### 1. Create Course
- Middleware: `requireAuth` + `requireInstructor`
- No ownership check needed (creating new course)

### 2. Update Course
- Middleware: `requireAuth` + `requireInstructor` + `requireCourseOwnership`
- Ensures instructor owns the course

### 3. Delete Course
- Middleware: `requireAuth` + `requireInstructor` + `requireCourseOwnership`
- Ensures instructor owns the course

### 4. Add Lesson
- Middleware: `requireAuth` + `requireInstructor` + `requireCourseOwnership`
- Ensures instructor owns the course (lessons belong to courses)

### 5. Purchase
- Middleware: `requireAuth` + `requireStudent`
- Students cannot purchase courses (instructors don't purchase)

## Middleware Usage Examples

```ts
// Create course (instructor only)
app.post("/courses", requireAuth, requireInstructor, async (c) => {
  const user = c.get("user"); // user.role === "INSTRUCTOR"
  // Create course with userId = user.id
});

// Update course (instructor, own only)
app.put("/courses/:courseId", requireAuth, requireInstructor, requireCourseOwnership, async (c) => {
  const user = c.get("user");
  const course = c.get("course"); // Already verified as owned by user
  // Update course
});

// Purchase (student only)
app.post("/purchases", requireAuth, requireStudent, async (c) => {
  const user = c.get("user"); // user.role === "STUDENT"
  // Create purchase with userId = user.id
});
```
