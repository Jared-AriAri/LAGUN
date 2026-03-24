import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  fullName = '';
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.errorMsg = '';
    this.successMsg = '';
    this.loading = true;

    try {
      await this.auth.signUp(
        this.email.trim(),
        this.password,
        this.fullName.trim()
      );

      this.successMsg = 'Cuenta creada correctamente.';
      this.router.navigate(['/login']);
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'No se pudo crear la cuenta.';
    } finally {
      this.loading = false;
    }
  }
}