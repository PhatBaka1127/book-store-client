import { Component, OnInit } from '@angular/core';
import { CreateOrderDTO, OrderService } from 'src/app/services/order.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  phoneNumber = '';
  address = '';
  userId: number | null = null;

  constructor(
    private orderService: OrderService,
    private cookieService: CookieService
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

    // 🧠 Lấy giỏ hàng từ cookie
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
    this.cookieService.set('cart', JSON.stringify(this.cartItems), undefined, '/');
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

  checkout() {
    if (!this.phoneNumber || !this.address) {
      alert('⚠️ Vui lòng nhập đầy đủ thông tin đặt hàng!');
      return;
    }

    if (!this.userId) {
      alert('⚠️ Bạn cần đăng nhập trước khi đặt hàng!');
      return;
    }

    const orderPayload: CreateOrderDTO = {
      phoneNumber: this.phoneNumber,
      address: this.address,
      createOrderDetailDTOs: this.cartItems.map(item => ({
        bookId: item.id, // vì bên ProductDetail dùng book.id
        quantity: item.quantity
      }))
    };

    console.log('📦 Payload gửi đến API:', orderPayload);

    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        alert('✅ Đặt hàng thành công!');
        this.clearCart();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Có lỗi xảy ra khi đặt hàng!');
      }
    });
  }
}