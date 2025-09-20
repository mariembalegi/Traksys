import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-available-resource-card',
  imports: [CommonModule],
  templateUrl: './available-resource-card.html',
  styleUrl: './available-resource-card.scss'
})
export class AvailableResourceCard {
  @Input() resource?: Resource;
}
