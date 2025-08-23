import {Component, inject} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DialogRef} from '@angular/cdk/dialog';
import {Resource} from '../../models/resource';

@Component({
  selector: 'app-add-edit-task-modal',
  imports: [
    NgSelectComponent
  ],
  templateUrl: './add-edit-task-modal.html',
  styleUrl: './add-edit-task-modal.scss'
})
export class AddEditTaskModal {
  private dialogRef=inject(DialogRef,{optional:true});
  resources: Resource[] = [
    { id: 'res-1', name: 'John Doe', type: 'Person' },
    { id: 'res-2', name: 'Alice Smith', type: 'Person' },
    { id: 'res-3', name: 'Lathe Machine', type: 'Machine' },
    { id: 'res-4', name: 'CNC Cutter', type: 'Machine' },
    { id: 'res-5', name: 'Welding Robot', type: 'Machine' }
  ];
  protected closeModal(){
    this.dialogRef?.close();
  }
}
