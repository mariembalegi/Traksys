type Shape = "Cylindrical Bar" | "Plate";
type Unit = "mm" | "m";

export interface Material {
  id: string;
  material: string;        // e.g., Aluminium, Steel
  type: string;            // e.g., C55, 6061, Inox 304
  quantity: number;        // stock quantity
  shape: Shape;            // "Cylindrical Bar" or "Plate"
  unit: Unit;              // mm, m, kg etc.
  last_updated: Date;

  // Dimensions
  diameter?: number;       // for Cylindrical Bar
  length?: number;         // for Cylindrical Bar
  x?: number;              // for Plate
  y?: number;              // for Plate
  thickness?: number;      // for Plate

  pieceIds: string[];      // FKs → Pieces
}
