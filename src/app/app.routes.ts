import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard } from './components/auth-components/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AuthComponent,
  },
  {
    path: 'main',
    component: NavbarComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./pages/employees/employees.component').then(
            (m) => m.EmployeesComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/customers.component').then(
            (m) => m.CustomersComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products.component').then(
            (m) => m.ProductsComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/orders.component').then(
            (m) => m.OrdersComponent,
          ),
      },
      {
        path: 'distributors',
        loadComponent: () =>
          import('./pages/distributors/distributors.component').then(
            (m) => m.DistributorsComponent,
          ),
      },
      {
        path: 'costs&Profits',
        loadComponent: () =>
          import('./pages/costs/costs.component').then((m) => m.CostsComponent),
      },
    ],
  },
];
