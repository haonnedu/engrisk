# 🎓 EngRisk Learning Platform - Complete Project

## 🌟 Project Overview

EngRisk Learning Platform là một hệ thống học tập tiếng Anh toàn diện, được xây dựng với kiến trúc microservices hiện đại. Hệ thống bao gồm Backend API (NestJS + TypeORM) và Frontend (React + TypeScript) với đầy đủ các chức năng CRUD cho quản lý học sinh, lớp học, bài học và hoạt động học tập.

## 🏗️ Architecture

```
engrisk/
├── apps/
│   ├── api/          # Backend API (NestJS)
│   └── web/          # Frontend (React)
├── package.json       # Workspace configuration
└── pnpm-workspace.yaml
```

### Backend Architecture
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL với TypeORM
- **Authentication**: JWT-based
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

### Frontend Architecture
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Routing**: React Router DOM

## 🚀 Features Implemented

### ✅ Backend API (100% Complete)

#### 1. **User Management**
- ✅ CRUD operations cho Users
- ✅ Role-based access control (Student, Teacher, Admin)
- ✅ Authentication & Authorization
- ✅ Pagination support

#### 2. **Classes Management**
- ✅ CRUD operations cho Classes
- ✅ Student enrollment management
- ✅ Teacher-specific class retrieval
- ✅ Class status management (Active, Inactive, Archived)

#### 3. **Lessons Management**
- ✅ CRUD operations cho Lessons
- ✅ Publish/Unpublish functionality
- ✅ Difficulty levels (Beginner, Intermediate, Advanced)
- ✅ Learning objectives và materials

#### 4. **Activities Management**
- ✅ CRUD operations cho Activities
- ✅ Multiple activity types:
  - Quiz (Multiple choice questions)
  - Matching (Word pairs)
  - Fill in the Blank
  - Reading comprehension
  - Speaking practice
  - Listening exercises
- ✅ Difficulty và time management
- ✅ Progress tracking

#### 5. **Student & Teacher Controllers**
- ✅ Dedicated endpoints cho Students
- ✅ Dedicated endpoints cho Teachers
- ✅ Progress tracking
- ✅ Statistics và analytics

### ✅ Frontend (100% Complete)

#### 1. **Core Components**
- ✅ Base UI components (Button, Input, Select, Card, Table, Badge, Textarea)
- ✅ Form components với validation
- ✅ Data display components với pagination
- ✅ Responsive design

#### 2. **Service Layer**
- ✅ API service classes cho tất cả entities
- ✅ HTTP client với authentication
- ✅ Error handling
- ✅ Type-safe API calls

#### 3. **Custom Hooks**
- ✅ React Query integration cho data fetching
- ✅ Caching và state management
- ✅ Optimistic updates
- ✅ Real-time data synchronization

#### 4. **Pages & Management**
- ✅ Teacher Dashboard với statistics
- ✅ Student Dashboard với progress tracking
- ✅ Classes Management (CRUD)
- ✅ Lessons Management (CRUD)
- ✅ Students Management
- ✅ Activities Management

#### 5. **User Experience**
- ✅ Role-based navigation
- ✅ Protected routes
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications

## 🛠️ Technology Stack

### Backend
```json
{
  "framework": "NestJS 10.x",
  "runtime": "Node.js 18+",
  "database": "PostgreSQL 15+",
  "orm": "TypeORM 0.3.x",
  "validation": "class-validator, class-transformer",
  "documentation": "Swagger/OpenAPI",
  "authentication": "JWT",
  "testing": "Jest"
}
```

### Frontend
```json
{
  "framework": "React 18.x",
  "language": "TypeScript 5.x",
  "build": "Vite 5.x",
  "styling": "Tailwind CSS 3.x",
  "state": "React Query 5.x",
  "routing": "React Router DOM 6.x",
  "http": "Axios",
  "ui": "Custom component library"
}
```

## 📁 Project Structure

### Backend Structure
```
apps/api/
├── src/
│   ├── controllers/          # API endpoints
│   │   ├── user.controller.ts
│   │   ├── classes.controller.ts
│   │   ├── lessons.controller.ts
│   │   ├── activities.controller.ts
│   │   ├── student.controller.ts
│   │   └── teacher.controller.ts
│   ├── services/             # Business logic
│   │   ├── user.service.ts
│   │   ├── classes.service.ts
│   │   ├── lessons.service.ts
│   │   └── activity.service.ts
│   ├── entities/             # Database models
│   │   ├── user.entity.ts
│   │   ├── class.entity.ts
│   │   ├── lesson.entity.ts
│   │   └── activity.entity.ts
│   ├── dto/                  # Data transfer objects
│   │   ├── user.dto.ts
│   │   ├── class.dto.ts
│   │   ├── lesson.dto.ts
│   │   └── activity.dto.ts
│   └── app.module.ts         # Main application module
```

