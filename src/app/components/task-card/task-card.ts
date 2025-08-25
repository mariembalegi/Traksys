import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {
  @Input() taskName!: string;
  @Input() taskDescription!: string;
  @Input() taskDueDate!: Date ;
  @Input() taskEstimatedTime!:number;
  @Input() taskCommentsNumber!:number;
}
