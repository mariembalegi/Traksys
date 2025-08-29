import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  trackByAlertId(index: number, alert: Alert): string {
    return `${alert.id}-${index}`;
  }
  private alertService = inject(AlertService);
  private materialService = inject(MaterialService);
  systemAlerts: Alert[] = [];

  ngOnInit() {
    // Set the same materials as in stock.ts to trigger alerts globally
    this.materialService.setMaterials([
      {
        id: "m0",
        material: "CriticalZero",
        type: "CZ",
        quantity: 0,
        shape: "Cylindrical Bar",
        last_updated: new Date(),
        diameter: 10,
        length: 100,
        available_length: 0,
        min_length: 1.0,
        pieceIds: []
      },
      {
        id: "m00",
        material: "CriticalAreaZero",
        type: "CAZ",
        quantity: 0,
        shape: "Plate",
        last_updated: new Date(),
        x: 100,
        y: 50,
        thickness: 5,
        available_area: 0,
        min_area: 0.1,
        pieceIds: []
      },
      // ...add other materials as needed, matching stock.ts...
    ]);
    this.alertService.alerts$.subscribe(alerts => {
      this.systemAlerts = alerts;
    });
  }

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
