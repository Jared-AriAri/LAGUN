import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../shared/ui/navbar/navbar.component";
import { FooterComponent } from "../../shared/ui/footer/footer.component";

@Component({
  selector: "lagun-public-layout",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <lagun-navbar />
    <main class="min-h-screen bg-[#05010A] text-white">
      <router-outlet />
    </main>
    <lagun-footer />
  `,
})
export class PublicLayoutComponent {}
