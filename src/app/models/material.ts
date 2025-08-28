type Shape = "Cylindrical Bar" | "Plate";
type Unit = "mm";

export interface Material {       
  min_length?: number; // minimum length for bars
  min_area?: number;   // minimum area for plates
  id: string;
  material: string;        // e.g., Aluminium, Steel
  type: string;            // e.g., C55, 6061, Inox 304
  quantity: number;        // stock quantity
  available_length?: number; // for bars, in mm
  available_area?: number;   // for plates, in square mm
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
