# Backend API Requirements for Traksys

## Overview
Traksys is a project management and resource tracking system for manufacturing/production environments. This document outlines all the backend API endpoints needed to support the Angular frontend application.

## Technology Stack Recommendations
- **Backend Framework**: Node.js with Express.js, Python with FastAPI, or .NET Core
- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT-based authentication
- **File Storage**: AWS S3, Google Cloud Storage, or local file system
- **Real-time Communication**: WebSockets or Server-Sent Events for notifications

## Core Data Models

### User/Authentication
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  projectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  designPicture: string; // URL/path to uploaded image
  designFile: string;    // URL/path to uploaded file
  customerId: string;
  pieceIds: string[];
  progress: number;      // 0-100
  opened: Date;
  delivery: Date;
  invoiceAmount: number;
  currency: string;
  isOpen: boolean;
  createdBy: string;     // User ID
  createdAt: Date;
  updatedAt: Date;
}
```

### Piece
```typescript
interface Piece {
  id: string;
  reference: string;     // Unique identifier
  name: string;
  description: string;
  designFile: string;    // URL/path to uploaded file
  designPicture: string; // URL/path to uploaded image
  materialId: string;
  materialQuantity: number;
  quantity: number;
  progress: number;      // 0-100
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked';
  taskIds: string[];
  projectId: string;     // Added for relationship
  createdAt: Date;
  updatedAt: Date;
}
```

### Task
```typescript
interface Task {
  id: string;
  name: string;
  description: string;
  estimatedTime: number; // in hours
  spentTime: number;     // in hours
  quantity: number;
  progress: number;      // 0-100
  status: 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
  resourceIds: string[];
  commentIds: string[];
  pieceId?: string;
  dueDate: Date;
  actualFinishDate?: Date;
  createdBy: string;     // User ID
  creationDate: Date;
  updatedAt: Date;
}
```

### Resource
```typescript
interface Resource {
  id: string;
  name: string;
  type: 'Person' | 'Machine';
  taskIds: string[];
  isAvailable: boolean;
  maintenanceSchedule?: Date; // for machines
  skills?: string[];          // for persons
  createdAt: Date;
  updatedAt: Date;
}
```

### Material
```typescript
interface Material {
  id: string;
  material: string;        // e.g., Aluminium, Steel
  type: string;            // e.g., C55, 6061, Inox 304
  quantity: number;        // stock quantity
  available_length?: number; // for bars, in mm
  available_area?: number;   // for plates, in square mm
  min_length?: number;     // minimum threshold for bars
  min_area?: number;       // minimum threshold for plates
  shape: 'Cylindrical Bar' | 'Plate';
  diameter?: number;       // for Cylindrical Bar
  length?: number;         // for Cylindrical Bar
  x?: number;              // for Plate
  y?: number;              // for Plate
  thickness?: number;      // for Plate
  pieceIds: string[];
  last_updated: Date;
  createdAt: Date;
}
```

### Comment
```typescript
interface Comment {
  id: string;
  taskId: string;
  authorId: string;        // User ID
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Alert
```typescript
interface Alert {
  id: string;
  type: 'low-stock' | 'critical-stock' | 'maintenance' | 'task-overdue';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  isRead: boolean;
  userId?: string;         // if alert is user-specific
  materialId?: string;     // for stock alerts
  taskId?: string;         // for task alerts
  resourceId?: string;     // for maintenance alerts
  timestamp: Date;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'progress' | 'info' | 'warning' | 'success';
  taskId?: string;
  projectId?: string;
  userId: string;          // recipient
  read: boolean;
  timestamp: Date;
}
```

## API Endpoints

### Authentication & User Management

#### POST /api/auth/login
- **Purpose**: User authentication
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: User, expiresIn: number }`

#### POST /api/auth/logout
- **Purpose**: User logout (invalidate token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### POST /api/auth/refresh
- **Purpose**: Refresh JWT token
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ token: string, expiresIn: number }`

