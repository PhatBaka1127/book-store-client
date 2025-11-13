import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastService: ToastService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [1, Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastService.showMessage("Please input all field", false, 2000);
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log('Register successfully', res);
        this.toastService.showMessage(res.message, res.result, 2000);
        this.router.navigate(['/login']);
      },
      error: (res) => {
        console.error('Something went wrong', res);
        this.toastService.showMessage(res.error.message, res.error.result, 2000);
        this.loading = false;
      }
    });
  }
}