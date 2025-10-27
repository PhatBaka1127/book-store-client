import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
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
        
        if (res?.token) {
          localStorage.setItem('token', res.token);
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
