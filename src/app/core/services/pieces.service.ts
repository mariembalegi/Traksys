import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface Piece {
  id: string;
  reference: string;
  name: string;
  description: string;
  designFile?: string;
  designPicture?: string;
  materialId: string;
  materialQuantity: number;
  quantity: number;
  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked';
  taskIds: string[];
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PiecesResponse {
  pieces: Piece[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PieceDetails {
  piece: Piece;
  project: any;
  material: any;
  tasks: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PiecesService extends BaseApiService {
  
  getPieces(params?: {
    page?: number;
    limit?: number;
    search?: string;
    projectId?: string;
    status?: string;
  }): Observable<PiecesResponse> {
    return this.http.get<PiecesResponse>(`${this.apiUrl}/pieces`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getPiece(id: string): Observable<PieceDetails> {
    return this.http.get<PieceDetails>(`${this.apiUrl}/pieces/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createPiece(pieceData: Omit<Piece, 'id' | 'taskIds' | 'createdAt' | 'updatedAt'>): Observable<Piece> {
    return this.http.post<Piece>(`${this.apiUrl}/pieces`, pieceData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePiece(id: string, pieceData: Partial<Piece>): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/pieces/${id}`, pieceData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePieceProgress(id: string, progress: number): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/pieces/${id}/progress`, { progress }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updatePieceStatus(id: string, status: string): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/pieces/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deletePiece(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/pieces/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
