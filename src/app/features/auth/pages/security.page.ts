import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-security',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './security.page.html'
})
export class SecurityPage implements OnInit {
    isMfaActive = false;

    constructor(private auth: AuthService) { }

    async ngOnInit() {
        this.isMfaActive = await this.auth.hasVerifiedTotpFactor();
    }

    async disableMfa() {
        const confirmed = confirm(
            '⚠️ ATENCIÓN: Al desactivar el MFA, tu cuenta será menos segura. ¿Deseas continuar?'
        );

        if (!confirmed) return;

        try {
            const factors = await this.auth.listMfaFactors();
            const factor = factors.find(f => f.status === 'verified');

            if (factor) {
                await this.auth.unenrollFactor(factor.id);
                this.isMfaActive = false;
                alert('Seguridad MFA desactivada correctamente.');
            }
        } catch (e: any) {
            console.error('Error disabling MFA:', e);
            alert('Error al intentar desactivar el factor de seguridad.');
        }
    }
}