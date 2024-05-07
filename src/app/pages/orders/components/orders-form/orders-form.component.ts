import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OrdersService } from '../../services/orders.service';

interface SelectInterface {
  value: string;
  viewValue: string;
}

interface ProductInterface {
  productId: number;
  quantity: number;
}

interface CreateOrderInterface {
  products: ProductInterface[],
  customerId: number,
  orderDate: Date
}

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.scss',
})
export class OrdersFormComponent {
  constructor(private ordersService: OrdersService) {}

  currentCustomerId: number = 0;
  show: boolean = false;
  show$: BehaviorSubject<boolean> = this.ordersService.show$;
  isInEditMode$: BehaviorSubject<boolean> = this.ordersService.isInEditMode$;
  isInAddMode$: BehaviorSubject<boolean> = this.ordersService.isInAddMode$;
  addForm: FormGroup = this.ordersService.addForm;

  customers: SelectInterface[] = [];
  chooseProducts: SelectInterface[] = []
  products: ProductInterface[] = []


  ngOnInit() {
    this.show$.subscribe((value: any) => (this.show = value));

    this.ordersService.getCustomers().subscribe((data: any) => {
      this.customers = data.items.map((item: any) => ({
        value: item.id.toString(),
        viewValue: `${item.firstName} ${item.lastName}`
      }));
    })

    this.ordersService.getProducts().subscribe((data: any) => {
      this.chooseProducts = data.items.map((item: any) => ({
        value: item.id.toString(),
        viewValue: item.name
      }));
    })
  }

  enterAddMode(): void {
    this.show$.subscribe((value: any) => (this.show = !value));
    this.show$.next(this.show);
    this.ordersService.isInAddMode$.next(true);
    this.ordersService.isInEditMode$.next(false);
  }

  addProduct(){
      const productId = Number(this.addForm.controls['products'].value);
      const quantity = Number(this.addForm.controls['quantity'].value);
      this.products.push({ productId, quantity });

      this.addForm.controls['products'].reset();
      this.addForm.controls['quantity'].reset();
  }

  addOrder(): void {
    const productId = Number(this.addForm.controls['products'].value);
    const quantity = Number(this.addForm.controls['quantity'].value);
    this.products.push({ productId, quantity });

    const data = {
      date: this.addForm.controls['date'].value,
      customerId: Number(this.addForm.controls['customer'].value),
      products: this.products
    }

    this.products = []
    // this.ordersService.addOrders(this.addForm.value).subscribe(() => this.ordersService.updateTable());

    this.ordersService.addOrders(data).subscribe(() => this.ordersService.updateTable());

    this.ordersService.show$.next(false);
    this.addForm.reset();
  }

  editOrder() {
    const productId = Number(this.addForm.controls['products'].value);
    const quantity = Number(this.addForm.controls['quantity'].value);
    this.products.push({ productId, quantity });

    const data = {
      date: this.addForm.controls['date'].value,
      customerId: Number(this.addForm.controls['customer'].value),
      products: this.products
    }

    this.products = []
    this.ordersService.currentOrderId$.subscribe((value: number) => (this.currentCustomerId = value));
    this.ordersService
      .editOrders(productId, data)
      .subscribe(() => this.ordersService.updateTable());

    this.ordersService.isInEditMode$.next(false);
    this.ordersService.show$.next(false);
    this.addForm.reset();
  }

  getErrorRequiredMessage(): string {
    if (this.addForm.controls['customer'].hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
}
