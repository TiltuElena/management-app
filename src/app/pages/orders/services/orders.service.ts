import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrdersInterface } from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentOrderId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});
  products$: BehaviorSubject<any> = new BehaviorSubject([]);

  addForm: FormGroup = new FormGroup({
    customer: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required])
  });

  url = 'http://localhost:8082';
  constructor(private httpClient: HttpClient) {}

  getOrders() {
    return this.httpClient.get(`${this.url}/orders`);
  }

  getCustomers() {
    return this.httpClient.get(`${this.url}/customers`);
  }

  getOrder(id: string) {
    return this.httpClient.get(`${this.url}/orders/${id}`);
  }

  getProducts() {
    return this.httpClient.get(`${this.url}/products`);
  }

  getProduct(id: string) {
    return this.httpClient.get(`${this.url}/products/${id}`);
  }

  updateTable() {
    this.getOrders().subscribe((result: any) => {
      const data = result.items.map((item: any) => {
        let products: any = [];
        item.products.forEach((data: any) => {
          this.getProduct(data.productId).subscribe((res: any) => {
            products.push({
              name: res.name,
              quantity: data.quantity,
            });
          });
        });
        return {
          orderId: item.id,
          customer: item.customer.name,
          orderDate: item.date,
          totalPrice: item.totalPrice,
          products: products,
        };
      });
      this.source.next(data);
    });
  }

  editOrders(orderId: any, order: any) {
    return this.httpClient.put(`${this.url}/orders/${orderId}`, order);
  }

  deleteOrders(orderId: number) {
    return this.httpClient.delete(`${this.url}/orders/${orderId}`);
  }

  addOrders(order: any) {
    return this.httpClient.post(`${this.url}/orders`, order);
  }
}
