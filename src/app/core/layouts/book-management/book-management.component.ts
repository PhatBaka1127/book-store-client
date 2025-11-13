import { Component, OnInit } from "@angular/core";
import { Book, BookService } from "src/app/services/book.service";
import { Category, CategoryService } from "src/app/services/category.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-book-management",
  templateUrl: "./book-management.component.html",
  styleUrls: ["./book-management.component.scss"],
})
export class BookManagementComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  categories: Category[] = [];
  filter = { name: "", categoryId: "" };

  currentPage = 1;
  totalPages = 1;
  pageSize = 5;
  totalItems = 0;

  showForm = false;
  editingBook: Book | null = null;
  formData: any = {
    name: "",
    description: "",
    unitPrice: 0,
    stock: 0,
    status: 1,
    categoryId: 1,
    image: null,
  };

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error("Error loading categories:", err),
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

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadBooks(page);
  }

  openForm(book?: Book): void {
    this.showForm = true;
    if (book) {
      this.editingBook = book;
      this.formData = { ...book };
    } else {
      this.editingBook = null;
      this.formData = {
        name: "",
        description: "",
        unitPrice: 0,
        stock: 0,
        status: 1,
        categoryId: 1,
        image: null,
      };
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.formData.image = file;
  }

  saveBook(): void {
    if (this.editingBook) {
      this.bookService
        .updateBook(this.editingBook.id, this.formData)
        .subscribe({
          next: (res) => {
            this.toastService.showMessage(res.message, true, 2000);
            this.showForm = false;
            this.loadBooks(this.currentPage);
          },
          error: (res) => {
            this.toastService.showMessage(res.error.message, true, 2000);
            console.error(res);
          },
        });
    } else {
      this.bookService.createBook(this.formData).subscribe({
        next: (res) => {
          this.toastService.showMessage(res.message, true, 2000);
          this.showForm = false;
          this.loadBooks(this.currentPage);
        },
        error: (res) => {
          console.error(res);
          this.toastService.showMessage(res.error.message, true, 2000);
        },
      });
    }
  }

  deleteBook(bookId: number): void {
    if (!confirm("Are you sure you want to delete this book?")) return;

    this.bookService.deleteBook(bookId).subscribe({
      next: (res) => {
        this.toastService.showMessage(res.message, true, 2000);
        this.loadBooks(this.currentPage);
      },
      error: (res) => {
        console.error(res);
        this.toastService.showMessage(res.error.message, true, 2000);
      },
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.loadBooks();
  }
}
