import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface Resource {
  _id: string;
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

export interface ResourceStats {
  totalResources: number;
  machines: number;
  operators: number;
  active: number;
  idle: number;
  maintenance: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResourcesService extends BaseApiService {
  
  getResourceStats(): Observable<ResourceStats> {
    // Calculate stats from the existing resources endpoint
    return this.getResources().pipe(
      map((response: ResourcesResponse) => this.calculateStatsFromResources(response.resources)),
      catchError((error) => {
        console.error('Error calculating resource stats:', error);
        // Return default stats on error
        return of({
          totalResources: 0,
          machines: 0,
          operators: 0,
          active: 0,
          idle: 0,
          maintenance: 0
        });
      })
    );
  }

  private calculateStatsFromResources(resources: Resource[]): ResourceStats {
    const machines = resources.filter(r => r.type === 'Machine').length;
    const operators = resources.filter(r => r.type === 'Person').length;
    const active = resources.filter(r => 
      r.isAvailable && r.taskIds && r.taskIds.length > 0
    ).length;
    const maintenance = resources.filter(r => 
      r.maintenanceSchedule && new Date(r.maintenanceSchedule) <= new Date()
    ).length;
    const idle = resources.filter(r => 
      r.isAvailable && (!r.taskIds || r.taskIds.length === 0) && 
      !(r.maintenanceSchedule && new Date(r.maintenanceSchedule) <= new Date())
    ).length;

    return {
      totalResources: resources.length,
      machines,
      operators,
      active,
      idle,
      maintenance
    };
  }

  getResources(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    available?: boolean;
    status?: string;
  }): Observable<ResourcesResponse> {
    return this.http.get<ResourcesResponse>(`${this.apiUrl}/resources`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(
      catchError((error) => {
        console.error('Error fetching resources:', error);
        // Return empty response on error to prevent app crash
        return of({
          resources: [],
          total: 0,
          page: 1,
          totalPages: 0
        });
      })
    );
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

  createResource(resourceData: Omit<Resource, '_id' | 'taskIds' | 'createdAt' | 'updatedAt'>): Observable<Resource> {
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
