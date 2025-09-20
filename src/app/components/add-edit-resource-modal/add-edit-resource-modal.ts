import { Component, inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ResourcesService, Resource } from '../../core/services/resources.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface ResourceModalData {
  resource?: Resource;
  isEdit?: boolean;
}

@Component({
  selector: 'app-add-edit-resource-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-resource-modal.html',
  styleUrl: './add-edit-resource-modal.scss'
})
export class AddEditResourceModal implements OnInit {
  private dialogRef = inject(DialogRef, { optional: true });
  private resourcesService = inject(ResourcesService);
  private data = inject(DIALOG_DATA, { optional: true }) as ResourceModalData;

  // Form data
  resourceData: Partial<Resource> = {
    name: '',
    type: 'Person',
    isAvailable: true,
    skills: [],
    maintenanceSchedule: undefined
  };

  isEdit = false;
  isSaving = false;
  errorMessage = '';
  
  // UI helpers
  skillInput = '';
  resourceTypes = ['Person', 'Machine'] as const;

  ngOnInit() {
    if (this.data?.resource && this.data?.isEdit) {
      this.isEdit = true;
      this.resourceData = { ...this.data.resource };
      // Convert skills array to display format if needed
      if (this.resourceData.skills && Array.isArray(this.resourceData.skills)) {
        // Skills are already in array format, keep as is
      }
    }
  }

  onSubmit() {
    if (!this.resourceData.name?.trim()) {
      this.errorMessage = 'Resource name is required';
      return;
    }

    if (!this.resourceData.type) {
      this.errorMessage = 'Resource type is required';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    // Prepare data for submission
    const submitData = {
      ...this.resourceData,
      name: this.resourceData.name!.trim(),
      type: this.resourceData.type as 'Person' | 'Machine',
      isAvailable: this.resourceData.isAvailable ?? true,
      skills: this.resourceData.skills || []
    };

    if (this.isEdit && this.data?.resource?._id) {
      // Update existing resource
      this.resourcesService.updateResource(this.data.resource._id, submitData).subscribe({
        next: (updatedResource) => {
          this.isSaving = false;
          console.log('Resource updated successfully:', updatedResource);
          this.dialogRef?.close({ action: 'updated', resource: updatedResource });
        },
        error: (error) => {
          console.error('Error updating resource:', error);
          this.errorMessage = error.error?.message || 'Failed to update resource';
          this.isSaving = false;
        }
      });
    } else {
      // Create new resource
      this.resourcesService.createResource(submitData as Omit<Resource, '_id' | 'taskIds' | 'createdAt' | 'updatedAt'>).subscribe({
        next: (createdResource) => {
          this.isSaving = false;
          console.log('Resource created successfully:', createdResource);
          this.dialogRef?.close({ action: 'created', resource: createdResource });
        },
        error: (error) => {
          console.error('Error creating resource:', error);
          this.errorMessage = error.error?.message || 'Failed to create resource';
          this.isSaving = false;
        }
      });
    }
  }

  addSkill() {
    if (this.skillInput.trim() && this.resourceData.skills) {
      if (!this.resourceData.skills.includes(this.skillInput.trim())) {
        this.resourceData.skills.push(this.skillInput.trim());
        this.skillInput = '';
      }
    } else if (this.skillInput.trim()) {
      this.resourceData.skills = [this.skillInput.trim()];
      this.skillInput = '';
    }
  }

  removeSkill(index: number) {
    if (this.resourceData.skills) {
      this.resourceData.skills.splice(index, 1);
    }
  }

  onSkillKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }

  protected closeModal() {
    this.dialogRef?.close();
  }

  get modalTitle(): string {
    return this.isEdit ? 'Edit Resource' : 'Add New Resource';
  }

  get submitButtonText(): string {
    if (this.isSaving) {
      return this.isEdit ? 'Updating...' : 'Creating...';
    }
    return this.isEdit ? 'Update Resource' : 'Create Resource';
  }

  get showSkillsSection(): boolean {
    return this.resourceData.type === 'Person';
  }

  get showMaintenanceSection(): boolean {
    return this.resourceData.type === 'Machine';
  }
}
