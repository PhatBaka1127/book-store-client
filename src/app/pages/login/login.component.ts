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
      this.errorMessage = 'Please input all information';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login success:', res);
        const value = res?.value;
        if (value.accessToken) {
          this.cookieService.set('token', value.accessToken, undefined, '/');
        }

        if (value) {
          this.cookieService.set('user', JSON.stringify({
            id: value.id,
            email: value.email,
            role: value.role
          }), undefined, '/');
        }

        if (value.role === 1) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        this.errorMessage = err.error?.message || 'Wrong login credential';
        this.loading = false;
      }
    });
  }
}