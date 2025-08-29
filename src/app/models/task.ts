export interface Task {
  id: string;
  name: string;
  description: string;

  estimatedTime: number;   // in hours
  spentTime: number;
  quantity: number;

  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'On Hold';

  resourceIds: string[];   // N..N → Resources
  commentIds: string[];    // 1..N → Comments
  pieceId?: string;        // FK → Piece

  dueDate: Date;
  actualFinishDate?: Date;

  createdBy: string;
  creationDate: Date;
}
