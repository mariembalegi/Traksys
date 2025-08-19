export interface Piece {
  reference: string;                // Unique piece identifier
  name: string;              // Name of the piece
  description: string;       // Short explanation

  designFile: string;        // CAD/Blueprint file path
  designPicture: string;     // Image/preview of the design

  material: string;          // Material used
  materialQuantity: number;  // How much material needed
  materialUnit: string;      // Unit of the material (kg, m, etc.)

  quantity: number;          // Number of pieces to produce
  progress: number;          // Progress in percentage (0-100)
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked'; // Current status
}
