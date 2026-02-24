import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, Profile } from '../../../core/auth/auth.service';

type NavLink = { label: string; path: string };

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  links: NavLink[] = [
    { label: 'Noticias', path: '/news' },
    { label: 'Reseñas', path: '/reviews' },
    { label: 'Lanzamientos', path: '/news' },
    { label: 'Trailers', path: '/news' },
    { label: 'Contacto', path: '/' },
  ];

  loggedIn = false;
  profile: Profile | null = null;

  private sub = new Subscription();
  private mobile = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedInSnapshot();
    this.profile = this.auth.profileSnapshot();

    this.sub.add(
      this.auth.sessionChanges().subscribe((s) => {
        this.loggedIn = !!s?.user?.id;
      })
    );

    this.sub.add(
      this.auth.profileChanges().subscribe((p) => {
        this.profile = p;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  mobileOpen(): boolean {
    return this.mobile;
  }

  toggleMobile(): void {
    this.mobile = !this.mobile;
  }

  closeMobile(): void {
    this.mobile = false;
  }

  goLogin() {
    this.closeMobile();
    this.router.navigate(['/login']);
  }

  async logout() {
    await this.auth.signOut();
    this.closeMobile();
    this.router.navigate(['/']);
  }

  get initial(): string {
    const name = this.profile?.full_name?.trim();
    return (name?.[0] || 'U').toUpperCase();
  }

  get isAdmin(): boolean {
    return this.profile?.role === 'admin';
  }

  get isEditorOrAdmin(): boolean {
    return this.profile?.role === 'editor' || this.profile?.role === 'admin';
  }
}
