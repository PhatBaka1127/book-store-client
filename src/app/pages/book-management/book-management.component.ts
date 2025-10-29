import { Component, OnInit } from "@angular/core";
import { Book, BookService } from "src/app/services/book.service";
import { Category, CategoryService } from "src/app/services/category.service";

@Component({
  selector: "app-book-management",
  templateUrl: "./book-management.component.html",
  styleUrls: ["./book-management.component.scss"],
})
export class BookManagementComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error: string | null = null;
  categories: Category[] = [];

  // pagination
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  totalItems = 0;

  // form tạm để thêm/sửa
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
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error("Lỗi tải categories:", err),
    });
  }

  loadBooks(page: number = 1): void {
    this.loading = true;
    this.error = null;

    this.bookService.getBooks(page, this.pageSize).subscribe({
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
        this.error = "Cannot load book list.";
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
      this.bookService.updateBook(this.editingBook.id, this.formData).subscribe({
        next: () => {
          alert("✅ Book updated successfully");
          this.showForm = false;
          this.loadBooks(this.currentPage); // reload current page
        },
        error: (err) => {
          console.error(err);
          alert("❌ Failed to update book");
        },
      });
    } else {
      this.bookService.createBook(this.formData).subscribe({
        next: () => {
          alert("✅ Book added successfully");
          this.showForm = false;
          this.loadBooks(this.currentPage);
        },
        error: (err) => {
          console.error(err);
          alert("❌ Failed to add book");
        },
      });
    }
  }

  deleteBook(bookId: number): void {
    if (!confirm("Are you sure you want to delete this book?")) return;

    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        alert("✅ Book deleted");
        this.loadBooks(this.currentPage);
      },
      error: (err) => {
        console.error(err);
        alert("❌ Failed to delete book");
      },
    });
  }
}
