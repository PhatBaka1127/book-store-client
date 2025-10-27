import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [1, Validators.required] // mặc định role=1
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log('✅ Đăng ký thành công', res);
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Lỗi đăng ký', err);
        this.errorMessage = err.error?.message || 'Đăng ký thất bại';
        this.loading = false;
      }
    });
  }
}