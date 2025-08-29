import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-available-resource-card',
  standalone: true,
  imports: [],
  templateUrl: './available-resource-card.html',
  styleUrl: './available-resource-card.scss'
})
export class AvailableResourceCard {
  @Input() name!: string;
}
