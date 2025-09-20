import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface Comment {
  _id: string;
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
