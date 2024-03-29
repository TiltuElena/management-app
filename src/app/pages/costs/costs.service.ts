import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, forkJoin} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CostsService {
  url: string = 'http://localhost:4000'
  salaries$: BehaviorSubject<number> = new BehaviorSubject(0);
  ingredients$: BehaviorSubject<number> = new BehaviorSubject(0);
  revenue$: BehaviorSubject<number> = new BehaviorSubject(0);

  salaries: number = 0;
  ingredients: number = 0;
  revenue: number = 0;
  constructor(private httpClient: HttpClient) {}

  getOrders() {
    return this.httpClient.get(`${this.url}/orders`)
  }

  getEmployeesSalaries(){
    return this.httpClient.get(`${this.url}/employees`)
  }

  getIngredients() {
    return this.httpClient.get(`${this.url}/ingredients`)
  }

  getCosts(){
    this.getEmployeesSalaries().subscribe((result: any) => {
      this.salaries = result.reduce((sum: number, employee: any) => sum + employee.salary, 0);
      this.salaries$.next(this.salaries)
    })

    this.getIngredients().subscribe((result: any) => {
      result.forEach((item: any) => {
        this.ingredients += item.quantity * item.ingredient.cost;
      });

      this.ingredients$.next(this.ingredients)
    })
  }

  getRevenue() {
    this.getOrders().subscribe((result: any) => {
      if (Array.isArray(result)) {
        this.revenue = result.reduce((sum: number, order: any) => {
          return sum + order.total_price;
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
