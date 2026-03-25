import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-mfa-setup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './mfa-setup.page.html'
})
export class MfaSetupPage {
    qrCode = '';
    factorId = '';
    verifyCode = '';
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    async startEnroll() {
        this.loading = true;
        this.error = '';
        try {
            const result = await this.auth.enrollTotp('Lagun');
            this.qrCode = result.qrCode;
            this.factorId = result.factorId;
        } catch (e: any) {
            this.error = e.message || 'Error al conectar con Supabase';
            console.error('MFA Enrollment Error:', e);
        } finally {
            this.loading = false;
        }
    }

    async confirmEnroll() {
        this.loading = true;
        this.error = '';
        try {
            await this.auth.verifyTotpEnrollment(this.factorId, this.verifyCode);
            this.router.navigate(['/security']);
        } catch (e: any) {
            this.error = 'Código incorrecto. Intenta de nuevo.';
            console.error('MFA Verification Error:', e);
        } finally {
            this.loading = false;
        }
    }
}