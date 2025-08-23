type Shape = "Cylindrical Bar" | "Plate";
type Unit = "mm" | "m";

export interface Material {
  id: string;
  material: string;     // e.g., Aluminium, Steel
  type: string;         // e.g., C55, 6061, Inox 304
  quantity: number;     // stock quantity
  shape: Shape;         // "Cylindrical Bar" or "Plate"
  last_updated: Date;   // Date object
  unit: Unit;           // unit of dimensions (mm or m)

  // Dimensions
  diameter?: number;    // only for Cylindrical Bar
  length?: number;      // only for Cylindrical Bar
  x?: number;           // only for Plate
  y?: number;           // only for Plate
  thickness?: number;   // only for Plate
}
