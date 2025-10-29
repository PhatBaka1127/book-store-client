import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BookService, Book } from "../../services/book.service";
import { CookieService } from "ngx-cookie-service";
import { Category, CategoryService } from "src/app/services/category.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  userRole: number | null = null;
  currentPage = 1;
  totalPages = 1;
  pageSize = 9;
  totalItems = 0;
  categories: Category[] = [];
  filter = { name: "", categoryId: "" };

  constructor(
    private bookService: BookService,
    private router: Router,
    private cookieService: CookieService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Lấy user role từ cookie
    const userCookie = this.cookieService.get("user");
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        this.userRole = user.role;
      } catch (err) {
        console.error("Fail in parsing user cookie:", err);
      }
    }

    this.loadCategories();
    this.loadBooks();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        // Sau khi có category mới load sách
        this.loadBooks();
      },
      error: (err) => {
        console.error("❌ Failed to load categories:", err);
        // Dù lỗi cũng vẫn load sách
        this.loadBooks();
      },
    });
  }

  loadBooks(page: number = 1): void {
    this.loading = true;

    this.bookService
      .getBooks(page, this.pageSize, this.filter.name, this.filter.categoryId)
      .subscribe({
        next: (res) => {
          this.books = res.results;
          this.currentPage = res.metaData.page;
          this.pageSize = res.metaData.size;
          this.totalItems = res.metaData.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadBooks(page);
  }

  goToCreateBook() {
    this.router.navigate(["/create-book"]);
  }

  goToDetail(bookId: number) {
    this.router.navigate(["/book", bookId]);
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadBooks();
  }
}
