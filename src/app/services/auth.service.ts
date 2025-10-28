import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
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
        this.cookieService.set('token', res.accessToken, undefined, '/');
        this.cookieService.set(
          'user',
          JSON.stringify({
            id: res.id,
            email: res.email,
            role: res.role,
          }),
          undefined,
          '/'
        );

        this.userSubject.next({
          id: res.id,
          email: res.email,
          role: res.role,
        });
      })
    );
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  logout(): void {
    this.cookieService.delete('cart', '/');
    this.cookieService.delete('token', '/');
    this.cookieService.delete('user', '/');
    this.userSubject.next(null);
  }

  register(data: {
    email: string;
    password: string;
    role: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
}
