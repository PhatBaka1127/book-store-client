import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { OrderService, CreateOrderDTO } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;

  phoneNumber = '';
  address = '';

  constructor(
    private cookieService: CookieService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const cartCookie = this.cookieService.get('cart');
    this.cartItems = cartCookie ? JSON.parse(cartCookie) : [];
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  checkout() {
    if (!this.phoneNumber || !this.address) {
      alert('⚠️ Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const orderPayload: CreateOrderDTO = {
      phoneNumber: this.phoneNumber,
      address: this.address,
      createOrderDetailDTOs: this.cartItems.map((item) => ({
        bookId: item.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        alert('🎉 Đặt hàng thành công!');
        this.cookieService.delete('cart', '/');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Có lỗi xảy ra khi đặt hàng!');
      },
    });
  }
}