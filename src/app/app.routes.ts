import { Routes } from "@angular/router";
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component";
import { AdminGuard } from "./core/auth/admin.guard";
import { mfaGuard } from "./core/auth/mfa.guard";

export const routes: Routes = [
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/landing/pages/landing.page").then((m) => m.LandingPage),
      },
      {
        path: "news",
        loadComponent: () =>
          import("./features/news/pages/news-list.page").then((m) => m.NewsListPage),
      },
      {
        path: "news/:slug",
        loadComponent: () =>
          import("./features/news/pages/news-detail.page").then((m) => m.NewsDetailPage),
      },
      {
        path: "reviews",
        loadComponent: () =>
          import("./features/reviews/pages/reviews-list.page").then((m) => m.ReviewsListPage),
      },
      {
        path: "login",
        loadComponent: () =>
          import("./features/auth/pages/login.page").then((m) => m.LoginPage),
      },
      {
        path: "register",
        loadComponent: () =>
          import("./features/auth/pages/register.page").then((m) => m.RegisterPage),
      },
      {
        path: "confirm-email",
        loadComponent: () =>
          import("./features/auth/pages/confirm-email.page").then((m) => m.ConfirmEmailPage),
      },
      {
        path: "mfa/setup",
        canActivate: [mfaGuard],
        loadComponent: () =>
          import("./features/auth/pages/mfa-setup.page").then((m) => m.MfaSetupPage),
      },
      {
        path: "mfa/verify",
        loadComponent: () =>
          import("./features/auth/pages/mfa-verify.page").then((m) => m.MfaVerifyPage),
      },
      {
        path: "security",
        canActivate: [mfaGuard],
        loadComponent: () =>
          import("./features/auth/pages/security.page").then((m) => m.SecurityPage),
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
        canActivate: [AdminGuard, mfaGuard],
        loadComponent: () =>
          import("./features/admin/dashboard/admin-dashboard.page").then(
            (m) => m.AdminDashboardPage
          ),
      },
    ],
  },
  { path: "**", redirectTo: "" },
];