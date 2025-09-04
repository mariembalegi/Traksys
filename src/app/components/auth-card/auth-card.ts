import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  templateUrl: './auth-card.html',
  styleUrl: './auth-card.scss'
})
export class AuthCard {
  private router = inject(Router);

  onLogin() {
    // For now, we'll just redirect to dashboard without authentication
    // You can add actual authentication logic here later
    this.router.navigate(['/dashboard']);
  }
}
