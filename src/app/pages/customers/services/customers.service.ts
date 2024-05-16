import { Injectable } from '@angular/core';
import { HttpService } from '@/services/http/http.service';
import { CustomersInterface } from '@/shared/models';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiRoutes } from '@/ts/enums';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentCustomerId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});

  skip$: BehaviorSubject<number> = new BehaviorSubject(0);
  take$: BehaviorSubject<number> = new BehaviorSubject(0);

  addForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private httpClient: HttpService) {}

  getCustomers() {
    return this.httpClient.get(ApiRoutes.Customers);
  }

  getCustomerOffset(skip: number, take: number) {
    return this.httpClient.get(ApiRoutes.Customers);
  }

  updateTable(skip: number, take: number) {
    // this.getCustomers().subscribe((result: any) => {
    //   this.source.next(result)
    // })
    this.getCustomerOffset(skip, take).subscribe((result: any) => {
      this.source.next(result.items);
    });
  }

  editCustomer(customerId: number, customerDetails: CustomersInterface) {
    return this.httpClient.put(
      `${ApiRoutes.Customers}/${customerId}`,
      customerDetails,
    );
  }

  deleteCustomer(customerId: number) {
    return this.httpClient.delete(`${ApiRoutes.Customers}/${customerId}`);
  }

  addCustomer(customer: CustomersInterface) {
    return this.httpClient.post(ApiRoutes.Customers, customer);
  }
}
