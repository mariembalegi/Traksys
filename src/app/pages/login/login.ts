import { Component } from '@angular/core';
import {AuthCard} from '../../components/auth-card/auth-card';

@Component({
  selector: 'app-login',
  imports: [
    AuthCard
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
