import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.scss'],
})
export class CreateBookComponent {
  bookForm: FormGroup;
  imageFile: File | null = null;
  loading = false;
  errorMessage = '';
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      unitPrice: [0, Validators.required],
      stock: [0, Validators.required],
      status: [1, Validators.required],
      categoryId: [1, Validators.required],
      image: [null],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.imageFile = file;
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.errorMessage = 'Please input all information';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const data = { ...this.bookForm.value, image: this.imageFile };

    this.bookService.createBook(data).subscribe({
      next: (res) => {
        console.log('✅ Create book successfully:', res);
        alert('Create book successfully!');
        this.router.navigate(['/home']); // quay lại danh sách sách
      },
      error: (err) => {
        console.error('❌ Something went wrong:', err);
        this.errorMessage = err.error?.message || 'Something went wrong';
        this.loading = false;
      },
    });
  }

  ngOnInit(): void {
    // Load category từ backend
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        console.log('Categories:', res); // 🔥 debug
        this.categories = res;
      },
      error: (err) => console.error('❌ Fail in loading category:', err),
    });
  }
}
