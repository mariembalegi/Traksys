import {Component, inject} from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-edit-piece-modal',
  imports: [],
  templateUrl: './add-edit-piece-modal.html',
  styleUrl: './add-edit-piece-modal.scss'
})
export class AddEditPieceModal {
  private dialogRef=inject(DialogRef,{optional:true});
  protected closeModal(){
    this.dialogRef?.close();
  }
}
