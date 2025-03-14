import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrdersService } from '../../services/orders.service';
import { OnlyNumberDirective } from '@/shared/directives/only-number.directive';
import { SelectInterface } from '@/shared/models';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    OnlyNumberDirective,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  form: FormGroup;
  chooseProducts: SelectInterface[] = [];
  products: any[] = [];
  interim: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupComponent>,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
  ) {
    if (data) {
      this.interim = data;
      console.log(this.interim);
    } else {
      console.log('No data');
    }

    this.form = this.formBuilder.group({
      products: ['', []],
      quantity: ['', [Validators.pattern(/^\d{1,3}$/)]],
    });
  }

  ngOnInit(): void {
    this.ordersService.getProducts().subscribe((data: any) => {
      this.chooseProducts = data.items.map((item: any) => ({
        value: item.id.toString(),
        viewValue: item.name,
      }));

      this.interim.forEach((item: any) => {
        const product = this.chooseProducts.find(
          (p) => p.value == item.productId.toString(),
        );
        const productId: any = item.productId;
        const quantity = item.quantity;
        const name = product ? product.viewValue : '';

        this.products.push({ productId, quantity, name });
      });
    });
  }

  addProduct() {
    const productId = Number(this.form.controls['products'].value);
    const quantity = Number(this.form.controls['quantity'].value);
    const product = this.chooseProducts.find(
      (p) => p.value === productId.toString(),
    );
    const name = product ? product.viewValue : '';

    let productExists = false;
    this.products.forEach((p) => {
      if (p.productId === productId) {
        p.quantity += quantity;
        productExists = true;
      }
    });

    if (!productExists) {
      this.products.push({ productId, quantity, name });
    }

    this.form.controls['products'].reset();
    this.form.controls['quantity'].reset();

    this.products = [...this.products];
  }

  deleteProduct(productId: number) {
    this.products = this.products.filter(
      (product) => product.productId !== productId,
    );
  }

  decrementQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      this.deleteProduct(product.productId);
    }
  }

  incrementQuantity(product: any) {
    if (product.quantity < 100) {
      product.quantity += 1;
    }
  }

  finish() {
    this.ordersService.viewProducts$.next(this.products);

    const prod = this.products.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));
    this.dialogRef.close([...prod]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
