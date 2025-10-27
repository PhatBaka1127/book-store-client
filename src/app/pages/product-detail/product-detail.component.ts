import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  book: Book | null = null;
  userRole: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cookieService: CookieService
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
      next: res => this.book = res,
      error: err => console.error(err)
    });
  }

  addToCart() {
    if (this.book) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!cart.find((b: Book) => b.id === this.book!.id)) {
        cart.push(this.book);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm vào giỏ hàng!');
      } else {
        alert('Sách đã có trong giỏ hàng!');
      }
    }
  }
}
