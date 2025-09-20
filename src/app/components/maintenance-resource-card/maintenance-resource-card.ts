import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-maintenance-resource-card',
  imports: [CommonModule],
  templateUrl: './maintenance-resource-card.html',
  styleUrl: './maintenance-resource-card.scss'
})
export class MaintenanceResourceCard {
  @Input() resource?: Resource;
}
