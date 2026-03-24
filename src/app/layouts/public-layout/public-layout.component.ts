import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../shared/ui/navbar/navbar.component";
import { FooterComponent } from "../../shared/ui/footer/footer.component";

@Component({
  selector: "lagun-public-layout",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen bg-[#05010A] text-white relative overflow-hidden">

      <div class="pointer-events-none absolute inset-0
      bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.08),transparent_28%),
           radial-gradient(circle_at_top_right,rgba(255,44,223,0.08),transparent_28%),
           radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.06),transparent_30%)]">
      </div>

      <app-navbar></app-navbar>

      <main class="relative min-h-screen pt-20">
        <router-outlet></router-outlet>
      </main>

      <lagun-footer></lagun-footer>

    </div>
  `,
})
export class PublicLayoutComponent {}