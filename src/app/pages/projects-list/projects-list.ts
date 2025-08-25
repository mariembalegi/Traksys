import { Component ,inject} from '@angular/core';
import {Customer} from '../../models/customer';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DatePipe, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Project} from '../../models/project';
import {Paginator} from '../../components/paginator/paginator';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditProjectModal} from '../../components/add-edit-project-modal/add-edit-project-modal';
import {RouterLink} from '@angular/router';
import {Material} from '../../models/material';


@Component({
  selector: 'app-projects-list',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgSelectComponent,
    Paginator,
    RouterLink
  ],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsList {
  private dialog=inject(Dialog);
  projects: Project[] = [];
  materials: Material[] = [];
  filteredProjects: Project[] = [];
  customers: Customer[] = [];
  filterStatus: 'all' | 'open' | 'closed' = 'all';
  searchText: string = '';
  selectedCustomer: string | null = null;

  pagedProjects: Project[] = [];
  itemsPerPage = 8;

  onPageChange(currentPageItems: Project[]) {
    this.pagedProjects = currentPageItems;
  }

  ngOnInit() {
    this.loadOnData()
  }
  loadOnData() {

    this.customers = [
      { id: "c1", name: "ACME Industries", projectIds: ["p1"] },
      { id: "c2", name: "TechnoFab", projectIds: ["p2"] }
    ];

    this.projects = [
      {
        id: "p1",
        name: "CNC Machine Housing",
        description: "Project for producing CNC machine housing parts.",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "/designs/cnc_project.dxf",
        customerId: "c1",
        pieceIds: ["pc1", "pc2"],
        progress: 65,
        opened: new Date("2025-08-01"),
        delivery: new Date("2025-09-15"),
        invoiceAmount: 15000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p2",
        name: "Robotic Arm",
        description: "Fabrication of components for robotic arm prototype.",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "/designs/robotic_arm.dxf",
        customerId: "c2",
        pieceIds: ["pc3"],
        progress: 20,
        opened: new Date("2025-08-10"),
        delivery: new Date("2025-10-01"),
        invoiceAmount: 8000,
        currency: "EUR",
        isOpen: true
      }
    ];

    this.materials = [
      {
        id: "m1",
        material: "Aluminium",
        type: "6061",
        quantity: 120,
        shape: "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date("2025-08-20"),
        diameter: 50,
        length: 2000,
        pieceIds: ["pc1"]
      },
      {
        id: "m2",
        material: "Steel",
        type: "C55",
        quantity: 80,
        shape: "Plate",
        unit: "mm",
        last_updated: new Date("2025-08-18"),
        x: 1000,
        y: 500,
        thickness: 20,
        pieceIds: ["pc2", "pc3"]
      }
    ];


    this.applyFilters();
  }

  protected addEditModal() {
    this.dialog.open(AddEditProjectModal,{disableClose: true});
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'open' && project.isOpen) ||
        (this.filterStatus === 'closed' && !project.isOpen);
      const matchesSearch = !this.searchText || project.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCustomer = !this.selectedCustomer || project.customerId === this.selectedCustomer;
      return matchesStatus && matchesSearch && matchesCustomer;
    });
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
    this.filterStatus = this.filterStatus === 'all' ? 'open'
      : this.filterStatus === 'open' ? 'closed'
        : 'all';
    this.applyFilters();
  }

  deleteProject(index: number) {
    // Get the actual project from pagedProjects (what's currently displayed)
    const projectToDelete = this.pagedProjects[index];

    // Remove from main projects array
    const mainIndex = this.projects.findIndex(p => p.id === projectToDelete.id);
    if (mainIndex > -1) {
      this.projects.splice(mainIndex, 1);
    }

    // Reapply filters and pagination
    this.applyFilters();
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? customer.name : customerId;
  }
}
