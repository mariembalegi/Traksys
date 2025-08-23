import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-top-navigation-bar',
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './top-navigation-bar.html',
  styleUrl: './top-navigation-bar.scss'
})
export class TopNavigationBar {

  @Input() route1 !:string;
  @Input() route2 !:string;
  @Input() route3 !:string;
  @Input() route4 !:string;
  @Input() route5 !:string;

  constructor(public router: Router) {}

  isActive(route:string): boolean {
    return this.router.url.includes(route);
  }

}
