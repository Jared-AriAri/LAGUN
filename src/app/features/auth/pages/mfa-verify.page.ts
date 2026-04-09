import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-mfa-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mfa-verify.page.html'
})
export class MfaVerifyPage {
  code = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async verify() {
    if (this.code.length < 6) return;
    this.loading = true;
    this.error = '';

    try {
      await this.auth.verifyTotpLogin(this.code);
      const profile = await this.auth.refreshRole();

      const route = (profile?.role === 'admin' || profile?.role === 'writer') ? '/admin' : '/';
      await this.router.navigate([route]);
    } catch (e: any) {
      this.error = 'Código incorrecto o expirado.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}