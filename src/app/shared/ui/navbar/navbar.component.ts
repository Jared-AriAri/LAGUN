import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, Profile } from '../../../core/auth/auth.service';

type NavLink = {
  label: string;
  path: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  ready = false;
  loggedIn = false;
  profile: Profile | null = null;

  links: NavLink[] = [
    { label: 'Noticias', path: '/news' },
    { label: 'Reseñas', path: '/reviews' },
  ];

  private sub = new Subscription();
  private mobile = false;
  profileMenuOpen = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.ready = this.auth.isReadySnapshot();
    this.loggedIn = this.auth.isLoggedInSnapshot();
    this.profile = this.auth.profileSnapshot();

    this.sub.add(
      this.auth.readyChanges().subscribe((ready) => {
        this.ready = ready;
      })
    );

    this.sub.add(
      this.auth.sessionChanges().subscribe((session) => {
        this.loggedIn = !!session?.user?.id;
        if (!this.loggedIn) {
          this.profileMenuOpen = false;
        }
      })
    );

    this.sub.add(
      this.auth.profileChanges().subscribe((profile) => {
        this.profile = profile;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('document:click')
  closeProfileMenuFromOutside() {
    if (this.profileMenuOpen) {
      this.profileMenuOpen = false;
    }
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

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(event?: MouseEvent) {
    event?.stopPropagation();
    this.profileMenuOpen = false;
  }

  goToUser(event?: MouseEvent) {
    event?.stopPropagation();
    this.profileMenuOpen = false;
    this.closeMobile();
    this.router.navigate(['/mi-cuenta']);
  }

  goToSecurity(event?: MouseEvent) {
    event?.stopPropagation();
    this.profileMenuOpen = false;
    this.closeMobile();
    this.router.navigate(['/security']);
  }

  goToWriterPanel(event?: MouseEvent) {
    event?.stopPropagation();
    this.profileMenuOpen = false;
    this.closeMobile();
    this.router.navigate(['/writer']);
  }

  goToAdminPanel(event?: MouseEvent) {
    event?.stopPropagation();
    this.profileMenuOpen = false;
    this.closeMobile();
    this.router.navigate(['/admin']);
  }

  goToReviewsPanel(event?: MouseEvent) {
    event?.stopPropagation();
    this.profileMenuOpen = false;
    this.closeMobile();
    this.router.navigate(['/reviews-panel']);
  }

  async logout() {
    await this.auth.signOut();
    this.profileMenuOpen = false;
    this.closeMobile();
    this.router.navigate(['/']);
  }

  get initial(): string {
    const name = this.profile?.full_name?.trim();
    return (name?.[0] || 'U').toUpperCase();
  }

  get role(): 'reader' | 'writer' | 'admin' {
    const role = this.profile?.role;
    if (role === 'writer' || role === 'admin') return role;
    return 'reader';
  }

  get canSeeWriterPanel(): boolean {
    return this.role === 'writer';
  }

  get canSeeAdminPanel(): boolean {
    return this.role === 'admin';
  }

  get canSeeReviewsPanel(): boolean {
    return this.role === 'writer' || this.role === 'admin';
  }
}