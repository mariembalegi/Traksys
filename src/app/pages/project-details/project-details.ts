import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Piece} from '../../models/piece';
import {Project} from '../../models/project';
import {Resource} from '../../models/resource';
import {Task} from '../../models/task';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditPieceModal} from '../../components/add-edit-piece-modal/add-edit-piece-modal';
import {AddEditTaskModal} from '../../components/add-edit-task-modal/add-edit-task-modal';
import {ConfirmationModal} from '../../components/confirmation-modal/confirmation-modal';
import { ProjectsService, ProjectDetails as ApiProjectDetails } from '../../core/services/projects.service';
import { PiecesService } from '../../core/services/pieces.service';
import { TasksService } from '../../core/services/tasks.service';
import { ResourcesService } from '../../core/services/resources.service';
import { ToastService } from '../../services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss'
})
export class ProjectDetails implements OnInit {
  projectId!: string;
  selectedProject: ApiProjectDetails | null = null;
  pieces: any[] = [];
  pieceTasks: Map<string, any[]> = new Map(); // Store tasks by pieceId
  isLoading = false;
  isRefreshing = false;
  errorMessage = '';
  resources: Resource[] = [];

  lineOpenSet: Set<string> = new Set();
  dialog1=inject(Dialog);
  dialog2=inject(Dialog);
  dialog3=inject(Dialog); // For confirmation modal
  
  private projectsService = inject(ProjectsService);
  private piecesService = inject(PiecesService);
  private tasksService = inject(TasksService);
  private resourcesService = inject(ResourcesService);
  private toastService = inject(ToastService);

  constructor(private location: Location, private route: ActivatedRoute) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProjectDetails();
    this.loadPieces();
    this.loadResources();
  }

  loadProjectDetails() {
    this.isLoading = true;
    this.isRefreshing = true;
    this.errorMessage = '';

    this.projectsService.getProject(this.projectId).subscribe({
      next: (projectDetails) => {
        this.isLoading = false;
        this.isRefreshing = false;
        this.selectedProject = projectDetails;
      },
      error: (error) => {
        this.isLoading = false;
        this.isRefreshing = false;
        this.errorMessage = 'Failed to load project details';
        console.error('Error loading project details:', error);
      }
    });
  }

  loadResources() {
    this.resourcesService.getResources().subscribe({
      next: (response) => {
        this.resources = response.resources;
      },
      error: (error) => {
        console.error('Error loading resources:', error);
      }
    });
  }

  loadTasksForPiece(pieceId: string) {
    this.tasksService.getTasks({ pieceId: pieceId }).subscribe({
      next: (response) => {
        this.pieceTasks.set(pieceId, response.tasks);
      },
      error: (error) => {
        console.error('Error loading tasks for piece:', error);
      }
    });
  }

  loadPieces() {
    this.piecesService.getPieces({ projectId: this.projectId }).subscribe({
      next: (response) => {
        this.pieces = response.pieces;
      },
      error: (error) => {
        console.error('Error loading pieces:', error);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  toggleDropdown(id: string) {
    if (this.lineOpenSet.has(id)) {
      this.lineOpenSet.delete(id);
    } else {
      this.lineOpenSet.add(id);
      // Load tasks when piece is opened
      this.loadTasksForPiece(id);
    }
  }

  expandAll() {
    if (this.pieces) {
      this.lineOpenSet = new Set(this.pieces.map(p => p._id));
      // Load tasks for all pieces when expanding all
      this.pieces.forEach(piece => {
        this.loadTasksForPiece(piece._id);
      });
    }
  }

  collapseAll() {
    this.lineOpenSet.clear();
  }

  isOpen(id: string): boolean {
    return this.lineOpenSet.has(id);
  }

  getResourceName(resourceId: string): string {
    const resource = this.resources.find(r => r._id === resourceId);
    return resource ? resource.name : resourceId;
  }

  getTasksForPiece(pieceId: string): any[] {
    return this.pieceTasks.get(pieceId) || [];
  }

  protected AddEditPieceModal() {
    const dialogRef = this.dialog1.open(AddEditPieceModal, {
      data: { 
        projectId: this.projectId,
        isEdit: false 
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'saved') {
        this.loadProjectDetails(); // Refresh the project details
        this.loadPieces(); // Refresh the pieces list
        this.toastService.showSuccess('Piece added successfully');
      }
    });
  }

  protected AddEditTaskModal(pieceId?: string) {
    const dialogRef = this.dialog2.open(AddEditTaskModal, {
      data: { 
        projectId: this.projectId,
        pieceId: pieceId || null,
        isEdit: false 
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'saved' && pieceId) {
        // Refresh tasks for the specific piece
        this.loadTasksForPiece(pieceId);
        this.toastService.showSuccess('Task added successfully');
      }
    });
  }

  editPiece(piece: any) {
    const dialogRef = this.dialog1.open(AddEditPieceModal, {
      data: { 
        piece: piece,
        projectId: this.projectId,
        isEdit: true 
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'saved') {
        this.loadPieces(); // Refresh the pieces list
        this.toastService.showSuccess('Piece updated successfully');
      }
    });
  }

  editTask(task: any) {
    const dialogRef = this.dialog2.open(AddEditTaskModal, {
      data: { 
        task: task,
        projectId: this.projectId,
        pieceId: task.pieceId,
        isEdit: true 
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'saved') {
        if (task.pieceId) {
          this.loadTasksForPiece(task.pieceId._id);
        }
        this.toastService.showSuccess('Task updated successfully');
      }
    });
  }

  deletePiece(piece: any) {
    const dialogRef = this.dialog3.open(ConfirmationModal, {
      data: {
        title: 'Delete Piece',
        message: `Are you sure you want to delete the piece "${piece.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === true) {
        this.piecesService.deletePiece(piece._id).subscribe({
          next: () => {
            console.log('Piece deleted successfully, refreshing pieces...'); // Debug log
            this.loadPieces(); // Refresh the pieces list
            this.toastService.showSuccess('Piece deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting piece:', error);
            // Error toast will be shown by the global error interceptor
          }
        });
      }
    });
  }

  deleteTask(task: any, pieceId: string) {
    console.log('Delete task called with:', task, 'for piece:', pieceId); // Debug log
    
    const dialogRef = this.dialog3.open(ConfirmationModal, {
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete the task "${task.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === true) {
        const taskId = task._id || task.id; // Use _id first, fallback to id
        console.log('Deleting task with ID:', taskId); // Debug log
        
        this.tasksService.deleteTask(taskId).subscribe({
          next: () => {
            // Refresh tasks for the specific piece
            console.log('Task deleted successfully, refreshing piece tasks for:', pieceId);
            this.loadTasksForPiece(pieceId);
            this.toastService.showSuccess('Task deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            // Error toast will be shown by the global error interceptor
          }
        });
      }
    });
  }
}
