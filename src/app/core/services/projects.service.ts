import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { Customer } from './customers.service';

export interface Project {
  _id: string;
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
