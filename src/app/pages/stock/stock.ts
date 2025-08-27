import {Component, inject} from '@angular/core';
import {Material} from '../../models/material';
import {DatePipe, NgForOf} from '@angular/common';
import {Paginator} from '../../components/paginator/paginator';
import {Project} from '../../models/project';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditProjectModal} from '../../components/add-edit-project-modal/add-edit-project-modal';
import {AddEditMaterialModal} from '../../components/add-edit-material-modal/add-edit-material-modal';

@Component({
  selector: 'app-stock',
  imports: [
    NgForOf,
    DatePipe,
    Paginator,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './stock.html',
  styleUrl: './stock.scss'
})
export class Stock {
  private dialog=inject(Dialog);
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
        pieceIds: ["pc11"]
      }
    ];
    // Add 50 more materials for paginator test
    for (let i = 11; i <= 60; i++) {
      this.materials.push({
        id: `m${i}`,
        material: `Material${i}`,
        type: i % 2 === 0 ? "TypeA" : "TypeB",
        quantity: 10 * i,
        shape: i % 2 === 0 ? "Plate" : "Cylindrical Bar",
        unit: "mm",
        last_updated: new Date(2025, 7, 1 + i),
        diameter: i % 2 === 0 ? undefined : 10 + i,
        length: i % 2 === 0 ? undefined : 1000 + i * 10,
        x: i % 2 === 0 ? 100 + i * 5 : undefined,
        y: i % 2 === 0 ? 50 + i * 2 : undefined,
        thickness: i % 2 === 0 ? 5 + i : undefined,
        pieceIds: [`pc${i}`]
      });
    }
    // Update any hardcoded materials with unit 'm' to 'mm'
    this.materials = this.materials.map(mat => ({ ...mat, unit: 'mm' }));
    this.applyFilters();
  }
  onPageChange(currentPageItems: Material[]) {
    this.pagedMaterials = currentPageItems;
  }
  applyFilters() {
    this.filteredMaterials = this.materials.filter(material => {
      const matchesSearch = !this.searchText || material.material.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesSearch ;
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
