import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { MaintenanceResourceCard } from '../../components/maintenance-resource-card/maintenance-resource-card';
import { ActiveResourceCard } from '../../components/active-resource-card/active-resource-card';
import { AvailableResourceCard } from '../../components/available-resource-card/available-resource-card';
import { AvailableOperatorCard } from '../../components/available-operator-card/available-operator-card';
import { ActiveOperatorCard } from '../../components/active-operator-card/active-operator-card';
import { UnavailableOperatorCard } from '../../components/unavailable-operator-card/unavailable-operator-card';
import { AddEditResourceModal } from '../../components/add-edit-resource-modal/add-edit-resource-modal';
import { ConfirmationModal } from '../../components/confirmation-modal/confirmation-modal';
import { ResourcesService, Resource, ResourceStats } from '../../core/services/resources.service';
import { ToastService } from '../../services/toast.service';

export interface ResourceModalResult {
  action: 'created' | 'updated';
  resource: Resource;
}

@Component({
  selector: 'app-resources',
  imports: [
    CommonModule,
    MaintenanceResourceCard,
    ActiveResourceCard,
    AvailableResourceCard,
    AvailableOperatorCard,
    ActiveOperatorCard,
    UnavailableOperatorCard
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class Resources implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Statistics
  stats: ResourceStats = {
    totalResources: 0,
    machines: 0,
    operators: 0,
    active: 0,
    idle: 0,
    maintenance: 0
  };
  
  // Resources data
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  totalResources = 0;
  currentFilter = 'All Resources';
  
  // Loading states
  isLoadingStats = false;
  isLoadingResources = false;

  constructor(
    private resourcesService: ResourcesService,
    private dialog: Dialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadResourceStats();
    this.loadResources();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadResourceStats(): void {
    this.isLoadingStats = true;
    this.resourcesService.getResourceStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.isLoadingStats = false;
        },
        error: (error) => {
          console.error('Error loading resource stats:', error);
          // Provide fallback stats
          this.stats = {
            totalResources: 0,
            machines: 0,
            operators: 0,
            active: 0,
            idle: 0,
            maintenance: 0
          };
          this.isLoadingStats = false;
        }
      });
  }

  loadResources(filter?: string): void {
    this.isLoadingResources = true;
    const params: any = {};
    
    if (filter) {
      switch (filter) {
        case 'Active':
          params.status = 'active';
          params.available = true;
          break;
        case 'Idle/Available':
          params.available = true;
          break;
        case 'Machines Only':
          params.type = 'Machine';
          break;
        case 'Operators Only':
          params.type = 'Person';
          break;
        case 'Maintenance':
          params.available = false;
          break;
      }
    }

    this.resourcesService.getResources(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.resources = response.resources;
          this.filteredResources = response.resources;
          this.totalResources = response.total;
          this.isLoadingResources = false;
        },
        error: (error) => {
          console.error('Error loading resources:', error);
          // Provide fallback empty state
          this.resources = [];
          this.filteredResources = [];
          this.totalResources = 0;
          this.isLoadingResources = false;
        }
      });
  }

  onFilterChange(filter: string): void {
    this.currentFilter = filter;
    this.loadResources(filter);
  }

  getResourcesByType(type: 'Person' | 'Machine'): Resource[] {
    return this.filteredResources.filter(resource => resource.type === type);
  }

  getActiveResources(): Resource[] {
    return this.filteredResources.filter(resource => 
      resource.isAvailable && resource.taskIds && resource.taskIds.length > 0
    );
  }

  getAvailableResources(): Resource[] {
    return this.filteredResources.filter(resource => 
      resource.isAvailable && (!resource.taskIds || resource.taskIds.length === 0)
    );
  }

  getMaintenanceResources(): Resource[] {
    return this.filteredResources.filter(resource => 
      !resource.isAvailable && resource.type === 'Machine'
    );
  }

  isInMaintenance(resource: Resource): boolean {
    return !resource.isAvailable && resource.type === 'Machine';
  }

  isActiveResource(resource: Resource): boolean {
    return !!(resource.isAvailable && resource.taskIds && resource.taskIds.length > 0);
  }

  isAvailableResource(resource: Resource): boolean {
    return !!(resource.isAvailable && (!resource.taskIds || resource.taskIds.length === 0));
  }

  // CRUD Operations
  openAddResourceModal(): void {
    const dialogRef = this.dialog.open(AddEditResourceModal, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.closed.subscribe((result) => {
      if (result && (result as ResourceModalResult).action === 'created') {
        this.toastService.showSuccess('Resource created successfully');
        this.loadResources(this.currentFilter);
        this.loadResourceStats();
      }
    });
  }

  openEditResourceModal(resource: Resource): void {
    const dialogRef = this.dialog.open(AddEditResourceModal, {
      width: '500px',
      data: { resource, isEdit: true }
    });

    dialogRef.closed.subscribe((result) => {
      if (result && (result as ResourceModalResult).action === 'updated') {
        this.toastService.showSuccess('Resource updated successfully');
        this.loadResources(this.currentFilter);
        this.loadResourceStats();
      }
    });
  }

  confirmDeleteResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      data: {
        title: 'Delete Resource',
        message: `Are you sure you want to delete "${resource.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.deleteResource(resource);
      }
    });
  }

  private deleteResource(resource: Resource): void {
    this.resourcesService.deleteResource(resource._id).subscribe({
      next: () => {
        this.toastService.showSuccess('Resource deleted successfully');
        this.loadResources(this.currentFilter);
        this.loadResourceStats();
      },
      error: (error) => {
        console.error('Error deleting resource:', error);
        this.toastService.showError('Failed to delete resource');
      }
    });
  }

  toggleResourceAvailability(resource: Resource): void {
    const newAvailability = !resource.isAvailable;
    this.resourcesService.updateResourceAvailability(
      resource._id, 
      newAvailability, 
      resource.maintenanceSchedule
    ).subscribe({
      next: () => {
        const status = newAvailability ? 'available' : 'unavailable';
        this.toastService.showSuccess(`Resource marked as ${status}`);
        this.loadResources(this.currentFilter);
        this.loadResourceStats();
      },
      error: (error) => {
        console.error('Error updating resource availability:', error);
        this.toastService.showError('Failed to update resource availability');
      }
    });
  }
}
