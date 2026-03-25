import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
      <div class="max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div class="text-5xl mb-4">📧</div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Verifica tu correo</h1>
        <p class="text-gray-600 mb-6">
          Hemos enviado un enlace de confirmación a: <br>
          <strong class="text-black">{{ email }}</strong>
        </p>
        
        <div *ngIf="message" class="p-3 mb-6 text-sm rounded-lg bg-green-50 text-green-700 border border-green-200">
          {{ message }}
        </div>

        <div *ngIf="error" class="p-3 mb-6 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200">
          {{ error }}
        </div>

        <button (click)="resend()" [disabled]="loading" 
          class="w-full py-3 px-4 mb-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:bg-gray-400">
          {{ loading ? 'Intentando enviar...' : 'Reenviar correo de confirmación' }}
        </button>

        <button routerLink="/login" class="w-full py-3 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
          Volver al Login
        </button>
      </div>
    </div>
  `
})
export class ConfirmEmailPage implements OnInit {
  email: string = '';
  loading: boolean = false;
  message: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    if (this.email) {
      console.log('Esperando confirmación para:', this.email);
    }
  }

  async resend() {
    this.loading = true;
    this.message = '';
    this.error = '';

    try {
      await this.auth.resendConfirmationEmail(this.email);
      this.message = '¡Enviado! Revisa tu bandeja de entrada.';
    } catch (e: any) {
      console.error('Error al reenviar:', e);
      this.error = e.message || 'Error al intentar reenviar el correo.';
    } finally {
      this.loading = false;
    }
  }
}