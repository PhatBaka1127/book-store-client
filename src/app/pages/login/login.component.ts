import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastService.showMessage(
        "Please input all information",
        false,
        4000
      );
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log("Login success:", res);
        this.toastService.showMessage(res.message, !!res.result, 2000);
        const value = res?.value;
        if (value.accessToken) {
          this.cookieService.set("token", value.accessToken, undefined, "/");
        }

        if (value) {
          this.cookieService.set(
            "user",
            JSON.stringify({
              id: value.id,
              email: value.email,
              role: value.role,
            }),
            undefined,
            "/"
          );
        }

        if (value.role === 1) {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/home"]);
        }
        this.loading = false;
      },
      error: (res) => {
        console.error("Login failed:", res);
        this.toastService.showMessage(res.error.message, !!res.error.result, 2000);
        this.loading = false;
      },
    });
  }
}
