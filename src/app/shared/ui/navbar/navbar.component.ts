import { Component, computed, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf, NgFor } from "@angular/common";
import { NAV_LINKS } from "../../constants/nav-links";

@Component({
  selector: "lagun-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor],
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  readonly links = NAV_LINKS;

  private readonly _mobileOpen = signal(false);
  readonly mobileOpen = computed(() => this._mobileOpen());

  toggleMobile() {
    this._mobileOpen.update(v => !v);
  }

  closeMobile() {
    this._mobileOpen.set(false);
  }
}
