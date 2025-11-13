import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./features/auth/pages/login/login.component";
import { RegisterComponent } from "./features/auth/pages/register/register.component";
import { HomeComponent } from "./core/layouts/home/home.component";
import { ProductDetailComponent } from "./core/layouts/product-detail/product-detail.component";
import { CartComponent } from "./core/layouts/cart/cart.component";
import { CheckoutComponent } from "./core/layouts/checkout/checkout.component";
import { OrderHistoryComponent } from "./core/layouts/order-history/order-history.component";
import { OrderDetailComponent } from "./core/layouts/order-detail/order-detail.component";
import { DashboardComponent } from "./core/layouts/order-dashboard/order-dashboard.component";
import { BookManagementComponent } from "./core/layouts/book-management/book-management.component";
import { AuthGuard } from "./guards/auth.guard";
import { ForbiddenComponent } from "./core/layouts/forbidden/forbidden.component";
import { NotFoundComponent } from "./core/layouts/not-found/not-found.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },

  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "not-found", component: NotFoundComponent},

  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "home", component: HomeComponent },
      { path: "book/:id", component: ProductDetailComponent },
      { path: "cart", component: CartComponent },
      { path: "checkout", component: CheckoutComponent },
      { path: "order-history", component: OrderHistoryComponent },
      { path: "order/:id", component: OrderDetailComponent },
      { path: "dashboard", component: DashboardComponent },
      { path: "book-management", component: BookManagementComponent },
    ],
  },

  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
