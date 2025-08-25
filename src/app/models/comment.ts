export interface Comment {
  id: string;
  taskId: string;          // FK → Task
  authorId: string;        // FK → Resource or User
  message: string;
  createdAt: Date;
}
