import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { User } from './auth.service';

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
