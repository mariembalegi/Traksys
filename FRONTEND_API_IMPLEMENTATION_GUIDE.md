# 🚀 Frontend API Implementation Guide for Traksys

## Overview
This guide provides comprehensive instructions for implementing all frontend API integrations to connect with the Traksys backend. The backend is 100% complete with 80+ endpoints across 15 modules.

## 📋 Table of Contents
1. [Setup & Configuration](#setup--configuration)
2. [API Service Architecture](#api-service-architecture)
3. [Authentication Implementation](#authentication-implementation)
4. [Module-by-Module API Implementation](#module-by-module-api-implementation)
5. [Error Handling & Interceptors](#error-handling--interceptors)
6. [Real-time Features](#real-time-features)
7. [File Upload Integration](#file-upload-integration)
8. [TypeScript Interfaces](#typescript-interfaces)

## 🔧 Setup & Configuration

### 1. Install Required Dependencies
```bash
npm install axios socket.io-client
npm install --save-dev @types/socket.io-client
```

### 2. Environment Configuration
Create environment files with backend API configuration:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
  apiDocsUrl: 'http://localhost:3000/api/docs'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
  wsUrl: 'wss://your-production-api.com',
  apiDocsUrl: 'https://your-production-api.com/api/docs'
};
```

## 🏗️ API Service Architecture

### 1. Base API Service
Create a base service for common functionality:

```typescript
// src/app/core/services/base-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  protected buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return httpParams;
  }

  protected handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
```

### 2. HTTP Interceptor for Authentication
```typescript
// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

## 🔐 Authentication Implementation

### 1. Authentication Service
```typescript
// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<{ token: string; expiresIn: number }> {
    return this.http.post<{ token: string; expiresIn: number }>(
      `${this.apiUrl}/auth/refresh`, 
      {}, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
}
```

## 📋 Module-by-Module API Implementation

### 1. Users Service
```typescript
// src/app/core/services/users.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseApiService {
  
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, userData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 2. Customers Service
```typescript
// src/app/core/services/customers.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  projectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseApiService {
  
  getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<CustomersResponse> {
    return this.http.get<CustomersResponse>(`${this.apiUrl}/customers`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createCustomer(customerData: Omit<Customer, 'id' | 'projectIds' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customerData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${id}`, customerData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteCustomer(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/customers/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 3. Projects Service
```typescript
// src/app/core/services/projects.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Project {
  id: string;
  name: string;
  description: string;
  designPicture?: string;
  designFile?: string;
  customerId: string;
  pieceIds: string[];
  progress: number;
  opened: Date;
  delivery: Date;
  invoiceAmount: number;
  currency: string;
  isOpen: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProjectDetails {
  project: Project;
  customer: Customer;
  pieces: any[];
  tasks: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends BaseApiService {
  
  getProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    customerId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(`${this.apiUrl}/projects`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getProject(id: string): Observable<ProjectDetails> {
    return this.http.get<ProjectDetails>(`${this.apiUrl}/projects/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createProject(projectData: Omit<Project, 'id' | 'pieceIds' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, projectData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateProject(id: string, projectData: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, projectData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateProjectProgress(id: string, progress: number): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}/progress`, { progress }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/projects/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 4. Tasks Service
```typescript
// src/app/core/services/tasks.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Task {
  id: string;
  name: string;
  description: string;
  estimatedTime: number;
  spentTime: number;
  quantity: number;
  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
  resourceIds: string[];
  commentIds: string[];
  pieceId?: string;
  dueDate: Date;
  actualFinishDate?: Date;
  createdBy: string;
  creationDate: Date;
  updatedAt: Date;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TaskDetails {
  task: Task;
  piece: any;
  project: any;
  resources: any[];
  comments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class TasksService extends BaseApiService {
  
  getTasks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    resourceId?: string;
    pieceId?: string;
    assignedToMe?: boolean;
    dueDate?: string;
  }): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(`${this.apiUrl}/tasks`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getTask(id: string): Observable<TaskDetails> {
    return this.http.get<TaskDetails>(`${this.apiUrl}/tasks/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createTask(taskData: Omit<Task, 'id' | 'commentIds' | 'creationDate' | 'updatedAt'>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, taskData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, taskData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateTaskStatus(id: string, status: string, actualFinishDate?: Date): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}/status`, 
      { status, actualFinishDate }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateTaskProgress(id: string, progress: number, spentTime?: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}/progress`, 
      { progress, spentTime }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  assignResources(id: string, resourceIds: string[]): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks/${id}/assign`, 
      { resourceIds }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  unassignResource(id: string, resourceId: string): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/tasks/${id}/assign/${resourceId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/tasks/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 5. Pieces Service
```typescript
// src/app/core/services/pieces.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Piece {
  id: string;
  reference: string;
  name: string;
  description: string;
  designFile?: string;
  designPicture?: string;
  materialId: string;
  materialQuantity: number;
  quantity: number;
  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked';
  taskIds: string[];
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PiecesResponse {
  pieces: Piece[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PieceDetails {
  piece: Piece;
  project: any;
  material: any;
  tasks: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PiecesService extends BaseApiService {
  
  getPieces(params?: {
    page?: number;
    limit?: number;
    search?: string;
    projectId?: string;
    status?: string;
  }): Observable<PiecesResponse> {
    return this.http.get<PiecesResponse>(`${this.apiUrl}/pieces`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getPiece(id: string): Observable<PieceDetails> {
    return this.http.get<PieceDetails>(`${this.apiUrl}/pieces/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createPiece(pieceData: Omit<Piece, 'id' | 'taskIds' | 'createdAt' | 'updatedAt'>): Observable<Piece> {
    return this.http.post<Piece>(`${this.apiUrl}/pieces`, pieceData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePiece(id: string, pieceData: Partial<Piece>): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/pieces/${id}`, pieceData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePieceProgress(id: string, progress: number): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/pieces/${id}/progress`, { progress }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePieceStatus(id: string, status: string): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/pieces/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deletePiece(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/pieces/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 6. Resources Service
```typescript
// src/app/core/services/resources.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Resource {
  id: string;
  name: string;
  type: 'Person' | 'Machine';
  taskIds: string[];
  isAvailable: boolean;
  maintenanceSchedule?: Date;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourcesResponse {
  resources: Resource[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ResourceDetails {
  resource: Resource;
  tasks: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ResourcesService extends BaseApiService {
  
  getResources(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    available?: boolean;
  }): Observable<ResourcesResponse> {
    return this.http.get<ResourcesResponse>(`${this.apiUrl}/resources`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getAvailableResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/resources/available`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getResourceUtilization(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resources/utilization`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getResource(id: string): Observable<ResourceDetails> {
    return this.http.get<ResourceDetails>(`${this.apiUrl}/resources/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createResource(resourceData: Omit<Resource, 'id' | 'taskIds' | 'createdAt' | 'updatedAt'>): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/resources`, resourceData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateResource(id: string, resourceData: Partial<Resource>): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/resources/${id}`, resourceData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateResourceAvailability(id: string, isAvailable: boolean, maintenanceSchedule?: Date): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/resources/${id}/availability`, 
      { isAvailable, maintenanceSchedule }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteResource(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/resources/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 7. Materials Service
```typescript
// src/app/core/services/materials.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Material {
  id: string;
  material: string;
  type: string;
  quantity: number;
  available_length?: number;
  available_area?: number;
  min_length?: number;
  min_area?: number;
  shape: 'Cylindrical Bar' | 'Plate';
  diameter?: number;
  length?: number;
  x?: number;
  y?: number;
  thickness?: number;
  pieceIds: string[];
  last_updated: Date;
  createdAt: Date;
}

export interface MaterialsResponse {
  materials: Material[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialsService extends BaseApiService {
  
  getMaterials(params?: {
    page?: number;
    limit?: number;
    search?: string;
    shape?: string;
    lowStock?: boolean;
    criticalStock?: boolean;
  }): Observable<MaterialsResponse> {
    return this.http.get<MaterialsResponse>(`${this.apiUrl}/materials`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getLowStockMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials/low-stock`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getCriticalStockMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials/critical-stock`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getStockLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materials/stock-levels`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getMaterial(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/materials/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createMaterial(materialData: Omit<Material, 'id' | 'pieceIds' | 'last_updated' | 'createdAt'>): Observable<Material> {
    return this.http.post<Material>(`${this.apiUrl}/materials`, materialData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateMaterial(id: string, materialData: Partial<Material>): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/materials/${id}`, materialData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateStock(id: string, stockData: {
    quantity?: number;
    available_length?: number;
    available_area?: number;
  }): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/materials/${id}/stock`, stockData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  consumeMaterial(id: string, consumeData: {
    quantity: number;
    length?: number;
    area?: number;
    pieceId: string;
  }): Observable<Material> {
    return this.http.post<Material>(`${this.apiUrl}/materials/${id}/consume`, consumeData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteMaterial(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/materials/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 8. Comments Service
```typescript
// src/app/core/services/comments.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService extends BaseApiService {
  
  getTaskComments(taskId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/tasks/${taskId}/comments`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  addComment(taskId: string, message: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/tasks/${taskId}/comments`, 
      { message }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getComment(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/comments/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateComment(id: string, message: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/comments/${id}`, 
      { message }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteComment(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/comments/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getRecentComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/recent`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 9. Notifications Service
```typescript
// src/app/core/services/notifications.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'progress' | 'info' | 'warning' | 'success';
  taskId?: string;
  projectId?: string;
  userId: string;
  read: boolean;
  timestamp: Date;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseApiService {
  
  getNotifications(params?: {
    page?: number;
    limit?: number;
    unread?: boolean;
  }): Observable<NotificationsResponse> {
    return this.http.get<NotificationsResponse>(`${this.apiUrl}/notifications`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/notifications/unread-count`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getNotification(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/notifications/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/notifications/${id}/read`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  markAllAsRead(): Observable<{ message: string; modifiedCount: number }> {
    return this.http.put<{ message: string; modifiedCount: number }>(
      `${this.apiUrl}/notifications/read-all`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteNotification(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/notifications/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  sendNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    userIds: string[];
    taskId?: string;
    projectId?: string;
  }): Observable<{ message: string; count: number; notifications: Notification[] }> {
    return this.http.post<{ message: string; count: number; notifications: Notification[] }>(
      `${this.apiUrl}/notifications/send`, notificationData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 10. Alerts Service
```typescript
// src/app/core/services/alerts.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Alert {
  id: string;
  type: 'low-stock' | 'critical-stock' | 'maintenance' | 'task-overdue';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  isRead: boolean;
  userId?: string;
  materialId?: string;
  taskId?: string;
  resourceId?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService extends BaseApiService {
  
  getAlerts(params?: {
    type?: string;
    severity?: string;
    unread?: boolean;
  }): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getCriticalAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts/critical`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAlertCounts(): Observable<{ total: number; unread: number; critical: number; byType: any }> {
    return this.http.get<{ total: number; unread: number; critical: number; byType: any }>(
      `${this.apiUrl}/alerts/counts`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getAlert(id: string): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/alerts/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createAlert(alertData: Omit<Alert, 'id' | 'isRead' | 'timestamp'>): Observable<Alert> {
    return this.http.post<Alert>(`${this.apiUrl}/alerts`, alertData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  markAsRead(id: string): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/alerts/${id}/read`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteAlert(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/alerts/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

### 11. Dashboard Service
```typescript
// src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  availableResources: number;
  lowStockMaterials: number;
  criticalAlerts: number;
  recentActivities: any[];
}

export interface ProjectProgress {
  projectId: string;
  name: string;
  progress: number;
  dueDate: Date;
}

export interface ResourceUtilization {
  resourceId: string;
  name: string;
  utilization: number;
  activeTasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseApiService {
  
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getProjectProgress(): Observable<ProjectProgress[]> {
    return this.http.get<ProjectProgress[]>(`${this.apiUrl}/dashboard/project-progress`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getResourceUtilization(): Observable<ResourceUtilization[]> {
    return this.http.get<ResourceUtilization[]>(`${this.apiUrl}/dashboard/resource-utilization`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getRecentActivities(limit?: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard/recent-activities`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(limit ? { limit } : undefined)
    }).pipe(catchError(this.handleError));
  }
}
```

### 12. Reports Service
```typescript
// src/app/core/services/reports.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseApiService {
  
  getProjectSummaryReport(params?: {
    startDate?: string;
    endDate?: string;
    projectId?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/project-summary`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getMaterialUsageReport(params?: {
    startDate?: string;
    endDate?: string;
    materialId?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/material-usage`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getResourcePerformanceReport(params?: {
    startDate?: string;
    endDate?: string;
    resourceId?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/resource-performance`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }
}
```

### 13. File Upload Service
```typescript
// src/app/core/services/upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService extends BaseApiService {
  
  uploadDesignFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/design-file`, formData, {
      headers
    }).pipe(catchError(this.handleError));
  }

  uploadDesignPicture(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/design-picture`, formData, {
      headers
    }).pipe(catchError(this.handleError));
  }

  deleteFile(filename: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/upload/${filename}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
```

## 🔄 Real-time Features (WebSocket)

### WebSocket Service
```typescript
// src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;
  private taskUpdatesSubject = new Subject<any>();
  private notificationsSubject = new Subject<any>();
  private alertsSubject = new Subject<any>();
  private materialUpdatesSubject = new Subject<any>();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    const token = localStorage.getItem('authToken');
    
    this.socket = io(environment.wsUrl, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('task:updated', (data) => {
      this.taskUpdatesSubject.next(data);
    });

    this.socket.on('notification:new', (data) => {
      this.notificationsSubject.next(data);
    });

    this.socket.on('alert:new', (data) => {
      this.alertsSubject.next(data);
    });

    this.socket.on('material:stock-updated', (data) => {
      this.materialUpdatesSubject.next(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // Observable streams for real-time updates
  getTaskUpdates(): Observable<any> {
    return this.taskUpdatesSubject.asObservable();
  }

  getNotifications(): Observable<any> {
    return this.notificationsSubject.asObservable();
  }

  getAlerts(): Observable<any> {
    return this.alertsSubject.asObservable();
  }

  getMaterialUpdates(): Observable<any> {
    return this.materialUpdatesSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  reconnect(): void {
    this.disconnect();
    this.initializeSocket();
  }
}
```

## 🛡️ Error Handling & Interceptors

### Error Interceptor
```typescript
// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden - show access denied message
          console.error('Access denied');
        } else if (error.status === 0) {
          // Network error
          console.error('Network error - please check your connection');
        }
        
        return throwError(() => error);
      })
    );
  }
}
```

### Loading Interceptor
```typescript
// src/app/core/interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.activeRequests++;
    this.setLoadingState(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.setLoadingState(false);
        }
      })
    );
  }

  private setLoadingState(loading: boolean): void {
    // Emit loading state to your loading service/subject
    // Example: this.loadingService.setLoading(loading);
  }
}
```

## 🎯 Implementation Steps

### 1. Core Setup
1. Create the base API service and interceptors
2. Set up authentication service with JWT handling
3. Configure HTTP interceptors in app.module.ts
4. Set up WebSocket service for real-time features

### 2. Module Implementation Order
Implement services in this order for best dependency management:

1. **Authentication Service** (foundation)
2. **Users Service** (user management)
3. **Customers Service** (basic CRUD)
4. **Projects Service** (project management)
5. **Materials Service** (inventory)
6. **Resources Service** (personnel/machines)
7. **Pieces Service** (piece management)
8. **Tasks Service** (task management)
9. **Comments Service** (collaboration)
10. **Notifications Service** (user notifications)
11. **Alerts Service** (system alerts)
12. **Dashboard Service** (analytics)
13. **Reports Service** (reporting)
14. **Upload Service** (file management)

### 3. Integration Testing
1. Test authentication flow
2. Test CRUD operations for each module
3. Test real-time WebSocket connections
4. Test file upload functionality
5. Test error handling and edge cases

### 4. Module Registration
Add all services to your app.module.ts providers array:

```typescript
// app.module.ts
providers: [
  AuthService,
  UsersService,
  CustomersService,
  ProjectsService,
  PiecesService,
  TasksService,
  ResourcesService,
  MaterialsService,
  CommentsService,
  NotificationsService,
  AlertsService,
  DashboardService,
  ReportsService,
  UploadService,
  WebSocketService,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
]
```

## 📝 Usage Examples

### Component Integration Example
```typescript
// example-component.ts
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../core/services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectsService.getProjects({ page: 1, limit: 10 }).subscribe({
      next: (response) => {
        this.projects = response.projects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  createProject(projectData: any): void {
    this.projectsService.createProject(projectData).subscribe({
      next: (project) => {
        this.projects.unshift(project);
        console.log('Project created successfully');
      },
      error: (error) => {
        console.error('Error creating project:', error);
      }
    });
  }
}
```

## 🎉 Final Notes

This comprehensive guide provides all the necessary API services to integrate with the 100% complete Traksys backend. Each service includes:

- ✅ Full CRUD operations
- ✅ Advanced filtering and search
- ✅ Error handling
- ✅ TypeScript interfaces
- ✅ Authentication integration
- ✅ Real-time WebSocket support
- ✅ File upload capabilities

The backend provides 80+ endpoints across 15 modules, and this guide ensures complete frontend integration with all features including project management, task tracking, inventory management, notifications, alerts, and comprehensive reporting.

**Backend API Documentation**: Visit `http://localhost:3000/api/docs` for interactive API documentation with all endpoints, request/response schemas, and testing capabilities.
