import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@/services/http/http.service';
import { OrdersInterface } from '../../../shared/models';
import { ApiRoutes } from '@/ts/enums';

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
  viewProducts$: BehaviorSubject<any> = new BehaviorSubject([]);

  addForm: FormGroup = new FormGroup({
    customer: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  constructor(private httpClient: HttpService) {}

  getOrders() {
    return this.httpClient.get(ApiRoutes.Orders);
  }

  getCustomers() {
    return this.httpClient.get(ApiRoutes.Customers);
  }

  getOrder(id: string) {
    return this.httpClient.get(`${ApiRoutes.Orders}/${id}`);
  }

  getProducts() {
    return this.httpClient.get(ApiRoutes.Products);
  }

  getProduct(id: string) {
    return this.httpClient.get(`${ApiRoutes.Products}/${id}`);
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
    return this.httpClient.put(`${ApiRoutes.Orders}/${orderId}`, order);
  }

  deleteOrders(orderId: number) {
    return this.httpClient.delete(`${ApiRoutes.Orders}/${orderId}`);
  }

  addOrders(order: any) {
    return this.httpClient.post(ApiRoutes.Orders, order);
  }
}
