import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-mfa-verify-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mfa-verify.page.html',
})
export class MfaVerifyPage {
  code = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) { }

  async submit() {
    this.loading = true;
    this.errorMsg = '';

    try {
      await this.auth.verifyTotpLogin(this.code);
      await this.auth.refreshRole();

      const role = this.auth.roleSnapshot();
      const redirectUrl = localStorage.getItem('redirectUrl');
      localStorage.removeItem('redirectUrl');

      if (redirectUrl && redirectUrl !== '/login') {
        this.router.navigateByUrl(redirectUrl);
      } else {
        this.router.navigate([
          role === 'admin' || role === 'writer' ? '/admin' : '/',
        ]);
      }
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Código inválido.';
    } finally {
      this.loading = false;
    }
  }
}