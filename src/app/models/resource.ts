export interface Resource {
  id: string;
  name: string;
  type: 'Person' | 'Machine';
  taskIds: string[];       // N..N → Tasks
}
