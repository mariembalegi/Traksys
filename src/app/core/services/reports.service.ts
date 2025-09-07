import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  getTaskCompletionReport(params?: {
    startDate?: string;
    endDate?: string;
    projectId?: string;
    resourceId?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/task-completion`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getProductivityReport(params?: {
    startDate?: string;
    endDate?: string;
    resourceId?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/productivity`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getInventoryReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/inventory`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
