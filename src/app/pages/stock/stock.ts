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
  itemsPerPage = 8;
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
      }
    ];
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
