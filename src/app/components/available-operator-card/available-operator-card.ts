import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../core/services/resources.service';

@Component({
  selector: 'app-available-operator-card',
  imports: [CommonModule],
  templateUrl: './available-operator-card.html',
  styleUrl: './available-operator-card.scss'
})
export class AvailableOperatorCard {
  @Input() resource?: Resource;
  @Output() edit = new EventEmitter<Resource>();
  @Output() delete = new EventEmitter<Resource>();

  onEdit(): void {
    if (this.resource) {
      this.edit.emit(this.resource);
    }
  }

  onDelete(): void {
    if (this.resource) {
      this.delete.emit(this.resource);
    }
  }
}
