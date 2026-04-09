import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
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
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) { }

    async startEnroll() {
        if (this.loading) return;
        this.loading = true;
        this.error = '';

        try {
            const data = await this.auth.enrollTotp('Lagun-App');
            this.qrCode = data.qrCode;
            this.factorId = data.factorId;
        } catch (e: any) {
            this.error = 'No se pudo generar el código QR.';
        } finally {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    async confirmEnroll() {
        if (this.loading) return;

        const cleanCode = this.verifyCode.replace(/\D/g, '');
        if (cleanCode.length !== 6) {
            this.error = 'Introduce los 6 números del código.';
            return;
        }

        console.log('[MFA] Iniciando verificación para factor:', this.factorId);
        this.loading = true;
        this.error = '';
        this.cdr.detectChanges();

        try {
            await this.auth.verifyTotpEnrollment(this.factorId, cleanCode);
            console.log('[MFA] Verificación exitosa en Supabase');

            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('[MFA] Reintentando obtener perfil...');

            const profile = await this.auth.refreshRole();
            console.log('[MFA] Perfil actualizado:', profile);

            const role = profile?.role || this.auth.roleSnapshot();
            const target = (role === 'admin' || role === 'writer') ? '/admin' : '/';

            console.log('[MFA] Intentando navegar a:', target);

            this.zone.run(async () => {
                const success = await this.router.navigate([target]);
                console.log('[MFA] ¿Navegación exitosa?:', success);
                if (!success) {
                    console.error('[MFA] La navegación fue rechazada por un Guard o no existe la ruta.');
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });

        } catch (e: any) {
            console.error('[MFA] Error capturado:', e);
            this.error = e.message || 'Error en la verificación.';
            this.loading = false;
            this.cdr.detectChanges();
        } finally {
            setTimeout(() => {
                if (this.loading) {
                    console.warn('[MFA] El proceso sigue en loading después de 5 segundos, forzando cierre.');
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            }, 5000);
        }
    }
}