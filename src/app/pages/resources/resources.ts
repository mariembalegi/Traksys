import { Component } from '@angular/core';
import {MaintenanceResourceCard} from '../../components/maintenance-resource-card/maintenance-resource-card';
import {ActiveResourceCard} from '../../components/active-resource-card/active-resource-card';
import {AvailableResourceCard} from '../../components/available-resource-card/available-resource-card';

@Component({
  selector: 'app-resources',
  imports: [
    MaintenanceResourceCard,
    ActiveResourceCard,
    AvailableResourceCard
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class Resources {

}
