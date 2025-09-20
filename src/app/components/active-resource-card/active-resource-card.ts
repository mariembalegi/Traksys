import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-active-resource-card',
  imports: [CommonModule],
  templateUrl: './active-resource-card.html',
  styleUrl: './active-resource-card.scss'
})
export class ActiveResourceCard {
  @Input() resource?: Resource;
}
