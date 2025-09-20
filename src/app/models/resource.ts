export interface Resource {
  _id: string;
  name: string;
  type: 'Person' | 'Machine';
  taskIds?: string[];
  isAvailable: boolean;
  maintenanceSchedule?: Date;
  skills?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
