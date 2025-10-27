import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any = null;

  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    const userCookie = this.cookieService.get('user');
    if (userCookie) {
      try {
        this.user = JSON.parse(userCookie);
      } catch {
        this.user = null;
      }
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.cookieService.delete('token');
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
  }
}
