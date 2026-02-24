import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.errorMsg = '';
    this.loading = true;

    try {
      await this.auth.signIn(this.email.trim(), this.password);

      await this.auth.refreshRole?.();

      const role = this.auth.roleSnapshot();
      this.router.navigate([role === 'editor' ? '/admin' : '/']);
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'No se pudo iniciar sesión.';
    } finally {
      this.loading = false;
    }
  }
}
