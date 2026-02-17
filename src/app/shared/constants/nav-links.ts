export type NavLink = {
  label: string;
  path: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Noticias", path: "/news" },
  { label: "Reseñas", path: "/reviews" },
  { label: "Lanzamientos", path: "/releases" },
  { label: "Trailers", path: "/trailers" },
];
