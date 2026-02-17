import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10 text-white">
      <h2 class="text-3xl font-bold">Admin Dashboard</h2>
      <p class="text-white/60 mt-2">CRUD de noticias y reseñas (solo admin).</p>
    </div>
  `,
})
export class AdminDashboardPage {}
