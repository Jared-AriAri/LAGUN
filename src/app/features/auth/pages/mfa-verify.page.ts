import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

interface UserProfile {
  role: string;
}

@Component({
  selector: 'app-mfa-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mfa-verify.page.html'
})
export class MfaVerifyPage {
  code = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  async verify() {
    if (this.code.length < 6) return;

    this.loading = true;
    this.error = '';

    try {
      await this.auth.verifyTotpLogin(this.code);
      const user = await this.auth.refreshRole() as UserProfile | null;

      const isAdmin = user?.role === 'admin' || user?.role === 'writer';
      const targetRoute = isAdmin ? '/admin' : '/';

      await this.router.navigate([targetRoute]);
    } catch (e: any) {
      this.error = 'Código de verificación inválido o expirado.';
      this.loading = false;
    }
  }
}