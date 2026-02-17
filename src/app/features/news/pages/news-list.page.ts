import { Component } from "@angular/core";
import { NgFor } from "@angular/common";

type NewsItem = {
  title: string;
  summary: string;
  dateLabel: string;
  imageUrl: string;
  newsUrl: string;
  buyUrl: string;
  buyLabel: string;
};

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <section class="max-w-7xl mx-auto px-6 py-16 text-white">
      <div class="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 class="text-4xl font-extrabold
            bg-gradient-to-r from-[#00E5FF] via-[#FF2CDF] to-[#7C3AED]
            bg-clip-text text-transparent">
            Noticias 2026
          </h2>
          <p class="text-white/60 mt-2">
            4 noticias recientes del mundo gamer con link directo para comprar/precomprar.
          </p>
        </div>

        <div class="text-xs uppercase tracking-widest text-white/50">
          LAGUN • News
        </div>
      </div>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <article
          *ngFor="let n of news"
          class="rounded-2xl bg-black/40 backdrop-blur border border-white/10 overflow-hidden
                 hover:border-white/20 transition group"
        >
          <div class="relative">
            <img
              [src]="n.imageUrl"
              [alt]="n.title"
              class="w-full h-44 object-cover"
              loading="lazy"
            />
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 rounded-full text-[11px] font-semibold
                           bg-black/60 border border-white/10 text-white/90">
                {{ n.dateLabel }}
              </span>
            </div>
          </div>

          <div class="p-4 space-y-3">
            <h3 class="font-bold leading-snug">
              {{ n.title }}
            </h3>

            <p class="text-sm text-white/60 leading-relaxed">
              {{ n.summary }}
            </p>

            <div class="pt-2 flex items-center gap-3">
              <a
                [href]="n.newsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-semibold text-white/80 hover:text-white transition
                       underline decoration-white/20 hover:decoration-white/60"
              >
                Leer noticia
              </a>

              <a
                [href]="n.buyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="ml-auto inline-flex items-center justify-center
                       px-4 py-2 text-sm font-semibold rounded-full text-white
                       bg-gradient-to-r from-[#FF2CDF] to-[#7C3AED]
                       shadow-[0_0_24px_rgba(255,44,223,0.25)]
                       hover:scale-[1.03] active:scale-[0.99] transition"
              >
                {{ n.buyLabel }}
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class NewsListPage {
  readonly news: NewsItem[] = [
    {
      title: "Resident Evil Requiem confirma fecha y ya permite precompra (Feb 2026)",
      summary:
        "Nuevas mejoras técnicas en PC (DLSS/RT en el ecosistema RTX) y ventana de lanzamiento confirmada para finales de febrero.",
      dateLabel: "Ene 2026",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/3764200/header.jpg",
      newsUrl: "https://www.nvidia.com/en-us/geforce/news/dlss-4-rtx-path-tracing-game-announcements-ces-2026/",
      buyUrl: "https://store.steampowered.com/app/3764200/Resident_Evil_Requiem/?l=latam",
      buyLabel: "Precomprar",
    },
    {
      title: "PRAGMATA ya tiene fecha (Abril 2026) y precompra activa",
      summary:
        "Capcom vuelve con sci-fi de alto perfil: fecha de salida anunciada y páginas de tienda listas para pre-order.",
      dateLabel: "Ene 2026",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/3357650/header.jpg",
      newsUrl: "https://www.capcom-games.com/pragmata/en-us/",
      buyUrl: "https://store.steampowered.com/app/3357650/PRAGMATA/",
      buyLabel: "Precomprar",
    },
    {
      title: "007 First Light: IO Interactive abre precompra para 2026",
      summary:
        "Nuevo juego narrativo de acción/espionaje con Bond joven. Ya puedes apartarlo en PC.",
      dateLabel: "Ene 2026",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/3768760/header.jpg",
      newsUrl: "https://ioi.dk/007firstlightgame",
      buyUrl: "https://store.steampowered.com/app/3768760/007_First_Light/",
      buyLabel: "Precomprar",
    },
    {
      title: "Phantom Blade Zero anuncia ventana 2026 (acción estilo wuxia)",
      summary:
        "Nuevo material y fecha objetivo para 2026; título muy esperado por fans de acción rápida.",
      dateLabel: "Ene 2026",
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/4115450/header.jpg",
      newsUrl: "https://www.nvidia.com/en-us/geforce/news/dlss-4-rtx-path-tracing-game-announcements-ces-2026/",
      buyUrl: "https://store.steampowered.com/app/4115450/Phantom_Blade_Zero/",
      buyLabel: "Wishlist",
    },
  ];
}
