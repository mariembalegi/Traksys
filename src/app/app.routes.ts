import { Routes } from '@angular/router';
import {Dashboard} from './pages/dashboard/dashboard';
import {Home} from './pages/home/home';
import {Projects} from './pages/projects/projects';
import {ProjectsList} from './pages/projects-list/projects-list';
import {ProjectDetails} from './pages/project-details/project-details';
import {ToDoList} from './pages/to-do-list/to-do-list';
import {Login} from './pages/login/login';
import {Stock} from './pages/stock/stock';

export const routes: Routes = [
  {
    path:'login',
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
        children:[
          {
            path: '',
            component: ProjectsList,
          },
          { path: 'project-details/:id',
            component: ProjectDetails
          }
        ]
      },
      {
        path: 'to-do-list',
        component: ToDoList
      },
      {
        path: 'stock',
        component: Stock
      }
    ]
  },
];