#### GET /api/users/profile
- **Purpose**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `User`

#### PUT /api/users/profile
- **Purpose**: Update current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<User>`
- **Response**: `User`

#### GET /api/users
- **Purpose**: Get all users (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term&role=admin`
- **Response**: `{ users: User[], total: number, page: number, totalPages: number }`

#### POST /api/users
- **Purpose**: Create new user (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `User`
- **Response**: `User`

#### PUT /api/users/:id
- **Purpose**: Update user (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<User>`
- **Response**: `User`

#### DELETE /api/users/:id
- **Purpose**: Delete user (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Customer Management

#### GET /api/customers
- **Purpose**: Get all customers
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term`
- **Response**: `{ customers: Customer[], total: number, page: number, totalPages: number }`

#### GET /api/customers/:id
- **Purpose**: Get customer by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Customer`

#### POST /api/customers
- **Purpose**: Create new customer
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Customer`
- **Response**: `Customer`

#### PUT /api/customers/:id
- **Purpose**: Update customer
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<Customer>`
- **Response**: `Customer`

#### DELETE /api/customers/:id
- **Purpose**: Delete customer
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Project Management

#### GET /api/projects
- **Purpose**: Get all projects with filtering
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term&customerId=id&status=open&sortBy=opened&sortOrder=desc`
- **Response**: `{ projects: Project[], total: number, page: number, totalPages: number }`

#### GET /api/projects/:id
- **Purpose**: Get project by ID with related data
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ project: Project, customer: Customer, pieces: Piece[], tasks: Task[] }`

#### POST /api/projects
- **Purpose**: Create new project
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Project`
- **Response**: `Project`

#### PUT /api/projects/:id
- **Purpose**: Update project
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<Project>`
- **Response**: `Project`

#### DELETE /api/projects/:id
- **Purpose**: Delete project
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### PUT /api/projects/:id/progress
- **Purpose**: Update project progress
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ progress: number }`
- **Response**: `Project`

### Piece Management

#### GET /api/pieces
- **Purpose**: Get all pieces
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term&projectId=id&status=In Progress`
- **Response**: `{ pieces: Piece[], total: number, page: number, totalPages: number }`

#### GET /api/pieces/:id
- **Purpose**: Get piece by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Piece`

#### POST /api/pieces
- **Purpose**: Create new piece
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Piece`
- **Response**: `Piece`

#### PUT /api/pieces/:id
- **Purpose**: Update piece
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<Piece>`
- **Response**: `Piece`

#### DELETE /api/pieces/:id
- **Purpose**: Delete piece
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Task Management

#### GET /api/tasks
- **Purpose**: Get all tasks with filtering
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term&status=To Do&resourceId=id&pieceId=id&assignedToMe=true&dueDate=2025-09-15`
- **Response**: `{ tasks: Task[], total: number, page: number, totalPages: number }`

#### GET /api/tasks/:id
- **Purpose**: Get task by ID with related data
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ task: Task, piece: Piece, project: Project, resources: Resource[], comments: Comment[] }`

#### POST /api/tasks
- **Purpose**: Create new task
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Task`
- **Response**: `Task`

#### PUT /api/tasks/:id
- **Purpose**: Update task
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<Task>`
- **Response**: `Task`

#### DELETE /api/tasks/:id
- **Purpose**: Delete task
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### PUT /api/tasks/:id/status
- **Purpose**: Update task status
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ status: string, actualFinishDate?: Date }`
- **Response**: `Task`

#### PUT /api/tasks/:id/progress
- **Purpose**: Update task progress
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ progress: number, spentTime?: number }`
- **Response**: `Task`

#### POST /api/tasks/:id/assign
- **Purpose**: Assign resources to task
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ resourceIds: string[] }`
- **Response**: `Task`

#### DELETE /api/tasks/:id/assign/:resourceId
- **Purpose**: Unassign resource from task
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Task`

### Resource Management

