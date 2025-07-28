import { Component } from '@angular/core';
import {SidebarNavigation} from '../../components/sidebar-navigation/sidebar-navigation';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarNavigation],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
