export interface Piece {
  _id: string;
  reference: string;
  name: string;
  description: string;
  designFile?: string;
  designPicture?: string;
  materialId?: string;
  materialQuantity?: number;
  quantity: number;
  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked';
  taskIds: string[];
  projectId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
