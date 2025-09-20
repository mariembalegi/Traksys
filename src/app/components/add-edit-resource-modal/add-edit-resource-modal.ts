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
  resourceData: Partial<Resource> & { underMaintenance?: boolean } = {
    name: '',
    type: 'Person',
    isAvailable: true,
    skills: [],
    maintenanceSchedule: undefined,
    underMaintenance: false
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
      
      // For machines, set underMaintenance based on availability status
      if (this.resourceData.type === 'Machine') {
        this.resourceData.underMaintenance = !this.resourceData.isAvailable;
      }
      
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

    if (this.isEdit && this.data?.resource?._id) {
      // Prepare data for update (exclude _id, createdAt, updatedAt, taskIds)
      const updateData: any = {
        name: this.resourceData.name!.trim(),
        type: this.resourceData.type as 'Person' | 'Machine',
        skills: this.resourceData.skills || []
      };

      // Handle maintenance status for machines
      if (this.resourceData.type === 'Machine' && this.resourceData.underMaintenance) {
        updateData.isAvailable = false;
        updateData.maintenanceSchedule = new Date();
      } else if (this.resourceData.type === 'Machine' && !this.resourceData.underMaintenance) {
        updateData.isAvailable = true;
        updateData.maintenanceSchedule = null;
      } else {
        // For persons, use the availability checkbox value
        updateData.isAvailable = this.resourceData.isAvailable ?? true;
      }

      // Update existing resource
      this.resourcesService.updateResource(this.data.resource._id, updateData).subscribe({
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
      // Prepare data for creation (exclude _id, createdAt, updatedAt, taskIds)
      const createData: any = {
        name: this.resourceData.name!.trim(),
        type: this.resourceData.type as 'Person' | 'Machine',
        skills: this.resourceData.skills || []
      };

      // Handle maintenance status for machines
      if (this.resourceData.type === 'Machine' && this.resourceData.underMaintenance) {
        createData.isAvailable = false;
        createData.maintenanceSchedule = new Date();
      } else if (this.resourceData.type === 'Machine' && !this.resourceData.underMaintenance) {
        createData.isAvailable = true;
      } else {
        // For persons, use the availability checkbox value
        createData.isAvailable = this.resourceData.isAvailable ?? true;
      }

      // Create new resource
      this.resourcesService.createResource(createData as Omit<Resource, '_id' | 'taskIds' | 'createdAt' | 'updatedAt'>).subscribe({
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
