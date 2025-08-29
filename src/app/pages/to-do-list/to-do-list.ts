import { Component } from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Resource} from '../../models/resource';
import {StatusHeader} from '../../components/status-header/status-header';
import {TaskCard} from '../../components/task-card/task-card';
import {Project} from '../../models/project';
import {NgForOf, CommonModule} from '@angular/common';
import {Piece} from '../../models/piece';
import {Task} from '../../models/task';
import {FormsModule} from '@angular/forms';
import {Comment} from '../../models/comment';
import {TaskDetailDialog} from '../../components/task-detail-dialog/task-detail-dialog';

@Component({
  selector: 'app-to-do-list',
  imports: [
    CommonModule,
    NgSelectComponent,
    StatusHeader,
    TaskCard,
    NgForOf,
    FormsModule,
    TaskDetailDialog
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss'
})
export class ToDoList {

  selectedResourceId: string | null = null;
  toDoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  onHoldTasks: Task[] = [];

  // Dialog properties
  isDialogVisible: boolean = false;
  selectedTask: Task | null = null;
  selectedTaskComments: Comment[] = [];
  selectedProject: Project | null = null;

  projects: Project[] = [
    {
      id: "p1",
      name: "CNC Machine Housing",
      description: "Project for producing CNC machine housing parts.",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "/designs/cnc_project.dxf",
      customerId: "c1",
      pieceIds: ["pc1", "pc2"],
      progress: 65,
      opened: new Date("2025-08-01"),
      delivery: new Date("2025-09-15"),
      invoiceAmount: 15000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p2",
      name: "Robotic Arm",
      description: "Fabrication of components for robotic arm prototype.",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "/designs/robotic_arm.dxf",
      customerId: "c2",
      pieceIds: ["pc3"],
      progress: 20,
      opened: new Date("2025-08-10"),
      delivery: new Date("2025-10-01"),
      invoiceAmount: 8000,
      currency: "EUR",
      isOpen: true
    }
  ];

  resources: Resource[] = [
    { id: "r1", name: "CNC Operator", type: "Person", taskIds: ["t1", "t4"] },
    { id: "r2", name: "Lathe Machine", type: "Machine", taskIds: ["t1"] },
    { id: "r3", name: "Welder", type: "Person", taskIds: ["t3"] }
  ];

  pieces: Piece[] = [
    {
      id: "pc1",
      reference: "HSG-001",
      name: "Housing Base",
      description: "Base plate for CNC machine housing.",
      designFile: "/designs/housing_base.dxf",
      designPicture: "/img/housing_base.png",
      materialId: "m1",
      materialQuantity: 2,
      quantity: 10,
      progress: 80,
      status: "In Progress",
      taskIds: ["t1", "t2"]
    },
    {
      id: "pc2",
      reference: "HSG-002",
      name: "Side Panel",
      description: "Steel side panel for CNC machine.",
      designFile: "/designs/side_panel.dxf",
      designPicture: "/img/side_panel.png",
      materialId: "m2",
      materialQuantity: 5,
      quantity: 20,
      progress: 50,
      status: "In Progress",
      taskIds: ["t3"]
    },
    {
      id: "pc3",
      reference: "RB-001",
      name: "Arm Joint",
      description: "Steel joint for robotic arm.",
      designFile: "/designs/arm_joint.dxf",
      designPicture: "/img/arm_joint.png",
      materialId: "m2",
      materialQuantity: 3,
      quantity: 15,
      progress: 10,
      status: "To Do",
      taskIds: ["t4"]
    },
    {
      id: "pc4",
      reference: "TEST-001",
      name: "Test Component",
      description: "Test component for timer functionality.",
      designFile: "/designs/test_component.dxf",
      designPicture: "/img/test_component.png",
      materialId: "m1",
      materialQuantity: 1,
      quantity: 5,
      progress: 20,
      status: "In Progress",
      taskIds: ["t5"]
    }
  ];

  tasks: Task[] = [
    {
      id: "t1",
      name: "Cut Base Plate",
      description: "Cut aluminium bar to base plate dimensions.",
      estimatedTime: 5,
      spentTime: 4,
      quantity: 10,
      progress: 80,
      status: "In Progress",
      resourceIds: ["r1", "r2"],
      commentIds: ["cm1", "cm3", "cm5"],
      pieceId: "pc1",
      dueDate: new Date("2025-08-25"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-15")
    },
    {
      id: "t2",
      name: "Drill Holes",
      description: "Drill mounting holes into base plate.",
      estimatedTime: 3,
      spentTime: 0,
      quantity: 10,
      progress: 0,
      status: "To Do",
      resourceIds: ["r1"],
      commentIds: [],
      pieceId: "pc1",
      dueDate: new Date("2025-08-28"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-16")
    },
    {
      id: "t3",
      name: "Weld Side Panel",
      description: "Weld side panel for CNC housing.",
      estimatedTime: 6,
      spentTime: 2,
      quantity: 20,
      progress: 30,
      status: "In Progress",
      resourceIds: ["r3"],
      commentIds: ["cm2", "cm4"],
      pieceId: "pc2",
      dueDate: new Date("2025-09-05"),
      actualFinishDate: undefined,
      createdBy: "r3",
      creationDate: new Date("2025-08-18")
    },
    {
      id: "t4",
      name: "Polish Joint",
      description: "Surface finishing for robotic arm joint.",
      estimatedTime: 4,
      spentTime: 0,
      quantity: 15,
      progress: 0,
      status: "To Do",
      resourceIds: ["r1"],
      commentIds: [],
      pieceId: "pc3",
      dueDate: new Date("2025-09-10"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-20")
    },
    {
      id: "t5",
      name: "Test Timer Task",
      description: "A test task to check timer functionality with 1 minute spent time.",
      estimatedTime: 1/60, // 1 minute estimated (in hours)
      spentTime: 1/60, // 1 minute spent (in hours)
      quantity: 5,
      progress: 20,
      status: "In Progress",
      resourceIds: ["r1"],
      commentIds: [],
      pieceId: "pc1",
      dueDate: new Date("2025-08-26"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-25")
    }
  ];

  comments: Comment[] = [
    {
      id: "cm1",
      taskId: "t1",
      authorId: "r1",
      message: "Cutting process started successfully. Material preparation complete.",
      createdAt: new Date("2025-08-15T10:00:00")
    },
    {
      id: "cm2",
      taskId: "t3",
      authorId: "r3",
      message: "Welding in progress, waiting for quality check.",
      createdAt: new Date("2025-08-18T14:30:00")
    },
    {
      id: "cm3",
      taskId: "t1",
      authorId: "r2",
      message: "CNC machine calibration completed. Ready for cutting operation.",
      createdAt: new Date("2025-08-15T08:30:00")
    },
    {
      id: "cm4",
      taskId: "t3",
      authorId: "r3",
      message: "First pass welding completed. Need to check for defects before second pass.",
      createdAt: new Date("2025-08-19T09:15:00")
    }
  ];


  updateTasksByResource(selectedResourceId: string) {
    const tasksForResource = this.tasks.filter(task =>
      task.resourceIds.includes(selectedResourceId)
    );
    this.toDoTasks = tasksForResource.filter(task => task.status === 'To Do');
    this.inProgressTasks = tasksForResource.filter(task => task.status === 'In Progress');
    this.completedTasks = tasksForResource.filter(task => task.status === 'Completed');
    this.onHoldTasks = tasksForResource.filter(task => task.status === 'On Hold');
  }

  openTaskDialog(task: Task) {
    this.selectedTask = task;
    this.selectedTaskComments = this.comments.filter(comment => comment.taskId === task.id);
    this.selectedProject = this.findProjectForTask(task);
    this.isDialogVisible = true;
  }

  findProjectForTask(task: Task): Project | null {
    // Find the piece that contains this task
    const piece = this.pieces.find(piece => piece.taskIds.includes(task.id));
    if (!piece) return null;
    
    // Find the project that contains this piece
    return this.projects.find(project => project.pieceIds.includes(piece.id)) || null;
  }

  closeTaskDialog() {
    this.isDialogVisible = false;
    this.selectedTask = null;
    this.selectedTaskComments = [];
    this.selectedProject = null;
  }

  addComment(commentText: string) {
    if (this.selectedTask) {
      const newComment: Comment = {
        id: `cm${this.comments.length + 1}`,
        taskId: this.selectedTask.id,
        authorId: this.selectedResourceId || 'r1', // Use selected resource or default
        message: commentText,
        createdAt: new Date()
      };
      
      this.comments.push(newComment);
      this.selectedTaskComments = this.comments.filter(comment => comment.taskId === this.selectedTask!.id);
      
      // Update the task's comment count
      const task = this.tasks.find(t => t.id === this.selectedTask!.id);
      if (task) {
        task.commentIds.push(newComment.id);
      }
    }
  }

  updateTaskQuantity(event: {taskId: string, producedQuantity: number}) {
    const task = this.tasks.find(t => t.id === event.taskId);
    if (task) {
      // Find the piece that contains this task
      const piece = this.pieces.find(p => p.taskIds.includes(event.taskId));
      if (piece) {
        // Calculate new progress based on produced quantity
        const newProgress = Math.min(100, Math.round((event.producedQuantity / piece.quantity) * 100));
        task.progress = newProgress;
        
        // Update piece progress if this task represents the main work
        piece.progress = newProgress;
        
        // Update status based on progress
        if (newProgress === 100) {
          task.status = 'Completed';
          piece.status = 'Completed';
        } else if (newProgress > 0) {
          task.status = 'In Progress';
          piece.status = 'In Progress';
        }
      }
      
      // Re-filter tasks to update the UI
      if (this.selectedResourceId) {
        this.updateTasksByResource(this.selectedResourceId);
      }
    }
  }

  // Helper methods to get piece information
  getPieceName(pieceId: string): string {
    const piece = this.pieces.find(p => p.id === pieceId);
    return piece ? piece.name : '';
  }

  getPieceReference(pieceId: string): string {
    const piece = this.pieces.find(p => p.id === pieceId);
    return piece ? piece.reference : '';
  }
}
