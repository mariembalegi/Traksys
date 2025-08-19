import {Resource} from './resource';

export interface Task {
  id: number;                                 // Unique task identifier
  name: string;                               // Task name
  description: string;                        // Short explanation

  estimatedTime: number;                       // Estimated time (hours)
  spentTime: number;                          // Actual time spent (hours)
  quantity: number;                           // Number of pieces processed in this task

  progress: number;                           // Progress percentage (0-100)
  status: 'To Do' | 'In Progress' | 'Completed' | 'Blocked'; // Current status

  resources: string[];
  dueDate: Date;
  actualFinishDate?: Date;

  createdBy: string;
  creationDate: Date;
}
