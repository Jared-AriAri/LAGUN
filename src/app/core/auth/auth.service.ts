import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type {
  AuthChangeEvent,
  Factor,
  Session,
  User,
} from '@supabase/supabase-js';
import { SupabaseService } from '../../services/supabase.service';

export type AppRole = 'reader' | 'writer' | 'admin';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  role: AppRole;
};

export type MfaEnrollResult = {
  factorId: string;
  qrCode: string;
  secret: string;
  uri: string;
};

export type AuthenticatorAssuranceLevelResponse = {
  currentLevel: 'aal1' | 'aal2' | null;
  nextLevel: 'aal1' | 'aal2' | null;
  currentAuthenticationMethods: {
    method: string;
    timestamp: number;
  }[];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private session$ = new BehaviorSubject<Session | null>(null);
  private role$ = new BehaviorSubject<AppRole>('reader');
  private profile$ = new BehaviorSubject<Profile | null>(null);
  private ready$ = new BehaviorSubject<boolean>(false);
  private initialized = false;

  constructor(private supa: SupabaseService) { }

  async init() {
    if (this.initialized) return;
    this.initialized = true;
    this.ready$.next(false);

    const { data, error } = await this.supa.supabase.auth.getSession();

    if (error) {
      this.session$.next(null);
      this.role$.next('reader');
      this.profile$.next(null);
      this.ready$.next(true);
      return;
    }

    this.session$.next(data.session ?? null);
    await this.refreshFromSession(data.session ?? null);

    this.supa.supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        this.session$.next(session);
        await this.refreshFromSession(session);
        this.ready$.next(true);
      }
    );

    this.ready$.next(true);
  }

  sessionSnapshot(): Session | null {
    return this.session$.value;
  }

  isLoggedInSnapshot(): boolean {
    return !!this.session$.value?.user?.id;
  }

  async isLoggedIn(): Promise<boolean> {
    const { data, error } = await this.supa.supabase.auth.getSession();
    if (error) return false;
    return !!data.session?.user?.id;
  }

  roleSnapshot(): AppRole {
    return this.role$.value;
  }

  profileSnapshot(): Profile | null {
    return this.profile$.value;
  }

  isReadySnapshot(): boolean {
    return this.ready$.value;
  }

  sessionChanges() {
    return this.session$.asObservable();
  }

  roleChanges() {
    return this.role$.asObservable();
  }

  profileChanges() {
    return this.profile$.asObservable();
  }

  readyChanges() {
    return this.ready$.asObservable();
  }

  async currentUser(): Promise<User | null> {
    const { data, error } = await this.supa.supabase.auth.getUser();
    if (error) return null;
    return data.user;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supa.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(this.mapAuthError(error.message));
    }

    const { data: userData, error: userError } =
      await this.supa.supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('No se pudo validar la sesión.');
    }

    if (!userData.user.email_confirmed_at) {
      await this.supa.supabase.auth.signOut();
      throw new Error('Debes confirmar tu correo antes de iniciar sesión.');
    }

    this.session$.next(data.session ?? null);
    await this.refreshFromSession(data.session ?? null);
    return data;
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await this.supa.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://lagun.vercel.app/login',
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new Error(this.mapAuthError(error.message));
    }

    return data;
  }

  async signOut() {
    await this.supa.supabase.auth.signOut();
    this.session$.next(null);
    this.role$.next('reader');
    this.profile$.next(null);
  }

  async refreshRole() {
    await this.refreshFromSession(this.sessionSnapshot());
  }

  async resendConfirmationEmail(email: string) {
    const { error } = await this.supa.supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw new Error(error.message || 'Error al reenviar el correo.');
    }
  }

  async getAuthenticatorAssuranceLevel(): Promise<AuthenticatorAssuranceLevelResponse> {
    const { data, error } =
      await this.supa.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) throw new Error(error.message);
    return data as AuthenticatorAssuranceLevelResponse;
  }

  async listMfaFactors(): Promise<Factor[]> {
    const { data, error } = await this.supa.supabase.auth.mfa.listFactors();
    if (error) throw new Error(error.message);
    return [...(data.totp ?? []), ...(data.phone ?? [])];
  }

  async hasVerifiedTotpFactor(): Promise<boolean> {
    const factors = await this.listMfaFactors();
    return factors.some(f => f.factor_type === 'totp' && f.status === 'verified');
  }

  async enrollTotp(displayName = 'Authenticator App'): Promise<MfaEnrollResult> {
    const { data, error } = await this.supa.supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: displayName,
    });
    if (error) throw new Error(error.message);
    return {
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    };
  }

  async verifyTotpEnrollment(factorId: string, code: string) {
    const { data: challengeData, error: challengeError } =
      await this.supa.supabase.auth.mfa.challenge({ factorId });

    if (challengeError) throw new Error(challengeError.message);

    const { data, error } = await this.supa.supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: code.trim(),
    });

    if (error) throw new Error('Código MFA inválido.');

    const { data: sessionData } = await this.supa.supabase.auth.getSession();
    this.session$.next(sessionData.session ?? null);
    await this.refreshFromSession(sessionData.session ?? null);
    return data;
  }

  async verifyTotpLogin(code: string) {
    const factors = await this.listMfaFactors();
    const factor = factors.find(f => f.factor_type === 'totp' && f.status === 'verified');

    if (!factor) throw new Error('No hay un factor TOTP verificado.');

    const { data, error } = await this.supa.supabase.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code: code.trim(),
    });

    if (error) throw new Error('Código MFA inválido.');

    const { data: sessionData } = await this.supa.supabase.auth.getSession();
    this.session$.next(sessionData.session ?? null);
    await this.refreshFromSession(sessionData.session ?? null);
    return data;
  }

  async unenrollFactor(factorId: string) {
    const { error } = await this.supa.supabase.auth.mfa.unenroll({ factorId });
    if (error) throw new Error(error.message);
  }

  private async refreshFromSession(session: Session | null) {
    const uid = session?.user?.id ?? null;
    if (!uid) {
      this.role$.next('reader');
      this.profile$.next(null);
      return;
    }

    const { data, error } = await this.supa.supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, is_active, role')
      .eq('id', uid)
      .maybeSingle();

    if (error || !data) {
      this.role$.next('reader');
      this.profile$.next(null);
      return;
    }

    const profile = (data as unknown) as Profile;
    this.profile$.next(profile);
    this.role$.next(profile.role ?? 'reader');
  }

  private mapAuthError(message: string): string {
    const msg = (message || '').toLowerCase();
    if (msg.includes('email not confirmed')) return 'Confirma tu correo.';
    if (msg.includes('invalid credentials')) return 'Credenciales incorrectas.';
    if (msg.includes('already registered')) return 'El correo ya existe.';
    return message || 'Error de autenticación.';
  }
}