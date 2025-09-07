# 🚀 Traksys Frontend API Implementation

This directory contains the complete API implementation for the Traksys frontend application, providing seamless integration with the backend's 80+ endpoints across 15 modules.

## 📁 Directory Structure

```
src/app/core/
├── services/                 # API Services
│   ├── base-api.service.ts   # Base service with common functionality
│   ├── auth.service.ts       # Authentication & user management
│   ├── users.service.ts      # User CRUD operations
│   ├── customers.service.ts  # Customer management
│   ├── projects.service.ts   # Project management
│   ├── tasks.service.ts      # Task management
│   ├── pieces.service.ts     # Piece management
│   ├── resources.service.ts  # Resource management
│   ├── materials.service.ts  # Inventory management
│   ├── comments.service.ts   # Task comments
│   ├── notifications.service.ts # User notifications
│   ├── alerts.service.ts     # System alerts
│   ├── dashboard.service.ts  # Dashboard analytics
│   ├── reports.service.ts    # Reporting
│   ├── upload.service.ts     # File uploads
│   ├── websocket.service.ts  # Real-time communication
│   └── loading.service.ts    # Loading state management
├── interceptors/             # HTTP Interceptors
│   ├── auth.interceptor.ts   # Automatic token injection
│   ├── error.interceptor.ts  # Global error handling
│   └── loading.interceptor.ts # Loading state tracking
├── guards/                   # Route Guards
│   └── auth.guard.ts         # Authentication & authorization
├── core.module.ts           # Core module configuration
└── index.ts                 # Barrel exports
```

## 🔧 Features Implemented

### ✅ Core Infrastructure
- **Base API Service**: Common HTTP functionality, error handling, authentication headers
- **Environment Configuration**: Development and production API endpoints
- **HTTP Interceptors**: Automatic authentication, error handling, loading states
- **Type Safety**: Complete TypeScript interfaces for all API responses
- **Loading Management**: Global loading state tracking

### ✅ Authentication & Security
- **JWT Token Management**: Automatic token handling and refresh
- **Role-Based Access Control**: Support for admin, manager, operator, viewer roles
- **Route Guards**: Protect routes based on authentication and permissions
- **Secure Storage**: Token and user data persistence

### ✅ API Services Coverage

#### 🔐 Authentication Service
- Login/logout functionality
- Token refresh mechanism
- User profile management
- Role-based permissions

#### 👥 Users Service
- User CRUD operations
- Profile management
- User search and filtering
- Role assignment

#### 🏢 Customers Service
- Customer management
- Contact information
- Project associations
- Search functionality

#### 📋 Projects Service
- Project CRUD operations
- Progress tracking
- File attachments (design files/pictures)
- Customer associations
- Filtering and sorting

#### ✅ Tasks Service
- Task management
- Progress tracking
- Resource assignment
- Status updates
- Due date management
- Comments integration

#### 🔧 Pieces Service
- Piece CRUD operations
- Material associations
- Progress tracking
- Status management
- Project integration

#### 👷 Resources Service
- Human and machine resource management
- Availability tracking
- Maintenance scheduling
- Utilization reporting
- Skill management

#### 📦 Materials Service
- Inventory management
- Stock level tracking
- Low stock alerts
- Material consumption
- Shape-specific handling (bars/plates)

#### 💬 Comments Service
- Task-based commenting
- Real-time updates
- Comment management
- Author tracking

#### 🔔 Notifications Service
- User notifications
- Real-time delivery
- Read/unread status
- Bulk operations

#### ⚠️ Alerts Service
- System-wide alerts
- Critical stock notifications
- Maintenance reminders
- Task overdue alerts

#### 📊 Dashboard Service
- Real-time statistics
- Project progress overview
- Resource utilization
- Recent activities

#### 📈 Reports Service
- Project summary reports
- Material usage reports
- Resource performance analytics
- Productivity metrics

#### 📁 Upload Service
- Design file uploads
- Image uploads
- File management
- Type validation

### ✅ Real-time Features
- **WebSocket Integration**: Live updates for tasks, notifications, alerts
- **Event Listeners**: Material stock updates, resource changes
- **Room Management**: Join/leave specific project or task rooms
- **Connection Management**: Auto-reconnection, status monitoring

## 🚀 Usage Examples

### Authentication
```typescript
// Login
this.authService.login({ email, password }).subscribe({
  next: (response) => {
    console.log('Logged in successfully', response.user);
  },
  error: (error) => console.error('Login failed', error)
});

// Check permissions
if (this.authService.hasRole(['admin', 'manager'])) {
  // Show admin features
}
```

### Project Management
```typescript
// Load projects with filtering
this.projectsService.getProjects({
  page: 1,
  limit: 10,
  search: 'Industrial',
  status: 'active'
}).subscribe(response => {
  this.projects = response.projects;
});

// Update project progress
this.projectsService.updateProjectProgress(projectId, 75).subscribe();
```

### Real-time Updates
```typescript
// Listen for task updates
this.webSocketService.getTaskUpdates().subscribe(update => {
  console.log('Task updated:', update);
  // Update UI accordingly
});

// Join project room for live updates
this.webSocketService.joinRoom(`project-${projectId}`);
```

### Material Management
```typescript
// Check low stock materials
this.materialsService.getLowStockMaterials().subscribe(materials => {
  // Show alerts for low stock items
});

// Consume material for a piece
this.materialsService.consumeMaterial(materialId, {
  quantity: 5,
  length: 100,
  pieceId: 'piece-123'
}).subscribe();
```

## 🔗 Integration with Backend

The API services are designed to work seamlessly with the Traksys backend:

- **Base URL**: `http://localhost:3000` (development)
- **WebSocket URL**: `ws://localhost:3000`
- **API Documentation**: `http://localhost:3000/api/docs`

### Error Handling
- Automatic token refresh on 401 errors
- Network error detection and user feedback
- Comprehensive error logging
- Graceful degradation for offline scenarios

### Loading States
- Global loading indicator management
- Per-request loading tracking
- UI blocking prevention
- Background process handling

## 🛠️ Configuration

### Environment Setup
Update `src/environments/environment.ts` for development:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
  apiDocsUrl: 'http://localhost:3000/api/docs'
};
```

### Module Integration
The `CoreModule` is already configured in `app.config.ts` and provides all services and interceptors automatically.

## 📱 Component Integration

Use the provided `ApiExampleComponent` as a reference for implementing API calls in your components:

```typescript
import { Component, OnInit } from '@angular/core';
import { ProjectsService, AuthService } from '../core';

@Component({...})
export class MyComponent implements OnInit {
  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadProjects();
    }
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe(response => {
      // Handle projects data
    });
  }
}
```

## 🔒 Security Features

- JWT token automatic handling
- CSRF protection ready
- Role-based route protection
- Secure credential storage
- API request signing
- Input validation

## 🎯 Next Steps

1. **Test API Integration**: Use the example component to verify all endpoints
2. **Implement Error Boundaries**: Add user-friendly error messages
3. **Add Caching**: Implement intelligent data caching strategies
4. **Performance Optimization**: Add request debouncing and batching
5. **Offline Support**: Implement service workers for offline functionality

## 📞 API Documentation

For complete API documentation including all endpoints, request/response schemas, and testing capabilities, visit:
**http://localhost:3000/api/docs**

This implementation provides complete coverage of the backend's 80+ endpoints and ensures type safety, error handling, and real-time capabilities throughout your Angular application.
