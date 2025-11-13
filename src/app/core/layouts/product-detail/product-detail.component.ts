import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  book: Book | null = null;
  userRole: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cookieService: CookieService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const userCookie = this.cookieService.get('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        this.userRole = user.role;
      } catch {}
    }

    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookById(bookId).subscribe({
      next: (res) => (this.book = res),
      error: (err) => console.error(err),
    });
  }

  addToCart() {
    if (this.book) {
      const cartCookie = this.cookieService.get('cart');
      let cart: Book[] = [];

      if (cartCookie) {
        try {
          cart = JSON.parse(cartCookie);
        } catch {
          cart = [];
        }
      }

      const existing = cart.find((b: any) => b.id === this.book!.id);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        this.toastService.showMessage(`Increased quantity to ${existing.quantity}`, true, 2000);
      } else {
        cart.push({ ...this.book, quantity: 1 });
        this.toastService.showMessage(`Added to cart!`, true, 2000);
      }

      this.cookieService.set('cart', JSON.stringify(cart), undefined, '/');
    }
  }
}
