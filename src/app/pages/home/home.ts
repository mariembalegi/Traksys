import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Alert {
  id: number;
  type: 'low-stock' | 'maintenance';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  systemAlerts: Alert[] = [
    {
      id: 1,
      type: 'low-stock',
      title: 'Low Stock Alert',
      message: 'Steel bars inventory is running low (5 units remaining)',
      severity: 'high',
      timestamp: new Date(2025, 7, 25, 10, 30)
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Maintenance Required',
      message: 'Machine #3 requires scheduled maintenance in 2 days',
      severity: 'medium',
      timestamp: new Date(2025, 7, 25, 8, 15)
    },
    {
      id: 3,
      type: 'low-stock',
      title: 'Critical Stock Level',
      message: 'Aluminum sheets completely out of stock',
      severity: 'high',
      timestamp: new Date(2025, 7, 24, 16, 45)
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Equipment Check',
      message: 'Conveyor belt requires routine inspection',
      severity: 'low',
      timestamp: new Date(2025, 7, 24, 14, 20)
    }
  ];

  getAlertIcon(type: string): string {
    return type === 'low-stock' ? 'fa-box-open' : 'fa-wrench';
  }

  getAlertColor(severity: string): string {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}
