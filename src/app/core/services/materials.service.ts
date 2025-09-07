import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface Material {
  id: string;
  material: string;
  type: string;
  quantity: number;
  available_length?: number;
  available_area?: number;
  min_length?: number;
  min_area?: number;
  shape: 'Cylindrical Bar' | 'Plate';
  diameter?: number;
  length?: number;
  x?: number;
  y?: number;
  thickness?: number;
  pieceIds: string[];
  last_updated: Date;
  createdAt: Date;
}

export interface MaterialsResponse {
  materials: Material[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialsService extends BaseApiService {
  
  getMaterials(params?: {
    page?: number;
    limit?: number;
    search?: string;
    shape?: string;
    lowStock?: boolean;
    criticalStock?: boolean;
  }): Observable<MaterialsResponse> {
    return this.http.get<MaterialsResponse>(`${this.apiUrl}/materials`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getLowStockMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials/low-stock`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getCriticalStockMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials/critical-stock`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getStockLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materials/stock-levels`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getMaterial(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/materials/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createMaterial(materialData: Omit<Material, 'id' | 'pieceIds' | 'last_updated' | 'createdAt'>): Observable<Material> {
    return this.http.post<Material>(`${this.apiUrl}/materials`, materialData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateMaterial(id: string, materialData: Partial<Material>): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/materials/${id}`, materialData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateStock(id: string, stockData: {
    quantity?: number;
    available_length?: number;
    available_area?: number;
  }): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/materials/${id}/stock`, stockData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  consumeMaterial(id: string, consumeData: {
    quantity: number;
    length?: number;
    area?: number;
    pieceId: string;
  }): Observable<Material> {
    return this.http.post<Material>(`${this.apiUrl}/materials/${id}/consume`, consumeData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteMaterial(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/materials/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
