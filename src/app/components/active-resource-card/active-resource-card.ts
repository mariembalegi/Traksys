import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-active-resource-card',
  imports: [],
  templateUrl: './active-resource-card.html',
  styleUrl: './active-resource-card.scss'
})
export class ActiveResourceCard {
  @Input() name!: string;
  @Input() resourceTitle!: string;
  @Input() resourceName!: string;
}
