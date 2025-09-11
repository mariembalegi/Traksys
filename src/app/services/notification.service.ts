import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'progress' | 'info' | 'warning' | 'success';
  taskId?: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([
    {
      id: 'n1',
      title: 'Project Update',
      message: 'Project "Industrial Pump" updated',
      timestamp: new Date('2025-08-25T10:30:00'),
      type: 'info',
      read: false
    },
    {
      id: 'n2',
      title: 'Task Assignment',
      message: 'New task assigned to you',
      timestamp: new Date('2025-08-25T09:15:00'),
      type: 'info',
      read: false
    },
    {
      id: 'n3',
      title: 'Workflow Complete',
      message: 'Workflow "Design" completed',
      timestamp: new Date('2025-08-25T08:45:00'),
      type: 'success',
      read: true
    }
  ]);

  notifications$ = this.notifications.asObservable();

  addProgressNotification(taskName: string, producedQuantity: number, totalQuantity: number, userRole: string, taskId: string, projectName?: string, pieceName?: string) {
    let message = `${userRole}: ${producedQuantity} out of ${totalQuantity} pieces completed on "${taskName}"`;
    
    if (projectName && pieceName) {
      message = `${userRole}: ${producedQuantity} out of ${totalQuantity} pieces completed on "${taskName}" (Project: ${projectName}, Piece: ${pieceName})`;
    } else if (projectName) {
      message = `${userRole}: ${producedQuantity} out of ${totalQuantity} pieces completed on "${taskName}" (Project: ${projectName})`;
    } else if (pieceName) {
      message = `${userRole}: ${producedQuantity} out of ${totalQuantity} pieces completed on "${taskName}" (Piece: ${pieceName})`;
    }

    const notification: Notification = {
      id: `progress_${Date.now()}`,
      title: 'Progress Update',
      message: message,
      timestamp: new Date(),
      type: 'progress',
      taskId: taskId,
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);
  }

  addProductionNotification(taskName: string, piecesAdded: number, totalProduced: number, totalQuantity: number, taskId: string) {
    const notification: Notification = {
      id: `production_${Date.now()}`,
      title: 'Production Update',
      message: `${piecesAdded} piece${piecesAdded > 1 ? 's' : ''} added to "${taskName}" (${totalProduced}/${totalQuantity} completed)`,
      timestamp: new Date(),
      type: 'success',
      taskId: taskId,
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);
  }

  markAsRead(notificationId: string) {
    const notifications = this.notifications.value.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notifications.next(notifications);
  }

  markAllAsRead() {
    const notifications = this.notifications.value.map(n => ({ ...n, read: true }));
    this.notifications.next(notifications);
  }

  getUnreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  clearNotification(notificationId: string) {
    const notifications = this.notifications.value.filter(n => n.id !== notificationId);
    this.notifications.next(notifications);
  }

  showSuccess(message: string) {
    const notification: Notification = {
      id: `success_${Date.now()}`,
      title: 'Success',
      message: message,
      timestamp: new Date(),
      type: 'success',
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);
  }

  showError(message: string) {
    const notification: Notification = {
      id: `error_${Date.now()}`,
      title: 'Error',
      message: message,
      timestamp: new Date(),
      type: 'warning',
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);
  }

  showInfo(message: string) {
    const notification: Notification = {
      id: `info_${Date.now()}`,
      title: 'Information',
      message: message,
      timestamp: new Date(),
      type: 'info',
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);
  }
}
