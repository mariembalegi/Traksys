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
  isLoading = false;
  errorMessage = '';
  resources: Resource[] = [];

  lineOpenSet: Set<string> = new Set();
  dialog1=inject(Dialog);
  dialog2=inject(Dialog);
  
  private projectsService = inject(ProjectsService);
  private piecesService = inject(PiecesService);
  private tasksService = inject(TasksService);
  private resourcesService = inject(ResourcesService);
  private toastService = inject(ToastService);

  constructor(private location: Location, private route: ActivatedRoute) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProjectDetails();
    this.loadResources();
  }

  loadProjectDetails() {
    this.isLoading = true;
    this.errorMessage = '';

    this.projectsService.getProject(this.projectId).subscribe({
      next: (projectDetails) => {
        this.isLoading = false;
        this.selectedProject = projectDetails;
      },
      error: (error) => {
        this.isLoading = false;
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

  goBack() {
    this.location.back();
  }

  toggleDropdown(id: string) {
    if (this.lineOpenSet.has(id)) {
      this.lineOpenSet.delete(id);
    } else {
      this.lineOpenSet.add(id);
    }
  }

  expandAll() {
    if (this.selectedProject?.pieces) {
      this.lineOpenSet = new Set(this.selectedProject.pieces.map(p => p.id));
    }
  }

  collapseAll() {
    this.lineOpenSet.clear();
  }

  isOpen(id: string): boolean {
    return this.lineOpenSet.has(id);
  }

  getResourceName(resourceId: string): string {
    const resource = this.resources.find(r => r.id === resourceId);
    return resource ? resource.name : resourceId;
  }

  getTasksForPiece(pieceId: string): any[] {
    if (!this.selectedProject?.tasks) return [];
    return this.selectedProject.tasks.filter(task => task.pieceId === pieceId);
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
      if (result === 'saved') {
        this.loadProjectDetails(); // Refresh the project details
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
        this.loadProjectDetails();
        this.toastService.showSuccess('Piece updated successfully');
      }
    });
  }

  editTask(task: any) {
    const dialogRef = this.dialog2.open(AddEditTaskModal, {
      data: { 
        task: task,
        projectId: this.projectId,
        isEdit: true 
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result === 'saved') {
        this.loadProjectDetails();
        this.toastService.showSuccess('Task updated successfully');
      }
    });
  }

  deletePiece(piece: any) {
    if (confirm(`Are you sure you want to delete the piece "${piece.name}"?`)) {
      this.piecesService.deletePiece(piece.id).subscribe({
        next: () => {
          this.loadProjectDetails();
          this.toastService.showSuccess('Piece deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting piece:', error);
          // Error toast will be shown by the global error interceptor
        }
      });
    }
  }

  deleteTask(task: any) {
    if (confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
      this.tasksService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadProjectDetails();
          this.toastService.showSuccess('Task deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          // Error toast will be shown by the global error interceptor
        }
      });
    }
  }
}
