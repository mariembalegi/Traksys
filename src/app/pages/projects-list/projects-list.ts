import { Component, OnInit, inject} from '@angular/core';
import {Customer} from '../../models/customer';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DatePipe, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Project} from '../../models/project';
import {Paginator} from '../../components/paginator/paginator';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditProjectModal} from '../../components/add-edit-project-modal/add-edit-project-modal';
import {RouterLink} from '@angular/router';
import { ProjectsService, Project as ApiProject } from '../../core/services/projects.service';
import { CustomersService, Customer as ApiCustomer } from '../../core/services/customers.service';


@Component({
  selector: 'app-projects-list',
  imports: [
    DatePipe,
    FormsModule,
    NgClass,
    NgSelectComponent,
    Paginator,
    RouterLink
  ],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsList implements OnInit {
  private dialog=inject(Dialog);
  private projectsService = inject(ProjectsService);
  private customersService = inject(CustomersService);

  projects: ApiProject[] = [];
  filteredProjects: ApiProject[] = [];
  customers: ApiCustomer[] = [];
  filterStatus: 'all' | 'open' | 'closed' = 'all';
  searchText: string = '';
  selectedCustomer: string | null = null;
  isFilterDropdownOpen = false;
  isLoading = false;
  errorMessage = '';
  searchTimeout: any;

  pagedProjects: ApiProject[] = [];
  itemsPerPage = 50;

  onPageChange(currentPageItems: ApiProject[]) {
    this.pagedProjects = currentPageItems;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Load customers first
    this.customersService.getCustomers().subscribe({
      next: (customersResponse) => {
        this.customers = customersResponse.customers;
        // Then load projects
        this.loadProjects();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load customers';
        console.error('Error loading customers:', error);
      }
    });
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (projectsResponse) => {
        this.isLoading = false;
        this.projects = projectsResponse.projects;
        this.applyFilters(); // Apply any existing filters after loading
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load projects';
        console.error('Error loading projects:', error);
      }
    });
  }

  protected addEditModal() {
    const dialogRef = this.dialog.open(AddEditProjectModal, { disableClose: true });

    // Handle the result when modal closes
    dialogRef.closed.subscribe((result) => {
      if (result) {
        // Project was created successfully, refresh the list
        this.loadProjects();
        console.log('Project created:', result);
      }
    });
  }

  protected editProject(project: ApiProject, event: Event) {
    event.stopPropagation(); // Prevent row click
    
    const dialogRef = this.dialog.open(AddEditProjectModal, { 
      disableClose: true,
      data: { project, isEdit: true }
    });

    // Handle the result when modal closes
    dialogRef.closed.subscribe((result) => {
      if (result) {
        // Project was updated successfully, refresh the list
        this.loadProjects();
        console.log('Project updated:', result);
      }
    });
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      // Status filter
      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'open' && project.isOpen) ||
        (this.filterStatus === 'closed' && !project.isOpen);
      
      // Search filter - search in name and description
      const matchesSearch = !this.searchText || 
        project.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(this.searchText.toLowerCase()));
      
      // Customer filter - handle both string ID and customer object
      let matchesCustomer = true;
      if (this.selectedCustomer) {
        if (typeof project.customerId === 'string') {
          matchesCustomer = project.customerId === this.selectedCustomer;
        } else if (project.customerId && typeof project.customerId === 'object' && '_id' in project.customerId) {
          matchesCustomer = (project.customerId as any)._id === this.selectedCustomer;
        }
      }
      
      return matchesStatus && matchesSearch && matchesCustomer;
    });
    
    // Reset to first page when filters change
    this.resetPagination();
  }

  private resetPagination() {
    // Initialize pagedProjects with first page if filteredProjects is not empty
    if (this.filteredProjects.length > 0) {
      this.pagedProjects = this.filteredProjects.slice(0, this.itemsPerPage);
    } else {
      this.pagedProjects = [];
    }
  }


  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  toggleFilterStatus() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  setFilterStatus(status: 'all' | 'open' | 'closed') {
    this.filterStatus = status;
    this.isFilterDropdownOpen = false;
    this.applyFilters();
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCustomer = null;
    this.filterStatus = 'all';
    this.applyFilters();
  }

  onSearchChange() {
    // Debounce search to avoid too many filter calls
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  hasActiveFilters(): boolean {
    return !!(this.searchText || this.selectedCustomer || this.filterStatus !== 'all');
  }

  clearSearch() {
    this.searchText = '';
    this.applyFilters();
  }

  clearCustomerFilter() {
    this.selectedCustomer = null;
    this.applyFilters();
  }

  clearStatusFilter() {
    this.filterStatus = 'all';
    this.applyFilters();
  }

  getSelectedCustomerName(): string {
    if (!this.selectedCustomer) return '';
    const customer = this.customers.find(c => c._id === this.selectedCustomer);
    return customer ? customer.name : this.selectedCustomer;
  }

  getFilterStatusLabel(): string {
    switch (this.filterStatus) {
      case 'all': return 'All';
      case 'open': return 'Open';
      case 'closed': return 'Closed';
      default: return 'All';
    }
  }

  deleteProject(index: number) {
    // Get the actual project from pagedProjects (what's currently displayed)
    const projectToDelete = this.pagedProjects[index];

    if (confirm(`Are you sure you want to delete project "${projectToDelete.name}"?`)) {
      this.projectsService.deleteProject((projectToDelete as any)._id).subscribe({
        next: () => {
          // Remove from local arrays
          const mainIndex = this.projects.findIndex(p => (p as any)._id === (projectToDelete as any)._id);
          if (mainIndex > -1) {
            this.projects.splice(mainIndex, 1);
          }
          this.applyFilters();
          console.log('Project deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          alert('Failed to delete project');
        }
      });
    }
  }

  getCustomerName(customerId: string | any): string {
    // Handle both string ID and customer object
    let actualCustomerId: string;
    
    if (typeof customerId === 'string') {
      actualCustomerId = customerId;
    } else if (customerId && typeof customerId === 'object' && '_id' in customerId) {
      // If customerId is actually a customer object, extract the _id
      actualCustomerId = customerId._id;
    } else {
      return 'Unknown Customer';
    }
    
    const customer = this.customers.find(c => c._id === actualCustomerId);
    return customer ? customer.name : actualCustomerId;
  }

  getProjectId(project: ApiProject): string {
    return (project as any)._id;
  }

  getStatusBadgeClass(isOpen: boolean): string {
    return isOpen ? 'status-open' : 'status-closed';
  }

  getStatusText(isOpen: boolean): string {
    return isOpen ? 'Open' : 'Closed';
  }

  truncateText(text: string, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
