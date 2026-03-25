import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-security-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './security.page.html',
})
export class SecurityPage implements OnInit {
    loading = false;
    errorMsg = '';
    successMsg = '';
    hasTotp = false;
    factorId = '';

    constructor(private auth: AuthService) { }

    async ngOnInit() {
        await this.load();
    }

    async load() {
        this.loading = true;
        this.errorMsg = '';

        try {
            const factors = await this.auth.listMfaFactors();
            const totp = factors.find(
                (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
            );

            this.hasTotp = !!totp;
            this.factorId = totp?.id ?? '';
        } catch (e: any) {
            this.errorMsg = e?.message ?? 'No se pudo cargar MFA.';
        } finally {
            this.loading = false;
        }
    }

    async disableMfa() {
        this.loading = true;
        this.errorMsg = '';
        this.successMsg = '';

        try {
            await this.auth.unenrollFactor(this.factorId);
            this.successMsg = 'MFA desactivado correctamente.';
            await this.load();
        } catch (e: any) {
            this.errorMsg = e?.message ?? 'No se pudo desactivar MFA.';
        } finally {
            this.loading = false;
        }
    }
}