import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toasts.asObservable();
  
  private defaultDuration = 5000; // 5 seconds

  showSuccess(message: string, duration?: number) {
    this.addToast({
      message,
      type: 'success',
      duration: duration || this.defaultDuration
    });
  }

  showError(message: string, duration?: number) {
    this.addToast({
      message,
      type: 'error',
      duration: duration || 8000 // Errors stay longer
    });
  }

  showWarning(message: string, duration?: number) {
    this.addToast({
      message,
      type: 'warning',
      duration: duration || this.defaultDuration
    });
  }

  showInfo(message: string, duration?: number) {
    this.addToast({
      message,
      type: 'info',
      duration: duration || this.defaultDuration
    });
  }

  private addToast(toastData: Omit<Toast, 'id' | 'timestamp'>) {
    const toast: Toast = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...toastData
    };

    const currentToasts = this.toasts.value;
    this.toasts.next([toast, ...currentToasts]);

    // Auto-remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string) {
    const currentToasts = this.toasts.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toasts.next(filteredToasts);
  }

  clearAll() {
    this.toasts.next([]);
  }

  // Utility method to get user-friendly error messages
  getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      // Handle validation errors
      if (error.error.errors) {
        const errors = error.error.errors;
        if (Array.isArray(errors)) {
          return errors.map(e => e.message || e).join(', ');
        }
        if (typeof errors === 'object') {
          return Object.values(errors).flat().join(', ');
        }
      }
    }

    // Default error messages based on status code
    if (error?.status) {
      switch (error.status) {
        case 400:
          return 'Bad request. Please check your input.';
        case 401:
          return 'You are not authorized. Please log in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'Conflict: The resource already exists or is in use.';
        case 422:
          return 'Validation failed. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 502:
          return 'Bad gateway. Please try again later.';
        case 503:
          return 'Service unavailable. Please try again later.';
        case 504:
          return 'Gateway timeout. Please try again later.';
        default:
          return `An error occurred (${error.status}). Please try again.`;
      }
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
