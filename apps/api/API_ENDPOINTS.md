# EngRisk Learning Platform API Documentation

## Overview
This document describes the REST API endpoints for the EngRisk Learning Platform, which provides comprehensive CRUD operations for managing students, classes, lessons, and activities.

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Users Management
**Base Path:** `/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| POST | `/users` | Create a new user | Yes |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |
| GET | `/users/teachers/list` | Get all teachers | Yes |
| GET | `/users/students/list` | Get all students | Yes |

### Students Management
**Base Path:** `/students`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/students` | Get all students with pagination | Yes |
| GET | `/students/list` | Get all students (simple list) | Yes |
| GET | `/students/:id` | Get student by ID | Yes |
| POST | `/students` | Create a new student | Yes |
| PUT | `/students/:id` | Update student | Yes |
| DELETE | `/students/:id` | Delete student | Yes |
| GET | `/students/:id/classes` | Get classes where student is enrolled | Yes |
| GET | `/students/:id/activities` | Get activities completed by student | Yes |
| GET | `/students/:id/progress` | Get student learning progress | Yes |
| POST | `/students/:id/enroll/:classId` | Enroll student in a class | Yes |
| DELETE | `/students/:id/unenroll/:classId` | Unenroll student from a class | Yes |

### Teachers Management
**Base Path:** `/teachers`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/teachers` | Get all teachers with pagination | Yes |
| GET | `/teachers/list` | Get all teachers (simple list) | Yes |
| GET | `/teachers/:id` | Get teacher by ID | Yes |
| POST | `/teachers` | Create a new teacher | Yes |
| PUT | `/teachers/:id` | Update teacher | Yes |
| DELETE | `/teachers/:id` | Delete teacher | Yes |
| GET | `/teachers/:id/classes` | Get classes taught by teacher | Yes |
| GET | `/teachers/:id/lessons` | Get lessons created by teacher | Yes |
| GET | `/teachers/:id/statistics` | Get teacher statistics | Yes |

### Classes Management
**Base Path:** `/classes`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/classes` | Get all classes with pagination | Yes |
| POST | `/classes` | Create a new class | Yes |
| GET | `/classes/:id` | Get class by ID | Yes |
| PUT | `/classes/:id` | Update class | Yes |
| DELETE | `/classes/:id` | Delete class | Yes |
| GET | `/classes/:id/students` | Get all students in a class | Yes |
| POST | `/classes/:id/students` | Add student to class | Yes |
| DELETE | `/classes/:id/students/:studentId` | Remove student from class | Yes |
| GET | `/classes/teacher/:teacherId` | Get classes by teacher ID | Yes |

### Lessons Management
**Base Path:** `/lessons`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/lessons` | Get all lessons with pagination | Yes |
| POST | `/lessons` | Create a new lesson | Yes |
| GET | `/lessons/:id` | Get lesson by ID | Yes |
| PUT | `/lessons/:id` | Update lesson | Yes |
| DELETE | `/lessons/:id` | Delete lesson | Yes |
| GET | `/lessons/class/:classId` | Get lessons by class ID | Yes |
| GET | `/lessons/teacher/:teacherId` | Get lessons by teacher ID | Yes |
| POST | `/lessons/:id/publish` | Publish lesson | Yes |
| POST | `/lessons/:id/unpublish` | Unpublish lesson | Yes |

### Activities Management
**Base Path:** `/activities`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/activities` | Get all activities | Yes |
| GET | `/activities/lesson/:lessonId` | Get activities by lesson ID | Yes |
| GET | `/activities/type/:type` | Get activities by type | Yes |
| GET | `/activities/difficulty/:difficulty` | Get activities by difficulty | Yes |
| GET | `/activities/:id` | Get activity by ID | Yes |
| POST | `/activities` | Create a new activity | Yes |
| PUT | `/activities/:id` | Update activity | Yes |
| DELETE | `/activities/:id` | Delete activity | Yes |
| POST | `/activities/:id/complete` | Mark activity as completed | Yes |
| GET | `/activities/quiz/questions/:activityId` | Get quiz questions for an activity | Yes |
| GET | `/activities/matching/pairs/:activityId` | Get matching pairs for an activity | Yes |
| GET | `/activities/fill-blanks/:activityId` | Get fill blanks for an activity | Yes |

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Class
```typescript
{
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;
  schedule: string;
  status: 'active' | 'inactive' | 'archived';
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Lesson
```typescript
{
  id: string;
  title: string;
  description: string;
  classId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  status: 'draft' | 'published' | 'archived';
  objectives: string[];
  materials: string[];
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity
```typescript
{
  id: string;
  type: 'quiz' | 'matching' | 'fill-blank' | 'reading' | 'speaking' | 'listening';
  title: string;
  description: string;
  lessonId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  points: number;
  timeLimit?: number;
  isCompleted?: boolean;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Responses

### Standard Error Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Pagination

For endpoints that support pagination, use query parameters:
```
GET /endpoint?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## Testing

### Test Credentials
- **Admin User**: Phone: `0974775124`, Password: `1234`
- **Teacher**: Phone: `0974775120`, Password: `1234`
- **Student**: Phone: `0974775122`, Password: `1234`

### Sample Requests

#### Create a Class
```bash
curl -X POST http://localhost:3000/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Advanced English Grammar",
    "description": "Learn complex grammar concepts",
    "level": "advanced",
    "maxStudents": 15,
    "schedule": "Monday, Wednesday 3:00 PM",
    "teacherId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

#### Create a Lesson
```bash
curl -X POST http://localhost:3000/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "classId": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Past Perfect Tense",
    "description": "Understanding past perfect tense usage",
    "difficulty": "intermediate",
    "duration": 45,
    "objectives": ["Understand past perfect", "Use in context"],
    "materials": ["Grammar book", "Practice exercises"],
    "teacherId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

## Notes
- All timestamps are in ISO 8601 format
- UUIDs are used for all entity IDs
- Phone numbers should be in international format
- Passwords are hashed using bcrypt
- File uploads for avatars and audio are supported via URLs 