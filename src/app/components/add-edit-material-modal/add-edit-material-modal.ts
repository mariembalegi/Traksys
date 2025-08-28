import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-edit-material-modal',
  imports: [
    NgIf
  ],
  templateUrl: './add-edit-material-modal.html',
  styleUrl: './add-edit-material-modal.scss'
})
export class AddEditMaterialModal {
  private dialogRef=inject(DialogRef,{optional:true});

  shape: 'plate' | 'cylindrical bar' | null = null;

  units= [
    { id: 'unit-1', name: 'mm' },
    { id: 'unit-2', name: 'm' }
  ];

  protected closeModal(){
    this.dialogRef?.close();
  }
}
