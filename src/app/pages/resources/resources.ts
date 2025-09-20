import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MaintenanceResourceCard } from '../../components/maintenance-resource-card/maintenance-resource-card';
import { ActiveResourceCard } from '../../components/active-resource-card/active-resource-card';
import { AvailableResourceCard } from '../../components/available-resource-card/available-resource-card';
import { AvailableOperatorCard } from '../../components/available-operator-card/available-operator-card';
import { ActiveOperatorCard } from '../../components/active-operator-card/active-operator-card';
import { ResourcesService, Resource, ResourceStats } from '../../core/services/resources.service';

@Component({
  selector: 'app-resources',
  imports: [
    CommonModule,
    MaintenanceResourceCard,
    ActiveResourceCard,
    AvailableResourceCard,
    AvailableOperatorCard,
    ActiveOperatorCard
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

  constructor(private resourcesService: ResourcesService) {}

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
          params.status = 'maintenance';
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
      resource.maintenanceSchedule && new Date(resource.maintenanceSchedule) <= new Date()
    );
  }

  isInMaintenance(resource: Resource): boolean {
    return !!(resource.maintenanceSchedule && new Date(resource.maintenanceSchedule) <= new Date());
  }

  isActiveResource(resource: Resource): boolean {
    return resource.isAvailable && resource.taskIds && resource.taskIds.length > 0;
  }

  isAvailableResource(resource: Resource): boolean {
    return resource.isAvailable && (!resource.taskIds || resource.taskIds.length === 0);
  }
}
