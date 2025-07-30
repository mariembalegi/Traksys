import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {Dashboard} from './pages/dashboard/dashboard';
import {Home} from './pages/home/home';
import {Projects} from './pages/projects/projects';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'home',
        component:Home,
      },
      {
        path: 'projects',
        component:Projects,
      }
    ]
  },

];
