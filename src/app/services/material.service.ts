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
    const alertKeys = new Set(currentAlerts.map((a: any) => `${a.type}:${a.message}`));
    this.materials.forEach(material => {
      let isCritical = false;
      let isLow = false;
      let alertMessage = '';
      let alertType: 'low-stock' | 'critical-stock' | undefined = undefined;
      let alertTitle: string | undefined = undefined;
      // Check for critical (out of stock)
      if (typeof material.available_length === 'number' && material.available_length === 0) {
        isCritical = true;
        alertMessage = `${material.material} (${material.type}) completely out of stock`;
        alertType = 'critical-stock';
        alertTitle = 'Critical Stock Level';
      } else if (typeof material.available_area === 'number' && material.available_area === 0) {
        isCritical = true;
        alertMessage = `${material.material} (${material.type}) completely out of stock`;
        alertType = 'critical-stock';
        alertTitle = 'Critical Stock Level';
      } else if ((typeof material.available_length === 'number' && typeof material.min_length === 'number' && material.available_length > 0 && material.available_length <= material.min_length)
        || (typeof material.available_area === 'number' && typeof material.min_area === 'number' && material.available_area > 0 && material.available_area <= material.min_area)) {
        isLow = true;
        const remaining = typeof material.available_length === 'number' ? `${material.available_length} mm` :
                          typeof material.available_area === 'number' ? `${material.available_area} mm²` : `${material.quantity} units`;
        alertMessage = `${material.material} (${material.type}) inventory is running low (${remaining} remaining)`;
        alertType = 'low-stock';
        alertTitle = 'Low Stock Alert';
      }
      if ((isCritical || isLow) && alertType && alertTitle && !alertKeys.has(`${alertType}:${alertMessage}`)) {
        this.alertService.addAlert({
          id: Number(`${material.id}${material.type}`.replace(/\D/g, '')), // Unique id from material id and type
          type: alertType,
          title: alertTitle,
          message: alertMessage,
          severity: 'high',
          timestamp: new Date()
        });
      }
    });
  }
}
