import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: number;
  type: 'low-stock' | 'maintenance';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alerts = new BehaviorSubject<Alert[]>([]);
  alerts$ = this.alerts.asObservable();

  addAlert(alert: Alert) {
    this.alerts.next([alert, ...this.alerts.value]);
  }

  clearAlerts() {
    this.alerts.next([]);
  }
}
