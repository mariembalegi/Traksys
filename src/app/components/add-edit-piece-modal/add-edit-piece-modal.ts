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

  units= [
    { id: 'unit-1', name: 'mm' },
    { id: 'unit-2', name: 'm' }
  ];
  private dialogRef=inject(DialogRef,{optional:true});
  protected closeModal(){
    this.dialogRef?.close();
  }
}
