import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-available-resource-card',
  imports: [],
  templateUrl: './available-resource-card.html',
  styleUrl: './available-resource-card.scss'
})
export class AvailableResourceCard {
  @Input() name!: string;
}
