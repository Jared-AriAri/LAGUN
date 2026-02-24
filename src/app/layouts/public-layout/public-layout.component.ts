import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../shared/ui/navbar/navbar.component";
import { FooterComponent } from "../../shared/ui/footer/footer.component";

@Component({
  selector: "lagun-public-layout",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
  <app-navbar></app-navbar>

    <main class="min-h-screen bg-[#05010A] text-white pt-20">
      <router-outlet></router-outlet>
    </main>

    <lagun-footer></lagun-footer>
  `,
})
export class PublicLayoutComponent {}
