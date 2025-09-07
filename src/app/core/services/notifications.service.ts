import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
