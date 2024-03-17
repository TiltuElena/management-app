import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomersInterface } from '../../shared/models';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentCustomerId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});
  totalCustomers$: BehaviorSubject<number> = new BehaviorSubject(0);

  skip$: BehaviorSubject<number> = new BehaviorSubject(0);
  take$: BehaviorSubject<number> = new BehaviorSubject(0);

  addForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  url = 'http://localhost:4000';
  constructor(private httpClient: HttpClient) {}

  getCustomers() {
    return this.httpClient.get(`${this.url}/customers`);
  }

  getNrOfCustomers(){
    return this.httpClient.get(`${this.url}/customers/count`)
  }

  getCustomerOffset(skip: number, take: number) {
    return this.httpClient.get(
      `${this.url}/customers/customers-offset?skip=${skip}&take=${take}`,
    );
  }

  updateTable(skip: number, take: number) {
    // this.getCustomers().subscribe((result: any) => {
    //   this.source.next(result)
    // })
    this.getCustomerOffset(skip, take).subscribe((result: any) => {
      this.source.next(result);
    });
  }

  editCustomer(customerId: number, customerDetails: CustomersInterface) {
    return this.httpClient.put(
      `${this.url}/customers/${customerId}`,
      customerDetails,
    );
  }

  deleteCustomer(customerId: number) {
    return this.httpClient.delete(`${this.url}/customers/${customerId}`);
  }

  addCustomer(customer: CustomersInterface) {
    return this.httpClient.post(`${this.url}/customers`, customer);
  }
}
