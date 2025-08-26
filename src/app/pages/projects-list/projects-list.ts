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
      { id: "c1", name: "ACME Industries", projectIds: ["p1", "p3", "p5", "p7"] },
      { id: "c2", name: "TechnoFab", projectIds: ["p2", "p4", "p6"] },
      { id: "c3", name: "MetalWorks Inc", projectIds: ["p8", "p9", "p10"] },
      { id: "c4", name: "Precision Engineering", projectIds: ["p11", "p12"] },
      { id: "c5", name: "Industrial Solutions", projectIds: ["p13", "p14", "p15"] }
    ];

    this.projects = [
      {
        id: "p1",
        name: "CNC Machine Housing",
        description: "Project for producing CNC machine housing parts.",
        designPicture: "https://picsum.photos/200/120?random=1",
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
        designPicture: "https://picsum.photos/200/120?random=2",
        designFile: "/designs/robotic_arm.dxf",
        customerId: "c2",
        pieceIds: ["pc3"],
        progress: 20,
        opened: new Date("2025-08-10"),
        delivery: new Date("2025-10-01"),
        invoiceAmount: 8000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p3",
        name: "Industrial Valve Assembly",
        description: "Manufacturing precision valve components for industrial applications.",
        designPicture: "https://picsum.photos/200/120?random=3",
        designFile: "/designs/valve_assembly.dxf",
        customerId: "c1",
        pieceIds: ["pc4", "pc5"],
        progress: 85,
        opened: new Date("2025-07-15"),
        delivery: new Date("2025-08-30"),
        invoiceAmount: 22000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p4",
        name: "Automotive Bracket",
        description: "Custom bracket design for automotive suspension system.",
        designPicture: "https://picsum.photos/200/120?random=4",
        designFile: "/designs/auto_bracket.dxf",
        customerId: "c2",
        pieceIds: ["pc6"],
        progress: 45,
        opened: new Date("2025-08-05"),
        delivery: new Date("2025-09-20"),
        invoiceAmount: 5500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p5",
        name: "Aerospace Component",
        description: "High-precision aerospace components with tight tolerances.",
        designPicture: "https://picsum.photos/200/120?random=5",
        designFile: "/designs/aerospace_comp.dxf",
        customerId: "c1",
        pieceIds: ["pc7", "pc8"],
        progress: 30,
        opened: new Date("2025-08-12"),
        delivery: new Date("2025-11-10"),
        invoiceAmount: 35000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p6",
        name: "Marine Equipment",
        description: "Corrosion-resistant marine equipment fabrication.",
        designPicture: "https://picsum.photos/200/120?random=6",
        designFile: "/designs/marine_equip.dxf",
        customerId: "c2",
        pieceIds: ["pc9"],
        progress: 70,
        opened: new Date("2025-07-25"),
        delivery: new Date("2025-09-05"),
        invoiceAmount: 18500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p7",
        name: "Medical Device Parts",
        description: "Precision medical device components requiring FDA compliance.",
        designPicture: "https://picsum.photos/200/120?random=7",
        designFile: "/designs/medical_parts.dxf",
        customerId: "c1",
        pieceIds: ["pc10", "pc11"],
        progress: 95,
        opened: new Date("2025-06-20"),
        delivery: new Date("2025-08-25"),
        invoiceAmount: 28000,
        currency: "EUR",
        isOpen: false
      },
      {
        id: "p8",
        name: "Construction Hardware",
        description: "Heavy-duty construction hardware components.",
        designPicture: "https://picsum.photos/200/120?random=8",
        designFile: "/designs/construction_hw.dxf",
        customerId: "c3",
        pieceIds: ["pc12"],
        progress: 55,
        opened: new Date("2025-08-02"),
        delivery: new Date("2025-09-30"),
        invoiceAmount: 12000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p9",
        name: "Energy Sector Equipment",
        description: "Specialized equipment for renewable energy applications.",
        designPicture: "https://picsum.photos/200/120?random=9",
        designFile: "/designs/energy_equip.dxf",
        customerId: "c3",
        pieceIds: ["pc13", "pc14"],
        progress: 40,
        opened: new Date("2025-08-08"),
        delivery: new Date("2025-10-15"),
        invoiceAmount: 42000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p10",
        name: "Food Processing Machinery",
        description: "Stainless steel components for food processing equipment.",
        designPicture: "https://picsum.photos/200/120?random=10",
        designFile: "/designs/food_machinery.dxf",
        customerId: "c3",
        pieceIds: ["pc15"],
        progress: 80,
        opened: new Date("2025-07-10"),
        delivery: new Date("2025-08-28"),
        invoiceAmount: 16500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p11",
        name: "Precision Tooling",
        description: "High-precision tooling for manufacturing applications.",
        designPicture: "https://picsum.photos/200/120?random=11",
        designFile: "/designs/precision_tooling.dxf",
        customerId: "c4",
        pieceIds: ["pc16", "pc17"],
        progress: 25,
        opened: new Date("2025-08-15"),
        delivery: new Date("2025-10-30"),
        invoiceAmount: 31000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p12",
        name: "Defense Components",
        description: "Military-grade components with special certifications.",
        designPicture: "https://picsum.photos/200/120?random=12",
        designFile: "/designs/defense_comp.dxf",
        customerId: "c4",
        pieceIds: ["pc18"],
        progress: 60,
        opened: new Date("2025-07-28"),
        delivery: new Date("2025-09-12"),
        invoiceAmount: 25500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p13",
        name: "Telecommunications Equipment",
        description: "Precision components for telecommunications infrastructure.",
        designPicture: "https://picsum.photos/200/120?random=13",
        designFile: "/designs/telecom_equip.dxf",
        customerId: "c5",
        pieceIds: ["pc19", "pc20"],
        progress: 35,
        opened: new Date("2025-08-18"),
        delivery: new Date("2025-10-22"),
        invoiceAmount: 19500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p14",
        name: "Laboratory Equipment",
        description: "Specialized laboratory equipment with chemical resistance.",
        designPicture: "https://picsum.photos/200/120?random=14",
        designFile: "/designs/lab_equipment.dxf",
        customerId: "c5",
        pieceIds: ["pc21"],
        progress: 90,
        opened: new Date("2025-06-15"),
        delivery: new Date("2025-08-20"),
        invoiceAmount: 33500,
        currency: "EUR",
        isOpen: false
      },
      {
        id: "p15",
        name: "Oil & Gas Components",
        description: "High-pressure components for oil and gas industry.",
        designPicture: "https://picsum.photos/200/120?random=15",
        designFile: "/designs/oil_gas_comp.dxf",
        customerId: "c5",
        pieceIds: ["pc22", "pc23"],
        progress: 15,
        opened: new Date("2025-08-20"),
        delivery: new Date("2025-11-30"),
        invoiceAmount: 48000,
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
