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

  addProgressNotification(taskName: string, producedQuantity: number, totalQuantity: number, userRole: string, taskId: string) {
    const notification: Notification = {
      id: `progress_${Date.now()}`,
      title: 'Progress Update',
      message: `${userRole}: ${producedQuantity} out of ${totalQuantity} pieces completed on "${taskName}"`,
      timestamp: new Date(),
      type: 'progress',
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
}
