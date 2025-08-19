import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopNavigationBar} from '../../components/top-navigation-bar/top-navigation-bar';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    TopNavigationBar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
