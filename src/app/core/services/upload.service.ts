import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService extends BaseApiService {
  
  uploadDesignFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/design-file`, formData, {
      headers
    }).pipe(catchError(this.handleError));
  }

  uploadDesignPicture(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/design-picture`, formData, {
      headers
    }).pipe(catchError(this.handleError));
  }

  uploadFile(file: File, endpoint: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/${endpoint}`, formData, {
      headers
    }).pipe(catchError(this.handleError));
  }

  deleteFile(filename: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/upload/${filename}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
