import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { CreateBookComponent } from './pages/create-book/create-book.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './pages/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { DashboardComponent } from './pages/order-dashboard/order-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { BookManagementComponent } from './pages/book-management/book-management.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CreateBookComponent,
    RegisterComponent,
    ProductDetailComponent,
    NavbarComponent,
    CartComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    OrderDetailComponent,
    DashboardComponent,
    BookManagementComponent
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
