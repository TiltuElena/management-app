import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router, Event, NavigationEnd } from '@angular/router';
import { PageRoutesInterface } from '../../shared/models';
import {AuthService} from "../../pages/auth/services/auth.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  routes: PageRoutesInterface[] = [
    {
      id: 0,
      title: 'Dashboard',
      link: '/',
      icon: 'dashboard',
    },
    {
      id: 1,
      title: 'Customers',
      link: '/customers',
      icon: 'group',
    },
    {
      id: 2,
      title: 'Employees',
      link: '/employees',
      icon: 'contact_mail',
    },
    {
      id: 3,
      title: 'Products',
      link: '/products',
      icon: 'fastfood',
    },
    {
      id: 4,
      title: 'Orders',
      link: '/orders',
      icon: 'receipt_long',
    },
    // {
    //   id: 5,
    //   title: 'Distributors',
    //   link: '/main/distributors',
    //   icon: 'engineering',
    // },
    {
      id: 5,
      title: 'Costs & Profits',
      link: '/costs&Profits',
      icon: 'paid',
    },
  ];

  currentRoute: string;
  private authTokenKey = 'auth-token';

  constructor(private router: Router, private authService: AuthService) {
    this.currentRoute = 'Dashboard';
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url.length > 1) {
        // this.currentRoute = event.url[1].toUpperCase() + event.url.slice(2)
        this.currentRoute = event.url.slice(1);
        this.currentRoute = this.currentRoute.slice(
          this.currentRoute.indexOf('/') + 1,
        );
        this.currentRoute =
          this.currentRoute[0].toUpperCase() + this.currentRoute.slice(1);
      }
    });
  }

  logout(){
    localStorage.removeItem(this.authTokenKey);
    this.authService.isAuthenticated.next(false);
    this.router.navigate(['/']).then();
  }
}
