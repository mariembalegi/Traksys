import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Material } from '../models/material';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private materials: Material[] = [];
  private materials$ = new BehaviorSubject<Material[]>([]);

  constructor(private alertService: AlertService) {}

  setMaterials(materials: Material[]) {
    this.materials = materials;
    this.materials$.next(materials);
    this.checkLowStockAlerts();
  }

  getMaterials() {
    return this.materials$;
  }

  checkLowStockAlerts() {
    const currentAlerts = this.alertService['alerts'].value;
    const alertKeys = new Set((currentAlerts.filter((a: any) => a.type === 'low-stock')).map((a: any) => `${a.message}`));
    this.materials.forEach(material => {
      const isLow = (typeof material.available_length === 'number' && typeof material.min_length === 'number' && material.available_length <= material.min_length)
        || (typeof material.available_area === 'number' && typeof material.min_area === 'number' && material.available_area <= material.min_area);
      const remaining = typeof material.available_length === 'number' ? `${material.available_length} mm` :
                        typeof material.available_area === 'number' ? `${material.available_area} mm²` : `${material.quantity} units`;
      const alertMessage = `${material.material} (${material.type}) inventory is running low (${remaining} remaining)`;
      if (isLow && !alertKeys.has(alertMessage)) {
        this.alertService.addAlert({
          id: Number(`${material.id}${material.type}`.replace(/\D/g, '')), // Unique id from material id and type
          type: 'low-stock',
          title: 'Low Stock Alert',
          message: alertMessage,
          severity: 'high',
          timestamp: new Date()
        });
      }
    });
  }
}
