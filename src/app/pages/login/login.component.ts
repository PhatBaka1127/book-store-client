import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('✅ Login success:', res);
        alert('Đăng nhập thành công!');

        // Lưu token và user info vào cookie
        if (res?.accessToken) {
          this.cookieService.set('token', res.accessToken, undefined, '/');
        }

        if (res) {
          this.cookieService.set('user', JSON.stringify({
            id: res.id,
            email: res.email,
            role: res.role
          }), undefined, '/');
        }

        this.router.navigate(['/home']);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        this.errorMessage = err.error?.message || 'Sai tài khoản hoặc mật khẩu';
        this.loading = false;
      }
    });
  }
}