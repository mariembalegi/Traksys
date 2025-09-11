import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Don't show toast for certain endpoints (like silent auth checks)
        const skipToast = this.shouldSkipToast(req, error);
        
        if (!skipToast) {
          const errorMessage = this.toastService.getErrorMessage(error);
          this.toastService.showError(errorMessage);
        }

        // Handle specific error cases
        if (error.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden - already handled by toast above
          console.error('Access denied');
        } else if (error.status === 0) {
          // Network error - show specific message
          if (!skipToast) {
            this.toastService.showError('Network error - please check your connection');
          }
        }
        
        return throwError(() => error);
      })
    );
  }

  private shouldSkipToast(req: HttpRequest<any>, error: HttpErrorResponse): boolean {
    // Skip toast for certain endpoints or error types
    const skipEndpoints = [
      '/auth/refresh',
      '/auth/check',
      '/health'
    ];

    // Skip toast for certain status codes in specific contexts
    const skipFor401 = req.url.includes('/auth/') && error.status === 401;
    const skipForHealthCheck = req.url.includes('/health');
    const skipForSilentEndpoints = skipEndpoints.some(endpoint => req.url.includes(endpoint));

    return skipFor401 || skipForHealthCheck || skipForSilentEndpoints;
  }
}
