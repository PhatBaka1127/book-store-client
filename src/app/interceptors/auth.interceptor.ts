import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../services/toast.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isRefreshing
        ) {
          this.isRefreshing = true;

          return this.authService.refreshAccessToken().pipe(
            switchMap((newToken) => {
              this.isRefreshing = false;

              const cloned = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${newToken}`),
              });
              return next.handle(cloned);
            }),
            catchError((err) => {
              this.isRefreshing = false;
              this.authService.logout();
              this.toastService.showMessage("Phiên đăng nhập đã hết hạn", false);
              this.router.navigate(["/login"]);
              return throwError(() => err);
            })
          );
        }

        // Nếu refresh token cũng hết hạn hoặc lỗi khác
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.logout();
          this.toastService.showMessage("Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại", false);
          this.router.navigate(["/login"]);
        }

        return throwError(() => error);
      })
    );
  }
}
