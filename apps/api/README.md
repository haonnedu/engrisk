# EngRisk Backend API

## 🚀 Overview

This is the backend API for the EngRisk learning platform, built with NestJS and TypeORM, connected to a Supabase PostgreSQL database.

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase)
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT (planned)

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── dto/             # Data Transfer Objects
├── entities/        # Database entities
├── services/        # Business logic services
├── controllers/     # API endpoints (to be implemented)
├── modules/         # Feature modules
└── main.ts         # Application entry point
```

## 🗄️ Database Schema

### Core Entities

- **User**: Students, teachers, and admins
- **Class**: Learning classes with students and teachers
- **Lesson**: Individual lessons within classes
- **Activity**: Interactive learning activities (quiz, matching, fill-blank, etc.)

### Relationships

- User (Teacher) → Class (1:N)
- Class → Lesson (1:N)
- Lesson → Activity (1:N)
- User (Student) ↔ Class (M:N via class_students table)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (create `.env` file):
```env
NODE_ENV=development
PORT=3000
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.gwvctyrmjxdvdqnewkfv
DB_PASSWORD=1234
DB_NAME=postgres
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

3. **Setup Database** (First time only):
```bash
# Create database tables and seed with sample data
pnpm setup:db

# Test database connection
node test-db-connection.js

# View database schema
node show-database-schema.js
```

4. Run the application:
```bash
# Development mode
pnpm start:dev

# Production build
pnpm build
pnpm start
```

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:
- **URL**: http://localhost:3000/docs
- **API Base**: http://localhost:3000/api

## 🔄 Generate Frontend Types

To generate TypeScript types for the frontend:

```bash
pnpm generate:types
```

This will create type definitions in `../web/src/types/generated/` that can be imported in your frontend code.

## 🏗️ Architecture

### Service Layer
- **UserService**: User management, authentication
- **LessonService**: Lesson CRUD operations
- **ActivityService**: Activity management and completion tracking

### Data Flow
1. **Controller** receives HTTP request
2. **Service** processes business logic
3. **Repository** (via TypeORM) handles database operations
4. **Entity** represents database table structure

### Validation
- DTOs use `class-validator` decorators
- Global validation pipe ensures data integrity
- TypeORM entities define database constraints

## 🔐 Security Features

- **CORS**: Configurable cross-origin requests
- **Validation**: Input sanitization and validation
- **Password Hashing**: bcrypt for secure password storage
- **JWT**: Token-based authentication (planned)

## 📊 Database Connection

The API connects to Supabase using:
- **Host**: aws-1-ap-southeast-1.pooler.supabase.com
- **Port**: 6543
- **Database**: postgres
- **SSL**: Enabled with certificate verification disabled

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

## 🔄 Development Workflow

1. **Create Entity**: Define database structure
2. **Create DTO**: Define API input/output structure
3. **Create Service**: Implement business logic
4. **Create Controller**: Define API endpoints
5. **Update Module**: Wire everything together
6. **Test**: Verify functionality
7. **Generate Types**: Update frontend types

## 🚧 TODO

- [ ] Implement controllers for all services
- [ ] Add JWT authentication middleware
- [ ] Implement role-based access control
- [ ] Add comprehensive error handling
- [ ] Implement logging system
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 