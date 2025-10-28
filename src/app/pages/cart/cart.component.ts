import { Component, OnInit } from '@angular/core';
import { CreateOrderDTO, OrderService } from 'src/app/services/order.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  phoneNumber = '';
  address = '';
  userId: number | null = null;

  constructor(
    private orderService: OrderService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🧠 Lấy thông tin user từ cookie (nếu có)
    const userCookie = this.cookieService.get('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        this.userId = user.id;
      } catch {
        console.warn('⚠️ Cookie user bị lỗi định dạng');
      }
    }

    const cartCookie = this.cookieService.get('cart');
    if (cartCookie) {
      try {
        this.cartItems = JSON.parse(cartCookie);
      } catch {
        this.cartItems = [];
        console.warn('⚠️ Cookie cart bị lỗi định dạng');
      }
    }

    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  updateCartCookie() {
    this.cookieService.set(
      'cart',
      JSON.stringify(this.cartItems),
      undefined,
      '/'
    );
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.updateCartCookie();
    this.calculateTotal();
  }

  clearCart() {
    this.cartItems = [];
    this.cookieService.delete('cart', '/');
    this.calculateTotal();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}