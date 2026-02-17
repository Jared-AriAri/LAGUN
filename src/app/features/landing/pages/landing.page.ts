import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <section class="min-h-[calc(100vh-72px)] bg-[#05010A] text-white flex items-center">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-widest uppercase
          bg-gradient-to-r from-[#00E5FF] via-[#FF2CDF] to-[#7C3AED]
          bg-clip-text text-transparent">
          LAGUN
        </h1>
        <p class="mt-4 text-white/70 max-w-xl">
          Noticias y reseñas de videojuegos con estética neón premium.
        </p>
      </div>
    </section>
  `,
})
export class LandingPage {}
