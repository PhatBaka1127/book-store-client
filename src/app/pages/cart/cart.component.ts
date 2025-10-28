import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    const cartCookie = this.cookieService.get('cart');
    if (cartCookie) {
      try {
        this.cartItems = JSON.parse(cartCookie);
      } catch {
        this.cartItems = [];
      }
    }

    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.cookieService.set('cart', JSON.stringify(this.cartItems), undefined, '/');
    this.calculateTotal();
  }

  clearCart(): void {
    this.cartItems = [];
    this.cookieService.delete('cart', '/');
    this.total = 0;
  }
}