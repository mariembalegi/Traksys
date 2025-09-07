import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.authService.isAuthenticated()) {
      // Check if route requires specific roles
      const requiredRoles = route.data['roles'] as string[];
      
      if (requiredRoles && requiredRoles.length > 0) {
        if (this.authService.hasRole(requiredRoles)) {
          return true;
        } else {
          // User doesn't have required role, redirect to dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
      
      return true;
    }

    // Not authenticated, redirect to login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
