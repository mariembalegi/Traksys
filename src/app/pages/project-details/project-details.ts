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

  lineOpenSet: Set<string> = new Set();
  dialog1=inject(Dialog);
  dialog2=inject(Dialog);
  
  private projectsService = inject(ProjectsService);

  constructor(private location: Location, private route: ActivatedRoute) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProjectDetails();
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
    // This would need to be implemented with a resources service
    // For now, return the ID
    return resourceId;
  }

  protected AddEditPieceModal() {
    this.dialog1.open(AddEditPieceModal);
  }

  protected AddEditTaskModal() {
    this.dialog2.open(AddEditTaskModal);
  }

  deletePiece(index: number) {
    // This would need to be implemented with pieces service
    console.log('Delete piece at index:', index);
  }

  deleteTask(index: number) {
    // This would need to be implemented with tasks service
    console.log('Delete task at index:', index);
  }
}
