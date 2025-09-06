export interface Piece {
  id: string;
  reference: string;       // Unique identifier
  name: string;
  description: string;

  designFile: string;
  designPicture: string;

  quantity: number;
  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked';

  taskIds: string[];       // FKs → Tasks
}
