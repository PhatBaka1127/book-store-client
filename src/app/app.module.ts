import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './core/layouts/home/home.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ProductDetailComponent } from './core/layouts/product-detail/product-detail.component';
import { NavbarComponent } from './core/layouts/navbar/navbar.component';
import { CartComponent } from './core/layouts/cart/cart.component';
import { CheckoutComponent } from './core/layouts/checkout/checkout.component';
import { OrderHistoryComponent } from './core/layouts/order-history/order-history.component';
import { OrderDetailComponent } from './core/layouts/order-detail/order-detail.component';
import { DashboardComponent } from './core/layouts/order-dashboard/order-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { BookManagementComponent } from './core/layouts/book-management/book-management.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ForbiddenComponent } from './core/layouts/forbidden/forbidden.component';
import { NotFoundComponent } from './core/layouts/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ProductDetailComponent,
    NavbarComponent,
    CartComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    OrderDetailComponent,
    DashboardComponent,
    BookManagementComponent,
    ToastComponent,
    ForbiddenComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
