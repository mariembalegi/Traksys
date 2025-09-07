import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
