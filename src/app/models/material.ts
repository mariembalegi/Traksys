export interface Material {
  id: string;
  material: string;
  type: string;
  quantity: number;
  available_length?: number;
  available_area?: number;
  min_length?: number;
  min_area?: number;
  shape: 'Cylindrical Bar' | 'Plate';
  diameter?: number;
  length?: number;
  x?: number;
  y?: number;
  thickness?: number;
  pieceIds: string[];
  last_updated: Date;
  createdAt?: Date;
}
