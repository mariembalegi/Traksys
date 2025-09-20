import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../core/services/resources.service';

@Component({
  selector: 'app-available-resource-card',
  imports: [CommonModule],
  templateUrl: './available-resource-card.html',
  styleUrl: './available-resource-card.scss'
})
export class AvailableResourceCard {
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
