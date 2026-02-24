import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SupabaseService } from '../../services/supabase.service';

export type AppRole = 'reader' | 'writer' | 'editor' | 'admin';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  role: AppRole;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private session$ = new BehaviorSubject<Session | null>(null);
  private role$ = new BehaviorSubject<AppRole>('reader');
  private profile$ = new BehaviorSubject<Profile | null>(null);

  constructor(private supa: SupabaseService) {
    this.bootstrap();
  }

  sessionSnapshot(): Session | null {
    return this.session$.value;
  }

  isLoggedInSnapshot(): boolean {
    return !!this.session$.value?.user?.id;
  }

  roleSnapshot(): AppRole {
    return this.role$.value;
  }

  profileSnapshot(): Profile | null {
    return this.profile$.value;
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

  private async bootstrap() {
    const { data } = await this.supa.supabase.auth.getSession();
    this.session$.next(data.session ?? null);

    await this.refreshFromSession(data.session ?? null);

    this.supa.supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        this.session$.next(session);
        await this.refreshFromSession(session);
      }
    );
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supa.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    this.session$.next(data.session ?? null);
    await this.refreshFromSession(data.session ?? null);
    return data;
  }

  async signOut() {
    const { error } = await this.supa.supabase.auth.signOut();
    if (error) throw error;

    this.session$.next(null);
    this.role$.next('reader');
    this.profile$.next(null);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data } = await this.supa.supabase.auth.getSession();
    return !!data.session?.user?.id;
  }

  async refreshRole() {
    await this.refreshFromSession(this.sessionSnapshot());
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

    const profile = data as Profile;
    this.profile$.next(profile);
    this.role$.next((profile.role as AppRole) ?? 'reader');
  }
}