#### GET /api/resources
- **Purpose**: Get all resources
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term&type=Person&available=true`
- **Response**: `{ resources: Resource[], total: number, page: number, totalPages: number }`

#### GET /api/resources/:id
- **Purpose**: Get resource by ID with assigned tasks
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ resource: Resource, tasks: Task[] }`

#### POST /api/resources
- **Purpose**: Create new resource
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Resource`
- **Response**: `Resource`

#### PUT /api/resources/:id
- **Purpose**: Update resource
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<Resource>`
- **Response**: `Resource`

#### DELETE /api/resources/:id
- **Purpose**: Delete resource
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### GET /api/resources/available
- **Purpose**: Get available resources for assignment
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Resource[]`

#### PUT /api/resources/:id/availability
- **Purpose**: Update resource availability
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ isAvailable: boolean, maintenanceSchedule?: Date }`
- **Response**: `Resource`

### Material/Stock Management

#### GET /api/materials
- **Purpose**: Get all materials with stock levels
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=50&search=term&shape=Plate&lowStock=true&criticalStock=true`
- **Response**: `{ materials: Material[], total: number, page: number, totalPages: number }`

#### GET /api/materials/:id
- **Purpose**: Get material by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Material`

#### POST /api/materials
- **Purpose**: Create new material
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Material`
- **Response**: `Material`

#### PUT /api/materials/:id
- **Purpose**: Update material
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Partial<Material>`
- **Response**: `Material`

#### DELETE /api/materials/:id
- **Purpose**: Delete material
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### PUT /api/materials/:id/stock
- **Purpose**: Update material stock levels
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ quantity?: number, available_length?: number, available_area?: number }`
- **Response**: `Material`

#### POST /api/materials/:id/consume
- **Purpose**: Consume material for production
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ quantity: number, length?: number, area?: number, pieceId: string }`
- **Response**: `Material`

#### GET /api/materials/low-stock
- **Purpose**: Get materials with low stock levels
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Material[]`

#### GET /api/materials/critical-stock
- **Purpose**: Get materials with critical stock levels
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Material[]`

### Comment Management

#### GET /api/tasks/:taskId/comments
- **Purpose**: Get all comments for a task
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Comment[]`

#### POST /api/tasks/:taskId/comments
- **Purpose**: Add comment to task
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ message: string }`
- **Response**: `Comment`

#### PUT /api/comments/:id
- **Purpose**: Update comment
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ message: string }`
- **Response**: `Comment`

#### DELETE /api/comments/:id
- **Purpose**: Delete comment
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### File Upload Management

#### POST /api/upload/design-file
- **Purpose**: Upload design file for project/piece
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `FormData` with file
- **Response**: `{ url: string, filename: string, size: number }`

#### POST /api/upload/design-picture
- **Purpose**: Upload design picture for project/piece
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `FormData` with image file
- **Response**: `{ url: string, filename: string, size: number }`

#### DELETE /api/upload/:filename
- **Purpose**: Delete uploaded file
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Notification Management

#### GET /api/notifications
- **Purpose**: Get user notifications
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?page=1&limit=20&unread=true`
- **Response**: `{ notifications: Notification[], total: number, unreadCount: number }`

#### PUT /api/notifications/:id/read
- **Purpose**: Mark notification as read
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Notification`

#### PUT /api/notifications/read-all
- **Purpose**: Mark all notifications as read
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### DELETE /api/notifications/:id
- **Purpose**: Delete notification
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

#### POST /api/notifications/send
- **Purpose**: Send notification to user(s)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title: string, message: string, type: string, userIds: string[], taskId?: string }`
- **Response**: `Notification[]`

### Alert Management

