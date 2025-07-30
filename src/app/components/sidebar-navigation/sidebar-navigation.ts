import { Component } from '@angular/core';
import {Header} from '../header/header';
import {NavbarItem} from '../navbar-item/navbar-item';

@Component({
  selector: 'app-sidebar-navigation',
  imports: [Header,NavbarItem],
  templateUrl: './sidebar-navigation.html',
  styleUrl: './sidebar-navigation.scss'
})
export class SidebarNavigation {

}
