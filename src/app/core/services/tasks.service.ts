import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