#### GET /api/alerts
- **Purpose**: Get system alerts
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?type=low-stock&severity=high&unread=true`
- **Response**: `Alert[]`

#### POST /api/alerts
- **Purpose**: Create system alert
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `Alert`
- **Response**: `Alert`

#### PUT /api/alerts/:id/read
- **Purpose**: Mark alert as read
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `Alert`

#### DELETE /api/alerts/:id
- **Purpose**: Delete alert
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Dashboard & Analytics

#### GET /api/dashboard/stats
- **Purpose**: Get dashboard statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{
  totalProjects: number,
  activeProjects: number,
  completedTasks: number,
  pendingTasks: number,
  availableResources: number,
  lowStockMaterials: number,
  criticalAlerts: number,
  recentActivities: Activity[]
}`

#### GET /api/dashboard/project-progress
- **Purpose**: Get project progress overview
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ projectId: string, name: string, progress: number, dueDate: Date }[]`

#### GET /api/dashboard/resource-utilization
- **Purpose**: Get resource utilization data
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ resourceId: string, name: string, utilization: number, activeTasks: number }[]`

#### GET /api/dashboard/recent-activities
- **Purpose**: Get recent system activities
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?limit=10`
- **Response**: `Activity[]`

### Reports

#### GET /api/reports/project-summary
- **Purpose**: Get project summary report
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?startDate=2025-01-01&endDate=2025-12-31&projectId=id`
- **Response**: `ProjectSummaryReport`

#### GET /api/reports/material-usage
- **Purpose**: Get material usage report
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?startDate=2025-01-01&endDate=2025-12-31&materialId=id`
- **Response**: `MaterialUsageReport`

#### GET /api/reports/resource-performance
- **Purpose**: Get resource performance report
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `?startDate=2025-01-01&endDate=2025-12-31&resourceId=id`
- **Response**: `ResourcePerformanceReport`

## Real-time Features

### WebSocket Events

#### Connection
- **Event**: `connect`
- **Purpose**: Establish real-time connection
- **Data**: `{ userId: string, token: string }`

#### Task Updates
- **Event**: `task:updated`
- **Purpose**: Broadcast task status/progress changes
- **Data**: `{ taskId: string, task: Task, updatedBy: string }`

#### Notifications
- **Event**: `notification:new`
- **Purpose**: Send real-time notifications
- **Data**: `Notification`

#### Alerts
- **Event**: `alert:new`
- **Purpose**: Send real-time alerts
- **Data**: `Alert`

#### Material Stock Updates
- **Event**: `material:stock-updated`
- **Purpose**: Broadcast stock level changes
- **Data**: `{ materialId: string, material: Material }`

## Security Requirements

### Authentication
- JWT-based authentication with refresh tokens
- Token expiration handling
- Role-based access control (RBAC)
- Password hashing with bcrypt or similar

### Authorization
- Admin: Full system access
- Manager: Project and resource management
- Operator: Task management and progress updates
- Viewer: Read-only access

### Data Validation
- Input validation on all endpoints
- File upload restrictions (size, type)
- SQL injection protection
- XSS protection

### Rate Limiting
- API rate limiting per user/IP
- File upload rate limiting
- Login attempt limiting

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "timestamp": "2025-09-05T10:30:00Z"
  }
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error

## Performance Requirements

### Response Times
- Authentication: < 200ms
- CRUD operations: < 500ms
- File uploads: < 5s (depending on file size)
- Reports: < 2s

### Scalability
- Support for 100+ concurrent users
- Database optimization with indexes
- Caching for frequently accessed data
- File storage optimization

## Database Considerations

### Indexes Required
- Users: email, username
- Projects: customerId, isOpen, createdAt
- Tasks: status, pieceId, resourceIds, dueDate
- Materials: shape, material, type
- Comments: taskId, createdAt

### Relationships
- Customer → Projects (1:N)
- Project → Pieces (1:N)
- Piece → Tasks (1:N)
- Task → Resources (N:N)
- Task → Comments (1:N)
- Material → Pieces (1:N)

### Data Integrity
- Foreign key constraints
- Cascade delete rules
- Unique constraints where appropriate
- Check constraints for enums

This comprehensive API specification covers all the functionality observed in the Angular frontend and provides a robust foundation for the backend implementation.
