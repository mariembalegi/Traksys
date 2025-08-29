import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialService } from './services/material.service';
import { Material } from './models/material';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Traksys');
  private materialService = inject(MaterialService);

  constructor() {
    // Initialize materials globally at app startup (copied from stock.ts)
    const initialMaterials: Material[] = [
      {
        id: "m1",
        material: "Aluminium",
        type: "6061",
        quantity: 120,
        shape: "Cylindrical Bar",
        last_updated: new Date("2025-08-20"),
        diameter: 50,
        length: 2000,
        available_length: 2.0,
        min_length: 1.0,
        pieceIds: ["pc1"]
      },
      {
        id: "m2",
        material: "Steel",
        type: "C55",
        quantity: 80,
        shape: "Plate",
        last_updated: new Date("2025-08-18"),
        x: 1000,
        y: 500,
        thickness: 20,
        available_area: 1.2,
        min_area: 0.2,
        pieceIds: ["pc2", "pc3"]
      },
      {
        id: "m3",
        material: "Copper",
        type: "Cu-ETP",
        quantity: 60,
        shape: "Cylindrical Bar",
        last_updated: new Date("2025-08-15"),
        diameter: 10,
        length: 1500,
        available_length: 1.5,
        min_length: 0.8,
        pieceIds: ["pc4"]
      },
      {
        id: "m4",
        material: "Brass",
        type: "CuZn37",
        quantity: 40,
        shape: "Plate",
        last_updated: new Date("2025-08-10"),
        x: 800,
        y: 400,
        thickness: 15,
        available_area: 0.9,
        min_area: 0.15,
        pieceIds: ["pc5"]
      },
      {
        id: "m5",
        material: "Titanium",
        type: "Grade 2",
        quantity: 25,
        shape: "Cylindrical Bar",
        last_updated: new Date("2025-08-05"),
        diameter: 20,
        length: 1200,
        available_length: 1.2,
        min_length: 0.5,
        pieceIds: ["pc6"]
      },
      {
        id: "m6",
        material: "Plastic",
        type: "ABS",
        quantity: 200,
        shape: "Plate",
        last_updated: new Date("2025-08-01"),
        x: 200,
        y: 100,
        thickness: 5,
        available_area: 0.2,
        min_area: 0.3,
        pieceIds: ["pc7"]
      },
      {
        id: "m7",
        material: "Lead",
        type: "Pb",
        quantity: 10,
        shape: "Cylindrical Bar",
        last_updated: new Date("2025-07-28"),
        diameter: 30,
        length: 800,
        available_length: 0.8,
        min_length: 0.3,
        pieceIds: ["pc8"]
      },
      {
        id: "m8",
        material: "Zinc",
        type: "Zn",
        quantity: 30,
        shape: "Plate",
        last_updated: new Date("2025-07-25"),
        x: 300,
        y: 150,
        thickness: 8,
        available_area: 0.1,
        min_area: 0.1,
        pieceIds: ["pc9"]
      },
      {
        id: "m9",
        material: "Nickel",
        type: "Ni",
        quantity: 15,
        shape: "Cylindrical Bar",
        last_updated: new Date("2025-07-20"),
        diameter: 12,
        length: 600,
        available_length: 0.6,
        min_length: 0.7,
        pieceIds: ["pc10"]
      },
      {
        id: "m10",
        material: "Magnesium",
        type: "Mg",
        quantity: 5,
        shape: "Plate",
        last_updated: new Date("2025-07-15"),
        x: 100,
        y: 50,
        thickness: 2,
        available_area: 0.05,
        min_area: 0.05,
        pieceIds: ["pc11"]
      }
    ];
    for (let i = 11; i <= 60; i++) {
      if (i % 2 === 0) {
        initialMaterials.push({
          id: `m${i}`,
          material: `Material${i}`,
          type: "TypeA",
          quantity: 10 * i,
          shape: "Plate",
          last_updated: new Date(2025, 7, 1 + i),
          x: 100 + i * 5,
          y: 50 + i * 2,
          thickness: 5 + i,
          available_area: 0.1 + (i * 0.01),
          min_area: 0.05 + (i * 0.005),
          pieceIds: [`pc${i}`]
        });
      } else {
        initialMaterials.push({
          id: `m${i}`,
          material: `Material${i}`,
          type: "TypeB",
          quantity: 10 * i,
          shape: "Cylindrical Bar",
          last_updated: new Date(2025, 7, 1 + i),
          diameter: 10 + i,
          length: 1000 + i * 10,
          available_length: 0.5 + (i * 0.05),
          min_length: 0.3 + (i * 0.03),
          pieceIds: [`pc${i}`]
        });
      }
    }
    this.materialService.setMaterials(initialMaterials);
  }
}
