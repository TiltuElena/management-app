import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  url: string = 'http://localhost:8082';
  salaries$: BehaviorSubject<number> = new BehaviorSubject(0);
  ingredients$: BehaviorSubject<number> = new BehaviorSubject(0);
  revenue$: BehaviorSubject<number> = new BehaviorSubject(0);

  salaries: number = 0;
  ingredients: number = 0;
  revenue: number = 0;
  constructor(private httpClient: HttpClient) {}

  getOrders(): Observable<any> {
    return this.httpClient.get(`${this.url}/orders`);
  }

  getOrdersModified(): Observable<any> {
    return this.httpClient.get<any[]>(`${this.url}/orders`).pipe(
      switchMap((orders: any) => {
        // Map each order to fetch its product details and replace productId with name
        const orderObservables = orders.items.map((order: any) => {
          const productObservables = order.products.map((product: any) => {
            return this.getProduct(product.productId).pipe(
              map((productDetails: any) => ({
                ...product,
                name: productDetails.name
              }))
            );
          });
          // Combine product observables for each order
          return forkJoin(productObservables).pipe(
            map((products: any) => ({
              ...order,
              products
            }))
          );
        });
        // Combine all observables and return the result as an array
        return forkJoin(orderObservables);
      })
    );
  }
  getEmployeesSalaries(): any {
    return this.httpClient.get(`${this.url}/employees`);
  }

  getIngredients(): Observable<any> {
    return this.httpClient.get(`${this.url}/ingredients`);
  }

  getProducts(): Observable<any> {
    return this.httpClient.get(`${this.url}/products`);
  }

  getProduct(id: string): Observable<any> {
    return this.httpClient.get(`${this.url}/products/${id}`);
  }

  getCustomers(): Observable<any> {
    return this.httpClient.get(`${this.url}/customers`);
  }

  getEmployees(): Observable<any> {
    return this.httpClient.get(`${this.url}/employees`);
  }

  getCosts() {
    this.getEmployeesSalaries().subscribe((result: any) => {
      this.salaries = result.items.reduce(
        (sum: number, employee: any) => sum + employee.salary,
        0,
      );
      this.salaries$.next(this.salaries);
    });
  }

  getRevenue() {
    this.getOrders().subscribe((result: any) => {
      if (Array.isArray(result.items)) {
        this.revenue = result.items.reduce((sum: number, order: any) => {
          return sum + order.totalPrice;
        }, 0);

        this.revenue$.next(this.revenue);
      } else {
        // Handle the case when there is a single order
        // this.revenue = result?.total_price || 0;
        // this.revenue$.next(this.revenue);
      }
    });
  }
}
