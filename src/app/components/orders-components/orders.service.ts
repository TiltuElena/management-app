import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {OrdersInterface} from "../../shared/models";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentOrderId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});

  addForm: FormGroup = new FormGroup({
    customer: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    products: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
  });

  url = 'http://localhost:4000'
  constructor(private httpClient: HttpClient) {}

  getOrders() {
    return this.httpClient.get(`${this.url}/orders`)
  }

  getCustomers(){
    return this.httpClient.get(`${this.url}/customers`)
  }

  getProducts(){
    return this.httpClient.get(`${this.url}/products`)
  }

  // getOrderCustomerName(id: number){
  //   return this.httpClient.get(`${this.url}/customers/${id}`)
  // }

  updateTable(){
    this.getOrders().subscribe((result: any) => {
      this.source.next(result)
    })
  }

  editOrders(orderId: number, orderDetails: OrdersInterface) {
    return this.httpClient.put(`${this.url}/orders/${orderId}`, orderDetails)
  }

  deleteOrders(orderId: number) {
    return this.httpClient.delete( `${this.url}/orders/${orderId}`)
  }

  addOrders(order: any){
    return this.httpClient.post(`${this.url}/orders`, order);
  }
}
