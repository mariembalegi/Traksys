import {Component, inject, OnInit} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../core/services/tasks.service';
import { ResourcesService } from '../../core/services/resources.service';
import { AuthService } from '../../core/services/auth.service';
import { Resource } from '../../models/resource';
import { Piece } from '../../models/piece';

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
  private authService = inject(AuthService);
  public data = inject(DIALOG_DATA, {optional: true});

  taskForm!: FormGroup;
  resources: Resource[] = [];
  selectedPiece?: Piece;
  isLoading = false;
  isEdit = false;

  ngOnInit() {
    this.isEdit = this.data?.isEdit || false;
    this.selectedPiece = this.data?.piece;
    
    console.log('Modal data:', this.data); // Debug log
    console.log('Selected piece:', this.selectedPiece); // Debug log
    
    this.initForm();
    this.loadResources();

    if (this.isEdit && this.data?.task) {
      this.populateForm(this.data.task);
    }
  }

  initForm() {
    // Use pieceId from data first, then fallback to selectedPiece id
    const pieceId = this.data?.pieceId || this.selectedPiece?.id || '';
    
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      estimatedTime: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['To Do'],
      progress: [0],
      spentTime: [0],
      resourceIds: [[]],
      pieceId: [pieceId],
      dueDate: ['', [Validators.required]],
      actualFinishDate: ['']
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
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      actualFinishDate: task.actualFinishDate ? new Date(task.actualFinishDate).toISOString().split('T')[0] : ''
    });
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      try {
        const currentUser = this.authService.getCurrentUser();
        const formValue = this.taskForm.value;
        
        if (this.isEdit) {
          // For editing, include all fields except pieceId
          const taskData = {
            name: formValue.name,
            description: formValue.description,
            estimatedTime: formValue.estimatedTime,
            spentTime: formValue.spentTime || 0,
            quantity: formValue.quantity,
            progress: formValue.progress || 0,
            status: formValue.status,
            resourceIds: formValue.resourceIds || [],
            dueDate: new Date(formValue.dueDate),
            actualFinishDate: formValue.actualFinishDate ? new Date(formValue.actualFinishDate) : undefined
          };
          
          const taskId = this.data?.task?.id || this.data?.task?._id;
          if (!taskId) {
            console.error('Task data:', this.data?.task);
            throw new Error('Task ID is required for updates');
          }
          
          await this.tasksService.updateTask(taskId, taskData).toPromise();
        } else {
          // For creating, only send the essential fields
          const taskData: any = {
            name: formValue.name,
            description: formValue.description,
            estimatedTime: formValue.estimatedTime,
            quantity: formValue.quantity,
            resourceIds: formValue.resourceIds || [],
            pieceId: formValue.pieceId || this.selectedPiece?.id || this.data?.pieceId,
            dueDate: new Date(formValue.dueDate)
          };
          
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
