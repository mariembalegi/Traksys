import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
