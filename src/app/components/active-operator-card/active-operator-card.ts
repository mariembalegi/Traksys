import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-active-operator-card',
  imports: [CommonModule],
  templateUrl: './active-operator-card.html',
  styleUrl: './active-operator-card.scss'
})
export class ActiveOperatorCard {
  @Input() resource?: Resource;
}
