import { Routes } from "@angular/router";
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component";
import { AdminGuard } from "./core/auth/admin.guard";

export const routes: Routes = [
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      { 
        path: "", 
        loadComponent: () => 
          import("./features/landing/pages/landing.page").then((m) => m.LandingPage) 
      },
      { 
        path: "news", 
        loadComponent: () => 
          import("./features/news/pages/news-list.page").then((m) => m.NewsListPage) 
      },
      { 
        path: "reviews", 
        loadComponent: () => 
          import("./features/reviews/pages/reviews-list.page").then((m) => m.ReviewsListPage) 
      },
      { 
        path: "login", 
        loadComponent: () => 
          import("./features/auth/pages/login.page").then((m) => m.LoginPage) 
      },

      {
        path: "terminos",
        loadComponent: () =>
          import("./features/legal/pages/terms.page").then((m) => m.TermsPage),
      },
      {
        path: "privacidad",
        loadComponent: () =>
          import("./features/legal/pages/privacy.page").then((m) => m.PrivacyPage),
      },

      {
        path: "admin",
        canActivate: [AdminGuard],
        loadComponent: () =>
          import("./features/admin/dashboard/admin-dashboard.page")
            .then((m) => m.AdminDashboardPage),
      },
    ],
  },
  { path: "**", redirectTo: "" },
];
