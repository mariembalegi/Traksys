import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  projectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseApiService {
  
  getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<CustomersResponse> {
    return this.http.get<CustomersResponse>(`${this.apiUrl}/customers`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(params)
    }).pipe(catchError(this.handleError));
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  createCustomer(customerData: Omit<Customer, 'id' | 'projectIds' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customerData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${id}`, customerData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteCustomer(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/customers/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
