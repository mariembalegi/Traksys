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
    { id: "r1", name: "CNC Operator", type: "Person", taskIds: ["t1", "t4"] },
    { id: "r2", name: "Lathe Machine", type: "Machine", taskIds: ["t1"] },
    { id: "r3", name: "Welder", type: "Person", taskIds: ["t3"] }
  ];
  protected closeModal(){
    this.dialogRef?.close();
  }
}
