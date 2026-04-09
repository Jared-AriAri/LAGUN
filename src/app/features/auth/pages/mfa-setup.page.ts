import { Component, ChangeDetectorRef } from '@angular/core';
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
    loading = false;
    error = '';

    constructor(
        private auth: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    async startEnroll() {
        this.loading = true;
        this.error = '';

        try {
            const data = await this.auth.enrollTotp('Lagun-MFA');
            this.qrCode = data.qrCode;
            this.factorId = data.factorId;
        } catch (e: any) {
            this.error = 'No se pudo generar el código QR. Intenta de nuevo.';
            console.error(e);
        } finally {
            this.loading = false;
            this.cdr.detectChanges(); // Fuerza a Angular a mostrar el QR inmediatamente
        }
    }

    async confirmEnroll() {
        if (this.verifyCode.length !== 6) return;

        this.loading = true;
        this.error = '';

        try {
            await this.auth.verifyTotpEnrollment(this.factorId, this.verifyCode);

            await this.auth.refreshRole();
            const role = this.auth.roleSnapshot();

            const target = (role === 'admin' || role === 'writer') ? '/admin' : '/';
            await this.router.navigate([target]);

        } catch (e: any) {
            this.error = 'El código de verificación es incorrecto.';
            this.loading = false;
            this.cdr.detectChanges();
        }
    }
}