import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { CartComponent } from "./pages/cart/cart.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { OrderHistoryComponent } from "./pages/order-history/order-history.component";
import { OrderDetailComponent } from "./pages/order-detail/order-detail.component";
import { DashboardComponent } from "./pages/order-dashboard/order-dashboard.component";
import { BookManagementComponent } from "./pages/book-management/book-management.component";
import { AuthGuard } from "./guards/auth.guard";
import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

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
