export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  role?: string;
  isActive?: boolean;
}

export interface Comment {
  _id: string;
  taskId: string;
  authorId: string | User;
  message: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
