import {Component, inject, OnInit} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../core/services/tasks.service';
import { ResourcesService } from '../../core/services/resources.service';
import { PiecesService } from '../../core/services/pieces.service';
import { AuthService } from '../../core/services/auth.service';
import {Resource} from '../../models/resource';

@Component({
  selector: 'app-add-edit-task-modal',
  imports: [
    NgSelectComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-edit-task-modal.html',
  styleUrl: './add-edit-task-modal.scss'
})
export class AddEditTaskModal implements OnInit {
  private dialogRef = inject(DialogRef, {optional: true});
  private formBuilder = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private resourcesService = inject(ResourcesService);
  private piecesService = inject(PiecesService);
  private authService = inject(AuthService);
  public data = inject(DIALOG_DATA, {optional: true});

  taskForm!: FormGroup;
  resources: Resource[] = [];
  pieces: any[] = [];
  isLoading = false;
  isEdit = false;

  ngOnInit() {
    this.isEdit = this.data?.isEdit || false;
    this.initForm();
    this.loadResources();
    this.loadPieces();

    if (this.isEdit && this.data?.task) {
      this.populateForm(this.data.task);
    }
  }

  initForm() {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      estimatedTime: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['To Do'],
      progress: [0],
      spentTime: [0],
      resourceIds: [[]],
      pieceId: [this.data?.pieceId || ''],
      dueDate: ['', [Validators.required]]
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

  loadPieces() {
    if (this.data?.projectId) {
      this.piecesService.getPieces({ projectId: this.data.projectId }).subscribe({
        next: (response) => {
          this.pieces = response.pieces;
        },
        error: (error) => {
          console.error('Error loading pieces:', error);
        }
      });
    }
  }

  populateForm(task: any) {
    this.taskForm.patchValue({
      name: task.name,
      description: task.description,
      estimatedTime: task.estimatedTime,
      quantity: task.quantity,
      status: task.status,
      progress: task.progress,
      spentTime: task.spentTime,
      resourceIds: task.resourceIds || [],
      pieceId: task.pieceId,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      try {
        const currentUser = this.authService.getCurrentUser();
        const taskData = {
          ...this.taskForm.value,
          dueDate: new Date(this.taskForm.value.dueDate),
          createdBy: currentUser?.id || 'unknown-user'
        };

        if (this.isEdit) {
          await this.tasksService.updateTask(this.data.task.id, taskData).toPromise();
        } else {
          await this.tasksService.createTask(taskData).toPromise();
        }

        this.closeModal('saved');
      } catch (error) {
        console.error('Error saving task:', error);
        // Error toast will be shown by the global error interceptor
      } finally {
        this.isLoading = false;
      }
    }
  }

  protected closeModal(result?: string) {
    this.dialogRef?.close(result);
  }
}
