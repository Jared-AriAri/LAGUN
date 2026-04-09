import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const mfaGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const aal = await auth.getAuthenticatorAssuranceLevel();

    if (aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        return router.parseUrl('/auth/mfa-verify');
    }

    return true;
};