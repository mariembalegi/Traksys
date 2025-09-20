export interface Task {
  _id: string;
  name: string;
  description: string;
  estimatedTime: number;
  spentTime: number;
  quantity: number;
  progress: number;
  status: 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
  resourceIds: string[];
  commentIds: string[];
  pieceId?: string;
  dueDate: Date;
  actualFinishDate?: Date;
  createdBy: string;
  creationDate: Date;
  updatedAt?: Date;
}
