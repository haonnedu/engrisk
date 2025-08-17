# EngRisk Learning Platform - Frontend

## Overview
This document describes the frontend implementation for the EngRisk Learning Platform, which provides a modern React-based user interface for managing students, classes, lessons, and activities.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **UI Components**: Custom component library with shadcn/ui patterns
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: JWT-based auth with context

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── classes/        # Class-related components
│   ├── lessons/        # Lesson-related components
│   ├── activities/     # Activity-related components
│   ├── auth/           # Authentication components
│   └── common/         # Common components (Navigation, etc.)
├── pages/              # Page components
│   ├── teacher/        # Teacher dashboard and management pages
│   ├── student/        # Student dashboard and learning pages
│   └── common/         # Common pages (Home, Lessons, etc.)
├── services/           # API service classes
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (Auth, etc.)
├── types/              # TypeScript type definitions
├── lib/                # Utility libraries
└── config/             # Configuration files
```

## Key Features Implemented

### 1. **API Services Layer**
- **Base API Service**: Centralized HTTP client with authentication
- **Classes Service**: Full CRUD operations for classes
- **Lessons Service**: Full CRUD operations for lessons
- **Activities Service**: Full CRUD operations for activities
- **Students Service**: Student management operations
- **Teachers Service**: Teacher management operations

### 2. **Custom Hooks (React Query)**
- **useClasses**: Class management with caching and mutations
- **useLessons**: Lesson management with caching and mutations
- **useActivities**: Activity management with caching and mutations
- **useStudents**: Student management operations
- **useTeachers**: Teacher management operations

### 3. **UI Components**
- **Form Components**: CreateClassForm, CreateLessonForm
- **List Components**: ClassesList, LessonsList, ActivitiesList
- **Data Display**: Tables with pagination, cards, badges
- **Navigation**: Role-based navigation system

### 4. **Authentication & Authorization**
- **Protected Routes**: Role-based access control
- **Auth Context**: Global authentication state
- **JWT Management**: Token storage and refresh

## Components Overview

### Base UI Components
- **Button**: Multiple variants (primary, secondary, outline, destructive)
- **Input**: Text input with validation states
- **Select**: Dropdown selection component
- **Card**: Content container with header and body
- **Table**: Data table with sorting and pagination
- **Badge**: Status and category indicators
- **Textarea**: Multi-line text input

### Business Components
- **CreateClassForm**: Form for creating new classes
- **ClassesList**: Paginated list of classes with actions
- **CreateLessonForm**: Form for creating new lessons
- **LessonsList**: Paginated list of lessons with actions

## API Integration

### Service Pattern
All API calls use a consistent service pattern:
```typescript
class ClassesService extends ApiService {
  async getClasses(page = 1, limit = 20): Promise<ClassListResponse> {
    return this.getInstance<ClassListResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`)
  }
  
  async createClass(data: CreateClassDto): Promise<Class> {
    return this.postInstance<Class>(this.baseUrl, data)
  }
}
```

### React Query Integration
Custom hooks provide data fetching, caching, and mutations:
```typescript
export const useClasses = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['classes', page, limit],
    queryFn: () => classesService.getClasses(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

## State Management

### React Query Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Authentication Context
```typescript
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Authentication logic
}
```

## Routing Structure

### Public Routes
- `/` - Home page
- `/lessons` - Public lessons listing

### Protected Student Routes
- `/student/dashboard` - Student dashboard
- `/student/learning` - Learning interface

### Protected Teacher Routes
- `/teacher/dashboard` - Teacher dashboard
- `/teacher/classes` - Class management
- `/teacher/lessons` - Lesson management
- `/teacher/students` - Student management

## Styling & Design

### Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Consistent spacing and colors
- **Dark Mode Ready**: CSS variables for theming

### Design System
- **Color Palette**: Consistent color scheme
- **Typography**: Hierarchical text styles
- **Spacing**: 4px grid system
- **Components**: Reusable design patterns

## Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
cd engrisk/apps/web
pnpm install
```

### Development Server
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

### Type Checking
```bash
pnpm type-check
```

## Testing

### Component Testing
- **React Testing Library**: Component behavior testing
- **Jest**: Test runner and assertions
- **MSW**: API mocking for tests

### E2E Testing
- **Playwright**: End-to-end testing
- **Test Scenarios**: User journey testing

## Performance Optimizations

### React Query
- **Automatic Caching**: Reduces API calls
- **Background Updates**: Keeps data fresh
- **Optimistic Updates**: Immediate UI feedback

### Code Splitting
- **Route-based Splitting**: Lazy load pages
- **Component Splitting**: Dynamic imports for heavy components

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Reduce initial bundle size

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service worker implementation
- **Advanced Analytics**: Learning progress tracking
- **Mobile App**: React Native version

### Technical Improvements
- **Micro-frontends**: Module federation
- **Performance Monitoring**: Core Web Vitals tracking
- **Accessibility**: WCAG 2.1 compliance
- **Internationalization**: Multi-language support

## Contributing

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request
5. Code review and merge

## Troubleshooting

### Common Issues
- **API Connection**: Check backend server status
- **Authentication**: Verify JWT token validity
- **Build Errors**: Clear node_modules and reinstall
- **Type Errors**: Run type-check for detailed errors

### Debug Tools
- **React DevTools**: Component inspection
- **React Query DevTools**: Query debugging
- **Browser DevTools**: Network and console

## Support

For technical support or questions:
- **Documentation**: Check API documentation
- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions
- **Email**: Support team contact

---

*This frontend implementation provides a solid foundation for the EngRisk Learning Platform with modern React patterns, comprehensive state management, and a scalable architecture.* 