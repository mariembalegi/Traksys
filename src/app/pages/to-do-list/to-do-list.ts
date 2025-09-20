import { Component, OnInit, OnDestroy } from '@angular/core';
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

// Import services
import { TasksService } from '../../core/services/tasks.service';
import { ProjectsService } from '../../core/services/projects.service';
import { ResourcesService } from '../../core/services/resources.service';
import { PiecesService } from '../../core/services/pieces.service';
import { CommentsService } from '../../core/services/comments.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class ToDoList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
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

  projects: Project[] = [];
  resources: Resource[] = [];
  pieces: Piece[] = [];
  tasks: Task[] = [];
  comments: Comment[] = [];

  // Current user
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  // Loading states
  isLoadingProjects = false;
  isLoadingResources = false;
  isLoadingTasks = false;
  isLoadingPieces = false;

  // Drag and drop properties
  draggedTask: Task | null = null;
  draggedFromStatus: string | null = null;
  isDragging: boolean = false;

  constructor(
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private resourcesService: ResourcesService,
    private piecesService: PiecesService,
    private commentsService: CommentsService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData() {
    this.isLoadingProjects = true;
    this.isLoadingResources = true;
    this.isLoadingPieces = true;

    // Load all required data in parallel
    forkJoin({
      projects: this.projectsService.getProjects({ limit: 100 }),
      resources: this.resourcesService.getResources({ limit: 100 }),
      pieces: this.piecesService.getPieces({ limit: 1000 })
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.projects = data.projects.projects;
        this.resources = data.resources.resources;
        this.pieces = data.pieces.pieces;
        
        this.isLoadingProjects = false;
        this.isLoadingResources = false;
        this.isLoadingPieces = false;

        // Set default resource if available
        if (this.resources.length > 0 && !this.selectedResourceId) {
          this.selectedResourceId = this.resources[0]._id;
          this.loadTasksForResource(this.selectedResourceId);
        }
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.toastService.showError('Failed to load data. Please try again.');
        
        this.isLoadingProjects = false;
        this.isLoadingResources = false;
        this.isLoadingPieces = false;
      }
    });
  }

  private loadTasksForResource(resourceId: string) {
    if (!resourceId) return;

    this.isLoadingTasks = true;
    this.tasksService.getTasks({ 
      resourceId: resourceId,
      limit: 1000
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.filterTasksByStatus();
        this.isLoadingTasks = false;
      },
      error: (error) => {
        console.error('Error loading tasks for resource:', error);
        this.toastService.showError('Failed to load tasks. Please try again.');
        this.isLoadingTasks = false;
        
        // Clear tasks on error
        this.tasks = [];
        this.filterTasksByStatus();
      }
    });
  }

  private filterTasksByStatus() {
    this.toDoTasks = this.tasks.filter(task => task.status === 'To Do');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'In Progress');
    this.completedTasks = this.tasks.filter(task => task.status === 'Completed');
    this.onHoldTasks = this.tasks.filter(task => task.status === 'On Hold');
  }


  updateTasksByResource(selectedResourceId: string) {
    if (!selectedResourceId) return;
    
    this.selectedResourceId = selectedResourceId;
    this.loadTasksForResource(selectedResourceId);
  }

  openTaskDialog(task: Task) {
    // Don't open dialog if we're currently dragging
    if (this.isDragging) {
      return;
    }
    
    this.selectedTask = task;
    this.selectedProject = this.findProjectForTask(task);
    this.isDialogVisible = true;
    
    // Load comments for the selected task
    this.loadTaskComments(task._id);
  }

  private loadTaskComments(taskId: string) {
    this.commentsService.getTaskComments(taskId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (comments) => {
        this.selectedTaskComments = comments;
      },
      error: (error) => {
        console.error('Error loading task comments:', error);
        this.selectedTaskComments = [];
      }
    });
  }

  findProjectForTask(task: Task): Project | null {
    if (!task.pieceId) return null;
    
    // Find the piece that contains this task
    const piece = this.pieces.find(piece => piece._id === task.pieceId);
    if (!piece || !piece.projectId) return null;
    
    // Find the project that contains this piece
    return this.projects.find(project => project._id === piece.projectId) || null;
  }

  closeTaskDialog() {
    this.isDialogVisible = false;
    this.selectedTask = null;
    this.selectedTaskComments = [];
    this.selectedProject = null;
  }

  addComment(commentText: string) {
    if (!this.selectedTask || !commentText.trim()) return;

    this.commentsService.addComment(this.selectedTask._id, commentText.trim()).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (newComment) => {
        // Add the new comment to the list
        this.selectedTaskComments.push(newComment);
        
        // Update the task's comment count
        const task = this.tasks.find(t => t._id === this.selectedTask!._id);
        if (task) {
          task.commentIds.push(newComment._id);
        }
        
        this.toastService.showSuccess('Comment added successfully');
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.toastService.showError('Failed to add comment. Please try again.');
      }
    });
  }

  updateTaskQuantity(event: {taskId: string, producedQuantity: number}) {
    if (!event.taskId || event.producedQuantity < 0) return;

    const task = this.tasks.find(t => t._id === event.taskId);
    if (!task) return;

    // Find the piece that contains this task
    const piece = this.pieces.find(p => p._id === task.pieceId);
    if (!piece) return;

    // Calculate new progress based on produced quantity
    const newProgress = Math.min(100, Math.round((event.producedQuantity / piece.quantity) * 100));
    
    // Determine new status based on progress
    let newStatus: Task['status'] = task.status;
    if (newProgress === 100) {
      newStatus = 'Completed';
    } else if (newProgress > 0 && task.status === 'To Do') {
      newStatus = 'In Progress';
    }

    // Update task progress and status via API
    const updateData: Partial<Task> = {
      progress: newProgress,
      status: newStatus
    };

    // Remove _id from update payload
    const { _id, ...updatePayload } = updateData as any;

    this.tasksService.updateTask(task._id, updatePayload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedTask) => {
        // Update local task data
        const taskIndex = this.tasks.findIndex(t => t._id === task._id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
        }

        // Update piece progress if needed
        if (piece.progress !== newProgress) {
          this.updatePieceProgress(piece._id, newProgress);
        }

        // Re-filter tasks to update the UI
        this.filterTasksByStatus();
        
        this.toastService.showSuccess('Task updated successfully');
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.toastService.showError('Failed to update task. Please try again.');
      }
    });
  }

  private updatePieceProgress(pieceId: string, progress: number) {
    // Determine piece status based on progress
    let pieceStatus: Piece['status'] = 'To Do';
    if (progress === 100) {
      pieceStatus = 'Completed';
    } else if (progress > 0) {
      pieceStatus = 'In Progress';
    }

    this.piecesService.updatePieceProgress(pieceId, progress).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedPiece) => {
        // Update local piece data
        const pieceIndex = this.pieces.findIndex(p => p._id === pieceId);
        if (pieceIndex !== -1) {
          this.pieces[pieceIndex] = { ...this.pieces[pieceIndex], ...updatedPiece };
        }

        // Update piece status if needed
        if (updatedPiece.status !== pieceStatus) {
          this.piecesService.updatePieceStatus(pieceId, pieceStatus).subscribe();
        }
      },
      error: (error) => {
        console.error('Error updating piece progress:', error);
      }
    });
  }

  // Helper methods to get piece information
  getPieceName(pieceId: string): string {
    const piece = this.pieces.find(p => p._id === pieceId);
    return piece ? piece.name : '';
  }

  getPieceReference(pieceId: string): string {
    const piece = this.pieces.find(p => p._id === pieceId);
    return piece ? piece.reference : '';
  }

  // Helper method to check if data is loading
  get isLoading(): boolean {
    return this.isLoadingProjects || this.isLoadingResources || this.isLoadingTasks || this.isLoadingPieces;
  }

  // Drag and drop methods
  onDragStart(event: DragEvent, task: Task) {
    this.draggedTask = task;
    this.draggedFromStatus = task.status;
    this.isDragging = true;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', task._id);
    }

    // Add visual feedback
    const element = event.target as HTMLElement;
    element.style.opacity = '0.5';
  }

  onDragEnd(event: DragEvent) {
    // Reset visual feedback
    const element = event.target as HTMLElement;
    element.style.opacity = '1';
    
    // Reset drag state
    this.draggedTask = null;
    this.draggedFromStatus = null;
    
    // Allow clicks after a brief delay
    setTimeout(() => {
      this.isDragging = false;
    }, 100);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    // Only add drag-over class to column-wrapper elements
    const element = event.currentTarget as HTMLElement;
    if (element.classList.contains('column-wrapper')) {
      element.classList.add('drag-over');
    }
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    // Only remove drag-over if we're actually leaving the element bounds
    // This prevents flickering when moving between child elements
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      element.classList.remove('drag-over');
    }
  }

  onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();
    event.stopPropagation();
    
    // Remove visual feedback from all columns
    const columns = document.querySelectorAll('.column-wrapper');
    columns.forEach(col => col.classList.remove('drag-over'));

    if (!this.draggedTask || this.draggedTask.status === newStatus) {
      return;
    }

    // Update task status
    this.updateTaskStatus(this.draggedTask, newStatus);
  }

  updateTaskStatus(task: Task, newStatus: string) {
    const oldStatus = task.status;
    
    // Optimistically update the UI
    task.status = newStatus as 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
    this.filterTasksByStatus();

    // Call the backend API to update the task
    this.tasksService.updateTask(task._id, { status: newStatus as 'To Do' | 'In Progress' | 'Completed' | 'On Hold' }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedTask) => {
        // Update the task with the response from the server
        const taskIndex = this.tasks.findIndex(t => t._id === task._id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = updatedTask;
          this.filterTasksByStatus();
        }
        
        this.toastService.showSuccess(`Task "${task.name}" moved to ${newStatus}`);
      },
      error: (error) => {
        // Revert the optimistic update on error
        task.status = oldStatus as any;
        this.filterTasksByStatus();
        
        this.toastService.showError(`Failed to update task status: ${error.message || 'Unknown error'}`);
      }
    });
  }
}
