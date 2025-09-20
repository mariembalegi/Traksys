import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-available-operator-card',
  imports: [CommonModule],
  templateUrl: './available-operator-card.html',
  styleUrl: './available-operator-card.scss'
})
export class AvailableOperatorCard {
  @Input() resource?: Resource;
}
