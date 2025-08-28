import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Material } from '../models/material';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  public static STOCK_ARRAY: Material[] = [
    {
      id: "m1",
      material: "Aluminium",
      type: "6061",
      quantity: 120,
  // minQuantity removed
  shape: "Cylindrical Bar",
  unit: "mm",
  last_updated: new Date("2025-08-20"),
  diameter: 50,
  length: 2000,
  available_length: 2,
  pieceIds: ["pc1"]
    },
    {
      id: "m2",
      material: "Steel",
      type: "C55",
      quantity: 80,
  // minQuantity removed
  shape: "Plate",
  unit: "mm",
  last_updated: new Date("2025-08-18"),
  x: 1000,
  y: 500,
  thickness: 20,
  available_area: 0.5,
  pieceIds: ["pc2", "pc3"]
    },
    {
      id: "m3",
      material: "Copper",
      type: "Cu-ETP",
      quantity: 60,
  // minQuantity removed
  shape: "Cylindrical Bar",
  unit: "mm",
  last_updated: new Date("2025-08-15"),
  diameter: 10,
  length: 1500,
  available_length: 1.5,
  pieceIds: ["pc4"]
    },
    {
      id: "m4",
      material: "Brass",
      type: "CuZn37",
      quantity: 40,
  // minQuantity removed
  shape: "Plate",
  unit: "mm",
  last_updated: new Date("2025-08-10"),
  x: 800,
  y: 400,
  thickness: 15,
  available_area: 0.32,
  pieceIds: ["pc5"]
    },
    {
      id: "m5",
      material: "Titanium",
      type: "Grade 2",
      quantity: 25,
  // minQuantity removed
  shape: "Cylindrical Bar",
  unit: "mm",
  last_updated: new Date("2025-08-05"),
  diameter: 20,
  length: 1200,
  available_length: 1.2,
  pieceIds: ["pc6"]
    },
    {
      id: "m6",
      material: "Plastic",
      type: "ABS",
      quantity: 200,
  // minQuantity removed
  shape: "Plate",
  unit: "mm",
  last_updated: new Date("2025-08-01"),
  x: 200,
  y: 100,
  thickness: 5,
  available_area: 0.02,
  pieceIds: ["pc7"]
    },
    {
      id: "m7",
      material: "Lead",
      type: "Pb",
      quantity: 10,
  // minQuantity removed
  shape: "Cylindrical Bar",
  unit: "mm",
  last_updated: new Date("2025-07-28"),
  diameter: 30,
  length: 800,
  available_length: 0.8,
  pieceIds: ["pc8"]
    },
    {
      id: "m8",
      material: "Zinc",
      type: "Zn",
      quantity: 30,
  // minQuantity removed
  shape: "Plate",
  unit: "mm",
  last_updated: new Date("2025-07-25"),
  x: 300,
  y: 150,
  thickness: 8,
  available_area: 0.045,
  pieceIds: ["pc9"]
    },
    {
      id: "m9",
      material: "Nickel",
      type: "Ni",
      quantity: 15,
  // minQuantity removed
  shape: "Cylindrical Bar",
  unit: "mm",
  last_updated: new Date("2025-07-20"),
  diameter: 12,
  length: 600,
  available_length: 0.6,
  pieceIds: ["pc10"]
    },
    {
      id: "m10",
      material: "Magnesium",
      type: "Mg",
      quantity: 5,
  // minQuantity removed
  shape: "Plate",
  unit: "mm",
  last_updated: new Date("2025-07-15"),
  x: 100,
  y: 50,
  thickness: 2,
  available_area: 0.005,
  pieceIds: ["pc11"]
    }
    // ...add more if needed...
  ];
  private materials = new BehaviorSubject<Material[]>(MaterialService.STOCK_ARRAY);
  materials$ = this.materials.asObservable();

  constructor(private notificationService: NotificationService) {}

  setMaterials(materials: Material[]) {
    this.materials.next(materials);
    this.checkLowStock(materials);
  }

  updateMaterial(updated: Material) {
    const mats = this.materials.value.map(m => m.id === updated.id ? updated : m);
    this.materials.next(mats);
    this.checkLowStock(mats);
  }

  private checkLowStock(materials: Material[]) {
    // Remove previous low stock alerts
  const currentNotifications = (this.notificationService as any).notifications.getValue();
  const filtered = currentNotifications.filter((n: any) => !(n.type === 'warning' && n.title === 'Low Stock Alert'));
  (this.notificationService as any).notifications.next(filtered);
    // Add new low stock alerts
  // If you want to add low stock alerts, implement the logic here or restore the method in NotificationService
  }
}
