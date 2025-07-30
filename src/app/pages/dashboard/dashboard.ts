import { Component } from '@angular/core';
import {SidebarNavigation} from '../../components/sidebar-navigation/sidebar-navigation';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarNavigation, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
