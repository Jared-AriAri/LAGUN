import { Routes } from "@angular/router";
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component";

export const routes: Routes = [
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      { path: "", loadComponent: () => import("./features/landing/pages/landing.page").then(m => m.LandingPage) },
      { path: "news", loadComponent: () => import("./features/news/pages/news-list.page").then(m => m.NewsListPage) },
      { path: "reviews", loadComponent: () => import("./features/reviews/pages/reviews-list.page").then(m => m.ReviewsListPage) },
      { path: "login", loadComponent: () => import("./features/auth/pages/login.page").then(m => m.LoginPage) },
      { path: "admin", loadComponent: () => import("./features/admin/dashboard/admin-dashboard.page").then(m => m.AdminDashboardPage) },
    ],
  },
  { path: "**", redirectTo: "" },
];
