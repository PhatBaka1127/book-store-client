import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        // Lưu token vào cookie
        this.cookieService.set('token', res.accessToken, undefined, '/'); // đường dẫn '/' để dùng toàn app
        // Lưu user info cũng có thể lưu cookie hoặc localStorage
        this.cookieService.set('user', JSON.stringify({
          id: res.id,
          email: res.email,
          role: res.role
        }), undefined, '/');
      })
    );
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  logout(): void {
    this.cookieService.delete('token', '/');
    this.cookieService.delete('user', '/');
  }
}