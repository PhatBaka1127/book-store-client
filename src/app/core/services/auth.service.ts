import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, throwError, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const userCookie = this.cookieService.get('user');
    if (userCookie) {
      try {
        this.userSubject.next(JSON.parse(userCookie));
      } catch {
        this.userSubject.next(null);
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        const value = res.value;
        this.cookieService.set('token', value.accessToken, undefined, '/');
        this.cookieService.set('refreshToken', value.refreshToken, undefined, '/');
        this.cookieService.set(
          'user',
          JSON.stringify({
            id: value.id,
            email: value.email,
            role: value.role,
          }),
          undefined,
          '/'
        );
        this.userSubject.next({
          id: value.id,
          email: value.email,
          role: value.role,
        });
      })
    );
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.cookieService.get('refreshToken');
    if (!refreshToken) return throwError(() => new Error('Missing refresh token'));

    return this.http
      .post<{ value: any }>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          const value = res.value;
          this.cookieService.set('token', value.accessToken, undefined, '/');
          this.cookieService.set('refreshToken', value.refreshToken, undefined, '/');
        }),
        switchMap((res) => [res.value.accessToken])
      );
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  getRefreshToken(): string {
    return this.cookieService.get('refreshToken');
  }

  logout(): void {
    this.cookieService.delete('cart', '/');
    this.cookieService.delete('token', '/');
    this.cookieService.delete('refreshToken', '/');
    this.cookieService.delete('user', '/');
    this.userSubject.next(null);
  }

  register(data: { email: string; password: string; role: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
}