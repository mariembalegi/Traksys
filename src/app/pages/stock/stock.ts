import {Component, inject} from '@angular/core';
import {Material} from '../../models/material';
import {DatePipe, NgForOf, CommonModule} from '@angular/common';
import {Paginator} from '../../components/paginator/paginator';
import {Project} from '../../models/project';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditProjectModal} from '../../components/add-edit-project-modal/add-edit-project-modal';
import {AddEditMaterialModal} from '../../components/add-edit-material-modal/add-edit-material-modal';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-stock',
  imports: [
    NgForOf,
    DatePipe,
    Paginator,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './stock.html',
  styleUrl: './stock.scss'
})
export class Stock {
  trackByMaterialId(index: number, material: Material): string {
    return material.id;
  }
  private dialog=inject(Dialog);
  private alertService = inject(AlertService);
  materials:Material[]=[];
  filteredMaterials:Material[]=[];
  pagedMaterials: Material[] = [];
  itemsPerPage = 50;
  searchText: string = '';

  ngOnInit() {
    this.loadOnData()
  }
  loadOnData() {
    this.materials = [
      {
        id: "m0",
        material: "CriticalZero",
        type: "CZ",
        quantity: 0,
        shape: "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date(),
        diameter: 10,
        length: 100,
        available_length: 0,
        min_length: 1.0,
        pieceIds: []
      },
      {
        id: "m00",
        material: "CriticalAreaZero",
        type: "CAZ",
        quantity: 0,
        shape: "Plate",
        unit: "mm",
        last_updated: new Date(),
        x: 100,
        y: 50,
        thickness: 5,
        available_area: 0,
        min_area: 0.1,
        pieceIds: []
      },

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
        available_length: 2.0,
        min_length: 1.0,
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
        available_area: 1.2,
        min_area: 0.2,
        pieceIds: ["pc2", "pc3"]
      },
      // Additional stock items for paginator test
      {
        id: "m3",
        material: "Copper",
        type: "Cu-ETP",
        quantity: 60,
        shape: "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date("2025-08-15"),
        diameter: 10,
        length: 1500,
        available_length: 1.5,
        min_length: 0.8,
        pieceIds: ["pc4"]
      },
      {
        id: "m4",
        material: "Brass",
        type: "CuZn37",
        quantity: 40,
        shape: "Plate",
        unit: "mm",
        last_updated: new Date("2025-08-10"),
        x: 800,
        y: 400,
        thickness: 15,
        available_area: 0.9,
        min_area: 0.15,
        pieceIds: ["pc5"]
      },
      {
        id: "m5",
        material: "Titanium",
        type: "Grade 2",
        quantity: 25,
        shape: "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date("2025-08-05"),
        diameter: 20,
        length: 1200,
        available_length: 1.2,
        min_length: 0.5,
        pieceIds: ["pc6"]
      },
      {
        id: "m6",
        material: "Plastic",
        type: "ABS",
        quantity: 200,
        shape: "Plate",
        unit: "mm",
        last_updated: new Date("2025-08-01"),
        x: 200,
        y: 100,
        thickness: 5,
        available_area: 0.2,
        min_area: 0.3,
        pieceIds: ["pc7"]
      },
      {
        id: "m7",
        material: "Lead",
        type: "Pb",
        quantity: 10,
        shape: "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date("2025-07-28"),
        diameter: 30,
        length: 800,
        available_length: 0.8,
        min_length: 0.3,
        pieceIds: ["pc8"]
      },
      {
        id: "m8",
        material: "Zinc",
        type: "Zn",
        quantity: 30,
        shape: "Plate",
        unit: "mm",
        last_updated: new Date("2025-07-25"),
        x: 300,
        y: 150,
        thickness: 8,
        available_area: 0.1,
        min_area: 0.1,
        pieceIds: ["pc9"]
      },
      {
        id: "m9",
        material: "Nickel",
        type: "Ni",
        quantity: 15,
        shape: "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date("2025-07-20"),
        diameter: 12,
        length: 600,
        available_length: 0.6,
        min_length: 0.7,
        pieceIds: ["pc10"]
      },
      {
        id: "m10",
        material: "Magnesium",
        type: "Mg",
        quantity: 5,
        shape: "Plate",
        unit: "mm",
        last_updated: new Date("2025-07-15"),
        x: 100,
        y: 50,
        thickness: 2,
        available_area: 0.05,
        min_area: 0.05,
        pieceIds: ["pc11"]
      }
    ];
    // Add 50 more materials for paginator test
    for (let i = 11; i <= 60; i++) {
      if (i % 2 === 0) {
        // Plate
        this.materials.push({
          id: `m${i}`,
          material: `Material${i}`,
          type: "TypeA",
          quantity: 10 * i,
          shape: "Plate",
          unit: "mm",
          last_updated: new Date(2025, 7, 1 + i),
          x: 100 + i * 5,
          y: 50 + i * 2,
          thickness: 5 + i,
          available_area: 0.1 + (i * 0.01),
          min_area: 0.05 + (i * 0.005),
          pieceIds: [`pc${i}`]
        });
      } else {
        // Cylindrical Bar
        this.materials.push({
          id: `m${i}`,
          material: `Material${i}`,
          type: "TypeB",
          quantity: 10 * i,
          shape: "Cylindrical Bar",
          unit: "mm",
          last_updated: new Date(2025, 7, 1 + i),
          diameter: 10 + i,
          length: 1000 + i * 10,
          available_length: 0.5 + (i * 0.05),
          min_length: 0.3 + (i * 0.03),
          pieceIds: [`pc${i}`]
        });
      }
    }
    // Sort so low-stock materials appear first
    this.materials.sort((a, b) => {
      const aLow = (typeof a.available_length === 'number' && typeof a.min_length === 'number' && a.available_length <= a.min_length)
        || (typeof a.available_area === 'number' && typeof a.min_area === 'number' && a.available_area <= a.min_area);
      const bLow = (typeof b.available_length === 'number' && typeof b.min_length === 'number' && b.available_length <= b.min_length)
        || (typeof b.available_area === 'number' && typeof b.min_area === 'number' && b.available_area <= b.min_area);
      if (aLow === bLow) return 0;
      return aLow ? -1 : 1;
    });
    // After sorting and filtering
    this.triggerLowStockAlerts();
    this.applyFilters();
  }

  triggerLowStockAlerts() {
    const currentAlerts = this.alertService['alerts'].value;
    const alertKeys = new Set(currentAlerts.map(a => `${a.type}:${a.message}`));
    this.materials.forEach(material => {
      let isCritical = false;
      let isLow = false;
      let alertMessage = '';
      let alertType: 'low-stock' | 'critical-stock' | undefined = undefined;
      let alertTitle: string | undefined = undefined;
      // Check for critical (out of stock)
      if (typeof material.available_length === 'number' && material.available_length === 0) {
        isCritical = true;
        alertMessage = `${material.material} (${material.type}) completely out of stock`;
        alertType = 'critical-stock';
        alertTitle = 'Critical Stock Level';
      } else if (typeof material.available_area === 'number' && material.available_area === 0) {
        isCritical = true;
        alertMessage = `${material.material} (${material.type}) completely out of stock`;
        alertType = 'critical-stock';
        alertTitle = 'Critical Stock Level';
      } else if ((typeof material.available_length === 'number' && typeof material.min_length === 'number' && material.available_length > 0 && material.available_length <= material.min_length)
        || (typeof material.available_area === 'number' && typeof material.min_area === 'number' && material.available_area > 0 && material.available_area <= material.min_area)) {
        isLow = true;
        const remaining = typeof material.available_length === 'number' ? `${material.available_length} mm` :
                          typeof material.available_area === 'number' ? `${material.available_area} mm²` : `${material.quantity} units`;
        alertMessage = `${material.material} (${material.type}) inventory is running low (${remaining} remaining)`;
        alertType = 'low-stock';
        alertTitle = 'Low Stock Alert';
      }
      if ((isCritical || isLow) && alertType && alertTitle && !alertKeys.has(`${alertType}:${alertMessage}`)) {
        this.alertService.addAlert({
          id: Date.now(),
          type: alertType,
          title: alertTitle,
          message: alertMessage,
          severity: 'high',
          timestamp: new Date()
        });
      }
    });
  }

  onPageChange(currentPageItems: Material[]) {
    this.pagedMaterials = currentPageItems;
  }
  applyFilters() {
    this.filteredMaterials = this.materials.filter(material => {
      const search = this.searchText.toLowerCase();
      const matchesName = material.material.toLowerCase().includes(search);
      const matchesType = material.type.toLowerCase().includes(search);
      return !this.searchText || matchesName || matchesType;
    });
    // Initialize pagedMaterials with first page if filteredMaterials is not empty
    if (this.filteredMaterials.length > 0) {
      this.pagedMaterials = this.filteredMaterials.slice(0, this.itemsPerPage);
    } else {
      this.pagedMaterials = [];
    }
  }

  deleteMaterial(index: number) {
    // Get the actual project from pagedMaterial (what's currently displayed)
    const materialToDelete = this.pagedMaterials[index];

    // Remove from main projects array
    const mainIndex = this.materials.findIndex(m => m.id === materialToDelete.id);
    if (mainIndex > -1) {
      this.materials.splice(mainIndex, 1);
    }

    // Reapply filters and pagination
    this.applyFilters();
  }
  protected addEditModal() {
    this.dialog.open(AddEditMaterialModal,{disableClose: true});
  }
  }
