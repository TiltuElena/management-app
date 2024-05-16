import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/modules/material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SelectInterface } from '@/shared/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.scss',
})
export class OrdersFormComponent {
  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  show: boolean = false;
  show$: BehaviorSubject<boolean> = this.ordersService.show$;
  isInEditMode$: BehaviorSubject<boolean> = this.ordersService.isInEditMode$;
  isInAddMode$: BehaviorSubject<boolean> = this.ordersService.isInAddMode$;
  addForm: FormGroup = this.ordersService.addForm;
  products$: BehaviorSubject<any> = this.ordersService.products$;
  customers: SelectInterface[] = [];
  public inputValue: string = '';

  snackbarOptions: MatSnackBarConfig = environment.snackbarOptions;

  ngOnInit() {
    this.show$.subscribe((value: any) => (this.show = value));

    this.ordersService.getCustomers().subscribe((data: any) => {
      this.customers = data.items.map((item: any) => ({
        value: item.id.toString(),
        viewValue: `${item.firstName} ${item.lastName}`,
      }));
    });

    this.products$.subscribe(() => {
      this.calculateInputValue();
    });
  }

  private calculateInputValue(): void {
    const products = this.ordersService.viewProducts$.getValue();
    if (products.length === 0) {
      this.inputValue = '';
      return;
    }
    const lastProductId = products[products.length - 1].name;

    if (products.length === 1) {
      this.inputValue = `${lastProductId}`;
    } else {
      const othersLabel = products.length === 2 ? 'other' : 'others';
      this.inputValue = `${lastProductId} (+${
        products.length - 1
      } ${othersLabel})`;
    }
  }

  enterAddMode(): void {
    this.show$.subscribe((value: any) => (this.show = !value));
    this.show$.next(this.show);
    this.ordersService.isInAddMode$.next(true);
    this.ordersService.isInEditMode$.next(false);
  }

  addOrder(): void {
    const data = {
      date: this.addForm.controls['date'].value,
      customerId: Number(this.addForm.controls['customer'].value),
      products: this.products$.getValue(),
    };

    this.ordersService.addOrders(data).subscribe({
      next: () => {
        this.snackBar.open('Success', 'Close', {
          ...this.snackbarOptions,
        });

        this.ordersService.updateTable();
      },
      error: (error: any) => {
        console.error('Error: ', error);
        this.snackBar.open(`Error: ${error.name}  ${error.status}`, 'Close', {
          ...this.snackbarOptions,
        });
      },
    });

    this.ordersService.show$.next(false);
    this.addForm.reset();
    this.products$.next([]);
  }

  editOrder() {
    const data = {
      date: this.addForm.controls['date'].value,
      customerId: Number(this.addForm.controls['customer'].value),
      products: this.products$.getValue(),
    };

    this.ordersService
      .editOrders(this.ordersService.currentOrderId$.getValue(), data)
      .subscribe({
        next: () => {
          this.snackBar.open('Success', 'Close', {
            ...this.snackbarOptions,
          });

          this.ordersService.updateTable();
        },
        error: (error: any) => {
          console.error('Error: ', error);
          this.snackBar.open(`Error: ${error.name}  ${error.status}`, 'Close', {
            ...this.snackbarOptions,
          });
        },
      });

    this.ordersService.isInEditMode$.next(false);
    this.ordersService.show$.next(false);
    this.addForm.reset();
    this.products$.next([]);
  }

  getErrorRequiredMessage(): string {
    if (this.addForm.controls['customer'].hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '500px',
      data: [...this.products$.getValue()],
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.products$.next(result);
      }
    });
  }
}
