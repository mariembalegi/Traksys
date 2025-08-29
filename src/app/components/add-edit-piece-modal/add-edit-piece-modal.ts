import {Component, inject} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DialogRef} from '@angular/cdk/dialog';
import {Material} from '../../models/material';

@Component({
  selector: 'app-add-edit-piece-modal',
  imports: [
    NgSelectComponent
  ],
  templateUrl: './add-edit-piece-modal.html',
  styleUrl: './add-edit-piece-modal.scss'
})
export class AddEditPieceModal {
  materials: Material[] = [
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

  types = [
    { id: 'type-1', name: 'Al' },     // Aluminum
    { id: 'type-2', name: 'Fe' },     // Iron/Steel
    { id: 'type-3', name: 'Cu' },     // Copper
    { id: 'type-4', name: 'Zn' },     // Zinc
    { id: 'type-5', name: 'Ti' },     // Titanium
    { id: 'type-6', name: 'Mg' },     // Magnesium
    { id: 'type-7', name: 'Ni' },     // Nickel
    { id: 'type-8', name: 'Cr' },     // Chromium
    { id: 'type-9', name: 'Pb' },     // Lead
    { id: 'type-10', name: 'Sn' }     // Tin
  ];

  private dialogRef=inject(DialogRef,{optional:true});
  protected closeModal(){
    this.dialogRef?.close();
  }
}
