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
      { _id: "C01", name: "Natilait" },
      { _id: "C02", name: "Sagemcom" },
      { _id: "C03", name: "Orange" },
      { _id: "C04", name: "Total" }
    ];

    this.projects = [
      {
        id: 1,
        name: "Project Alpha",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Small desktop CNC prototype",
        customerId: "C01",
        progress: 50,
        opened: new Date("2025-08-01"),
        delivery: new Date("2025-08-20"),
        invoiceAmount: 1500,
        currency: "USD",
        isOpen: true
      },
      {
        id: 2,
        name: "Project Beta",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Decorative CNC engraving pattern",
        customerId: "C02",
        progress: 80,
        opened: new Date("2025-07-15"),
        delivery: new Date("2025-08-30"),
        invoiceAmount: 2500,
        currency: "EUR",
        isOpen: false
      },
      {
        id: 3,
        name: "Project Gamma",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Architectural CNC modeling",
        customerId: "C03",
        progress: 30,
        opened: new Date("2025-06-10"),
        delivery: new Date("2025-09-01"),
        invoiceAmount: 1800,
        currency: "USD",
        isOpen: true
      },
      {
        id: 4,
        name: "Project Delta",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Cabinet CNC design layout",
        customerId: "C01",
        progress: 100,
        opened: new Date("2025-05-05"),
        delivery: new Date("2025-07-20"),
        invoiceAmount: 3200,
        currency: "EUR",
        isOpen: false
      },
      {
        id: 5,
        name: "Project Epsilon",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Random placeholder design",
        customerId: "C04",
        progress: 60,
        opened: new Date("2025-07-01"),
        delivery: new Date("2025-08-25"),
        invoiceAmount: 2100,
        currency: "USD",
        isOpen: true
      },
      {
        id: 6,
        name: "Project Zeta",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "CNC metal cutting prototype",
        customerId: "C02",
        progress: 40,
        opened: new Date("2025-08-05"),
        delivery: new Date("2025-09-15"),
        invoiceAmount: 2700,
        currency: "USD",
        isOpen: true
      },
      {
        id: 7,
        name: "Project Eta",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "CNC woodworking furniture design",
        customerId: "C03",
        progress: 75,
        opened: new Date("2025-06-25"),
        delivery: new Date("2025-08-28"),
        invoiceAmount: 3500,
        currency: "EUR",
        isOpen: false
      },
      {
        id: 8,
        name: "Project Theta",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Precision CNC spare parts",
        customerId: "C01",
        progress: 20,
        opened: new Date("2025-07-10"),
        delivery: new Date("2025-09-05"),
        invoiceAmount: 1200,
        currency: "USD",
        isOpen: true
      },
      {
        id: 9,
        name: "Project Iota",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Custom CNC signage project",
        customerId: "C04",
        progress: 90,
        opened: new Date("2025-05-22"),
        delivery: new Date("2025-08-18"),
        invoiceAmount: 2800,
        currency: "EUR",
        isOpen: false
      },
      {
        id: 10,
        name: "Project Kappa",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "",
        description: "Industrial CNC automation module",
        customerId: "C02",
        progress: 65,
        opened: new Date("2025-06-30"),
        delivery: new Date("2025-09-10"),
        invoiceAmount: 4000,
        currency: "USD",
        isOpen: true
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
    const customer = this.customers.find(c => c._id === customerId);
    return customer ? customer.name : customerId;
  }
}
