import {Component, inject} from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-customer-modal',
  imports: [],
  templateUrl: './add-customer-modal.html',
  styleUrl: './add-customer-modal.scss'
})
export class AddCustomerModal {

  private dialogRef=inject(DialogRef,{optional:true});


  protected closeModal(){
    this.dialogRef?.close();
  }
}
