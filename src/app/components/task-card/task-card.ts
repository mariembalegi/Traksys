import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DatePipe, CommonModule} from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    CommonModule
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
  @Input() pieceName?: string;
  @Input() pieceReference?: string;
  @Output() cardClick = new EventEmitter<void>();

  onCardClick() {
    this.cardClick.emit();
  }
}
