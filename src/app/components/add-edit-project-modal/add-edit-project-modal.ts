import {Component, inject} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Customer} from '../../models/customer';
import {Dialog, DialogRef} from '@angular/cdk/dialog';
import {AddCustomerModal} from '../add-customer-modal/add-customer-modal';




@Component({
  selector: 'app-add-edit-project-modal',
  imports: [
    NgSelectComponent
  ],
  templateUrl: './add-edit-project-modal.html',
  styleUrl: './add-edit-project-modal.scss'
})
export class AddEditProjectModal {
  private dialogRef=inject(DialogRef,{optional:true});
  private dialog=inject(Dialog);

  customers: Customer[] = [
    { _id: "C01", name: "Natilait" },
    { _id: "C02", name: "Sagemcom" },
    { _id: "C03", name: "Orange" },
    { _id: "C04", name: "Total" }
  ];

  currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'TND', name: 'Tunisian Dinar' }
  ];



  protected addCustomerModal() {
    this.dialog.open(AddCustomerModal,{disableClose: true});
  }

  protected closeModal(){
    this.dialogRef?.close();
  }
}
