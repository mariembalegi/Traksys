import {Component, inject, OnInit} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Customer} from '../../models/customer';
import {Dialog, DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import {AddCustomerModal} from '../add-customer-modal/add-customer-modal';
import { CustomersService, Customer as ApiCustomer } from '../../core/services/customers.service';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-add-edit-project-modal',
  imports: [
    NgSelectComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-edit-project-modal.html',
  styleUrl: './add-edit-project-modal.scss'
})
export class AddEditProjectModal implements OnInit {
  private dialogRef = inject(DialogRef, { optional: true });
  private dialog = inject(Dialog);
  private customersService = inject(CustomersService);
  private projectsService = inject(ProjectsService);
  private dialogData = inject(DIALOG_DATA, { optional: true });

  customers: ApiCustomer[] = [];
  currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'TND', name: 'Tunisian Dinar' }
  ];

  // Determine if we're in edit mode
  isEditMode = false;
  projectToEdit: Project | null = null;

  // Form data
  projectData: Partial<Project> = {
    name: '',
    description: '',
    customerId: '',
    delivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    invoiceAmount: 0,
    currency: 'TND',
    isOpen: true
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';
  selectedDesignFile: File | null = null;
  selectedDesignPicture: File | null = null;

  // Helper property for date input binding
  get deliveryDateString(): string {
    if (!this.projectData.delivery) return '';
    
    try {
      // Ensure it's a Date object
      const date = this.projectData.delivery instanceof Date 
        ? this.projectData.delivery 
        : new Date(this.projectData.delivery);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return '';
      
      return this.formatDateForInput(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  set deliveryDateString(value: string) {
    if (value && value.trim()) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        this.projectData.delivery = newDate;
      } else {
        this.projectData.delivery = undefined;
      }
    } else {
      this.projectData.delivery = undefined;
    }
  }

  ngOnInit() {
    // Check if we're in edit mode and have project data
    if (this.dialogData?.project && this.dialogData?.isEdit) {
      this.isEditMode = true;
      this.projectToEdit = this.dialogData.project;
      if (this.projectToEdit) {
        this.initializeFormWithProjectData(this.projectToEdit);
      }
    }
    
    this.loadCustomers();
  }

  private initializeFormWithProjectData(project: Project) {
    // Extract customer ID - handle both string ID and customer object cases
    let customerId = '';
    if (typeof project.customerId === 'string') {
      customerId = project.customerId;
    } else if (project.customerId && typeof project.customerId === 'object' && '_id' in project.customerId) {
      // If customerId is actually a customer object, extract the _id
      customerId = (project.customerId as any)._id;
    }

    this.projectData = {
      name: project.name,
      description: project.description,
      customerId: customerId,
      delivery: project.delivery,
      invoiceAmount: project.invoiceAmount,
      currency: project.currency,
      isOpen: project.isOpen
    };
    console.log('Initialized form with project data:', this.projectData);
    console.log('Extracted customer ID:', customerId);
  }

  loadCustomers() {
    this.isLoading = true;
    this.customersService.getCustomers().subscribe({
      next: (response) => {
        this.customers = response.customers;
        console.log('Loaded customers:', this.customers);
        console.log('Current projectData.customerId:', this.projectData.customerId);
        
        // If we're in edit mode and have a customerId, ensure it's properly selected
        if (this.isEditMode && this.projectData.customerId) {
          // Force ng-select to recognize the selection by triggering change detection
          const selectedCustomerId = this.projectData.customerId;
          setTimeout(() => {
            this.projectData.customerId = selectedCustomerId;
            console.log('Re-set customer ID after loading customers:', selectedCustomerId);
          }, 0);
        }
        
        this.isLoading = false;
        this.clearError(); // Clear any previous errors
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.showError('Failed to load customers. You can still create a project with the form.');
        this.isLoading = false;
      }
    });
  }

  onDesignFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedDesignFile = file;
    }
  }

  onDesignPictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedDesignPicture = file;
    }
  }

  onCustomerChange(customerId: string) {
    this.projectData.customerId = customerId;
  }

  onSubmit() {
    if (!this.isFormValid) {
      this.showError('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    this.clearError();

    if (this.isEditMode && this.projectToEdit) {
      // Update existing project - only send fields that can be updated
      const projectToUpdate = {
        name: this.projectData.name,
        description: this.projectData.description,
        delivery: this.projectData.delivery,
        invoiceAmount: this.projectData.invoiceAmount,
        currency: this.projectData.currency,
        isOpen: this.projectData.isOpen
      };

      this.projectsService.updateProject((this.projectToEdit as any)._id, projectToUpdate as Project).subscribe({
        next: (updatedProject) => {
          this.isSaving = false;
          console.log('Project updated successfully:', updatedProject);
          this.dialogRef?.close(updatedProject);
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.showError(error.error?.message || 'Failed to update project. Please try again.');
          this.isSaving = false;
        }
      });
    } else {
      // Create new project
      const projectToCreate = {
        ...this.projectData,
        opened: new Date()
      };

      this.projectsService.createProject(projectToCreate as Omit<Project, 'id' | 'pieceIds' | 'createdAt' | 'updatedAt'>).subscribe({
        next: (createdProject) => {
          this.isSaving = false;
          console.log('Project created successfully:', createdProject);
          this.dialogRef?.close(createdProject);
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.showError(error.error?.message || 'Failed to create project. Please try again.');
          this.isSaving = false;
        }
      });
    }
  }

  // Check if all required fields are filled
  get isFormValid(): boolean {
    const nameValid = !!(this.projectData.name?.trim());
    const customerValid = !!(this.projectData.customerId);
    const deliveryValid = !!(this.projectData.delivery);

    return nameValid && customerValid && deliveryValid;
  }

  // Expose isEditMode to template
  get modalTitle(): string {
    return this.isEditMode ? 'Edit Project' : 'Project Registration';
  }

  protected addCustomerModal() {
    const dialogRef = this.dialog.open(AddCustomerModal, { disableClose: true });

    // Refresh customers list when a new customer is added
    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.loadCustomers();
      }
    });
  }

  protected closeModal() {
    this.dialogRef?.close();
  }

  protected clearError() {
    this.errorMessage = '';
  }

  private showError(message: string) {
    this.errorMessage = message;
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  // Utility method to format date for input binding
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
