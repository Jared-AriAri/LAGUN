import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const mfaGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const { currentLevel, nextLevel } = await auth.getAuthenticatorAssuranceLevel();

    if (nextLevel === 'aal2' && currentLevel !== 'aal2') {
        return router.parseUrl('/mfa/verify');
    }

    return true;
};