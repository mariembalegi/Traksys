import { Component } from '@angular/core';
import {Material} from '../../models/material';

@Component({
  selector: 'app-stock',
  imports: [],
  templateUrl: './stock.html',
  styleUrl: './stock.scss'
})
export class Stock {
  materials: Material[] = [
    {
      id: "1",
      material: "Aluminium",
      type: "C55",
      quantity: 20,
      shape: "Cylindrical Bar",
      diameter: 50,        // mm
      length: 2000,        // mm
      unit: "mm",
      last_updated: new Date("2025-08-20")
    },
    {
      id: "2",
      material: "Steel",
      type: "S235",
      quantity: 10,
      shape: "Plate",
      x: 1000,             // mm
      y: 500,              // mm
      thickness: 10,       // mm
      unit: "mm",
      last_updated: new Date("2025-08-18")
    },
    {
      id: "3",
      material: "Aluminium",
      type: "6061",
      quantity: 5,
      shape: "Plate",
      x: 0.5,              // m
      y: 0.5,              // m
      thickness: 0.01,     // m
      unit: "m",
      last_updated: new Date("2025-08-15")
    },
    {
      id: "4",
      material: "Steel",
      type: "Inox 304",
      quantity: 8,
      shape: "Cylindrical Bar",
      diameter: 100,       // mm
      length: 1500,        // mm
      unit: "mm",
      last_updated: new Date("2025-08-10")
    },
    {
      id: "5",
      material: "Copper",
      type: "C110",
      quantity: 12,
      shape: "Plate",
      x: 300,              // mm
      y: 300,              // mm
      thickness: 5,        // mm
      unit: "mm",
      last_updated: new Date("2025-08-05")
    }
  ];
}
