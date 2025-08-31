import {Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-top-navigation-bar',
  imports: [
    NgClass,
    RouterLink,
    NgFor,
    NgIf
  ],
  templateUrl: './top-navigation-bar.html',
  styleUrl: './top-navigation-bar.scss'
})
export class TopNavigationBar implements OnInit, OnDestroy {

  @Input() route1 !:string;
  @Input() route2 !:string;
  @Input() route3 !:string;
  @Input() route4 !:string;
  @Input() route5 !:string;

  notifications: Notification[] = [];
  unreadCount: number = 0;
  isNotificationOpen: boolean = false;
  private notificationSubscription: Subscription = new Subscription();
  
  // User profile data - you can replace this with actual user data from a service
  userName: string = 'Jane Doe';

  constructor(
    public router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.notificationSubscription = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });

    // Close notification dropdown when clicking outside - only in browser
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const notificationDropdown = document.querySelector('.notification-dropdown');
        if (notificationDropdown && !notificationDropdown.contains(target)) {
          this.isNotificationOpen = false;
        }
      });
    }
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }

  isActive(route:string): boolean {
    return this.router.url.includes(route);
  }

  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearNotification(notification: Notification, event: Event) {
    event.stopPropagation();
    this.notificationService.clearNotification(notification.id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'progress': return 'fa-chart-line';
      case 'success': return 'fa-check-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info':
      default: return 'fa-info-circle';
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  }

  getUserInitials(): string {
    if (!this.userName) return 'U';
    
    const names = this.userName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    // Take first letter of first name and first letter of last name
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

}
