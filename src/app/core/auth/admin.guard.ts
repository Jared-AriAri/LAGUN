import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const logged = await this.auth.isLoggedIn();
    if (!logged) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.auth.roleSnapshot() === 'admin') return true;

    this.router.navigate(['/']);
    return false;
  }
}
