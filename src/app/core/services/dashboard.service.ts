import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
