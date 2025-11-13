import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service"; // đường dẫn của bạn có thể khác
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }

  goToCart(): void {
    this.router.navigate(["/cart"]);
  }

  goToHistory(): void {
    this.router.navigate(["/order-history"]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.toastService.showMessage(`Logout successfully`, true, 2000);
  }

  goToBookManagement() {
    this.router.navigate(["/book-management"]);
  }
}
