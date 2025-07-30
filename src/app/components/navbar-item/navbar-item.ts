import {Component, Input} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar-item',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './navbar-item.html',
  styleUrl: './navbar-item.scss'
})
export class NavbarItem {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route!: string;

  constructor(public router: Router) {}

  isActive(): boolean {
    return this.router.url.includes(this.route);
  }


}
