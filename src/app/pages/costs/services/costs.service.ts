import { Injectable } from '@angular/core';
import { HttpService } from '@/services/http/http.service';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { ApiRoutes } from '@/ts/enums';

@Injectable({
  providedIn: 'root',
})
export class CostsService {
  salaries$: BehaviorSubject<number> = new BehaviorSubject(0);
  revenue$: BehaviorSubject<number> = new BehaviorSubject(0);

  salaries: number = 0;
  ingredients: number = 0;
  revenue: number = 0;
  constructor(private httpClient: HttpService) {}

  getOrders(): Observable<any> {
    return this.httpClient.get(ApiRoutes.Orders);
  }

  getOrdersModified(): Observable<any> {
    return this.httpClient.get<any[]>(ApiRoutes.Orders).pipe(
      switchMap((orders: any) => {
        // Map each order to fetch its product details and replace productId with name
        const orderObservables = orders.items.map((order: any) => {
          const productObservables = order.products.map((product: any) => {
            return this.getProduct(product.productId).pipe(
              map((productDetails: any) => ({
                ...product,
                name: productDetails.name,
              })),
            );
          });
          // Combine product observables for each order
          return forkJoin(productObservables).pipe(
            map((products: any) => ({
              ...order,
              products,
            })),
          );
        });
        // Combine all observables and return the result as an array
        return forkJoin(orderObservables);
      }),
    );
  }

  getEmployeesSalaries(): any {
    return this.httpClient.get(ApiRoutes.Employees);
  }

  getIngredients(): Observable<any> {
    return this.httpClient.get(ApiRoutes.Ingredients);
  }

  getProducts(): Observable<any> {
    return this.httpClient.get(ApiRoutes.Products);
  }

  getProduct(id: string): Observable<any> {
    return this.httpClient.get(`${ApiRoutes.Products}/${id}`);
  }

  getCustomers(): Observable<any> {
    return this.httpClient.get(ApiRoutes.Customers);
  }

  getEmployees(): Observable<any> {
    return this.httpClient.get(ApiRoutes.Employees);
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