### Frontend Structure
```
apps/web/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base components
│   │   ├── classes/         # Class-related components
│   │   ├── lessons/         # Lesson-related components
│   │   └── activities/      # Activity-related components
│   ├── pages/               # Page components
│   │   ├── teacher/         # Teacher pages
│   │   ├── student/         # Student pages
│   │   └── common/          # Common pages
│   ├── services/            # API service classes
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   └── types/               # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- pnpm (recommended) hoặc npm

### 1. Clone Repository
```bash
git clone <repository-url>
cd engrisk
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup
```bash
cd apps/api
# Tạo database
psql -U postgres -c "CREATE DATABASE engrisk_learning;"

# Chạy migrations
pnpm run migration:run

# Seed data (optional)
psql -U postgres -d engrisk_learning -f seed-data-phone.sql
```

### 4. Environment Configuration
```bash
# Backend (.env)
DATABASE_URL=postgresql://username:password@localhost:5432/engrisk_learning
JWT_SECRET=your-secret-key
PORT=3000

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

### 5. Start Development Servers

#### Backend
```bash
cd apps/api
pnpm run start:dev
# Server sẽ chạy tại http://localhost:3000
```

#### Frontend
```bash
cd apps/web
pnpm run dev
# App sẽ chạy tại http://localhost:5173
```

### 6. Access API Documentation
```
http://localhost:3000/api
```

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Classes
- `GET /classes` - Get all classes (paginated)
- `GET /classes/:id` - Get class by ID
- `POST /classes` - Create new class
- `PUT /classes/:id` - Update class
- `DELETE /classes/:id` - Delete class
- `GET /classes/:id/students` - Get class students
- `POST /classes/:id/students` - Add student to class
- `DELETE /classes/:id/students/:studentId` - Remove student from class

### Lessons
- `GET /lessons` - Get all lessons (paginated)
- `GET /lessons/:id` - Get lesson by ID
- `POST /lessons` - Create new lesson
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson
- `POST /lessons/:id/publish` - Publish lesson
- `POST /lessons/:id/unpublish` - Unpublish lesson

### Activities
- `GET /activities` - Get all activities
- `GET /activities/:id` - Get activity by ID
- `POST /activities` - Create new activity
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity
- `GET /activities/lesson/:lessonId` - Get activities by lesson
- `POST /activities/:id/complete` - Mark activity as completed

### Students
- `GET /students` - Get all students (paginated)
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student
- `GET /students/:id/classes` - Get student classes
- `GET /students/:id/progress` - Get student progress

### Teachers
- `GET /teachers` - Get all teachers (paginated)
- `GET /teachers/:id` - Get teacher by ID
- `POST /teachers` - Create new teacher
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher
- `GET /teachers/:id/classes` - Get teacher classes
- `GET /teachers/:id/statistics` - Get teacher statistics

## 🎯 Key Features

### 1. **Role-Based Access Control**
- **Students**: Access to enrolled classes, lessons, and activities
- **Teachers**: Manage classes, lessons, and view student progress
- **Admins**: Full system access

### 2. **Comprehensive CRUD Operations**
- Full Create, Read, Update, Delete functionality
- Data validation và error handling
- Optimistic updates và real-time synchronization

### 3. **Advanced Activity System**
- Multiple activity types (Quiz, Matching, Fill-blank, Reading, Speaking, Listening)
- Progress tracking và scoring
- Time management và difficulty levels

### 4. **Student Progress Tracking**
- Learning analytics
- Achievement system
- Performance metrics

### 5. **Responsive Design**
- Mobile-first approach
- Modern UI/UX
- Accessibility compliance

## 🧪 Testing

### Backend Testing
```bash
cd apps/api
pnpm run test              # Unit tests
pnpm run test:e2e         # End-to-end tests
pnpm run test:cov         # Coverage report
```

### Frontend Testing
```bash
cd apps/web
pnpm run test             # Unit tests
pnpm run test:ui          # Visual regression tests
pnpm run test:coverage    # Coverage report
```

## 📈 Performance & Optimization

### Backend
- Database query optimization
- Caching strategies
- Rate limiting
- Connection pooling

### Frontend
- Code splitting
- Lazy loading
- React Query caching
- Bundle optimization

## 🔒 Security Features

- JWT authentication
- Role-based authorization
- Input validation
- SQL injection prevention
- CORS configuration
- Rate limiting

## 🚀 Deployment

### Backend Deployment
```bash
cd apps/api
pnpm run build
pnpm run start:prod
```

### Frontend Deployment
```bash
cd apps/web
pnpm run build
# Deploy dist/ folder to your hosting service
```

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the frontend library
- TypeORM team for the ORM solution
- Tailwind CSS team for the utility-first CSS framework
- All contributors and maintainers

## 📞 Support

- **Documentation**: Check the API docs at `/api`
- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions
- **Email**: Support team contact

---

## 🎉 Project Status: **100% COMPLETE**

**EngRisk Learning Platform** đã được hoàn thiện với đầy đủ các tính năng:

✅ **Backend API**: Hoàn thiện 100% với tất cả CRUD operations  
✅ **Frontend**: Hoàn thiện 100% với modern UI/UX  
✅ **Database**: Schema hoàn chỉnh với relationships  
✅ **Authentication**: JWT-based security system  
✅ **Documentation**: API docs và component docs  
✅ **Testing**: Unit tests và integration tests  

**Hệ thống sẵn sàng để deploy và sử dụng trong production!** 🚀

---

*Built with ❤️ using modern web technologies* 