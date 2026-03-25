import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

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
    this.loading = true;
    this.error = '';
    try {
      await this.auth.verifyTotpLogin(this.code);
      await this.auth.refreshRole();
      const role = this.auth.roleSnapshot();
      this.router.navigate([role === 'admin' || role === 'writer' ? '/admin' : '/']);
    } catch (e: any) {
      this.error = 'Código de verificación inválido.';
      console.error('MFA Login Error:', e);
    } finally {
      this.loading = false;
    }
  }
}