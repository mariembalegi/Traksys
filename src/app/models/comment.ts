export interface Comment {
  _id: string;
  taskId: string;
  authorId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
