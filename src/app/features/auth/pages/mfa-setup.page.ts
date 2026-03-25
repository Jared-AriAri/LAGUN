import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-mfa-setup-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './mfa-setup.page.html',
})
export class MfaSetupPage {
    loading = false;
    verifying = false;
    errorMsg = '';
    successMsg = '';
    factorId = '';
    qrCode = '';
    secret = '';
    uri = '';
    code = '';

    constructor(private auth: AuthService, private router: Router) { }

    async startSetup() {
        this.loading = true;
        this.errorMsg = '';
        this.successMsg = '';

        try {
            const result = await this.auth.enrollTotp('Seguridad principal');
            this.factorId = result.factorId;
            this.qrCode = result.qrCode;
            this.secret = result.secret;
            this.uri = result.uri;
        } catch (e: any) {
            this.errorMsg = e?.message ?? 'No se pudo iniciar la configuración MFA.';
        } finally {
            this.loading = false;
        }
    }

    async verify() {
        this.verifying = true;
        this.errorMsg = '';
        this.successMsg = '';

        try {
            await this.auth.verifyTotpEnrollment(this.factorId, this.code);
            this.successMsg = 'Autenticación en dos pasos activada correctamente.';
            this.router.navigate(['/security']);
        } catch (e: any) {
            this.errorMsg = e?.message ?? 'No se pudo verificar el código.';
        } finally {
            this.verifying = false;
        }
    }
}