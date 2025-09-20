import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../core/services/resources.service';

@Component({
  selector: 'app-active-resource-card',
  imports: [CommonModule],
  templateUrl: './active-resource-card.html',
  styleUrl: './active-resource-card.scss'
})
export class ActiveResourceCard {
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
