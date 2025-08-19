import { Component } from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Resource} from '../../models/resource';
import {StatusHeader} from '../../components/status-header/status-header';
import {TaskCard} from '../../components/task-card/task-card';

@Component({
  selector: 'app-to-do-list',
  imports: [
    NgSelectComponent,
    StatusHeader,
    TaskCard
  ],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss'
})
export class ToDoList {
  resources: Resource[] = [
    { id: '1', name: 'Alice Dupont', type: 'Person' },
    { id: '2', name: 'Bob Martin', type: 'Person' },
    { id: '3', name: 'Machine CNC-45', type: 'Machine' },
    { id: '4', name: 'Robot de soudure', type: 'Machine' }
  ];
}
