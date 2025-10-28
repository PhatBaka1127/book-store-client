import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  userRole: number | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Lấy user role từ cookie
    const userCookie = this.cookieService.get('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        this.userRole = user.role;
      } catch (err) {
        console.error('Fail in parsing user cookie:', err);
      }
    }

    // Load books
    this.bookService.getBooks().subscribe({
      next: res => {
        this.books = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToCreateBook() {
    this.router.navigate(['/create-book']);
  }

  goToDetail(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }
}
