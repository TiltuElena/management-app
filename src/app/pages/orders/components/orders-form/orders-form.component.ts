import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/modules/material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface SelectInterface {
  value: string;
  viewValue: string;
}

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

  snackbarOptions: MatSnackBarConfig = {
    panelClass: 'snackbar',
    verticalPosition: 'top',
    duration: 2000,
  };

  ngOnInit() {
    this.show$.subscribe((value: any) => (this.show = value));

    this.ordersService.getCustomers().subscribe((data: any) => {
      this.customers = data.items.map((item: any) => ({
        value: item.id.toString(),
        viewValue: `${item.firstName} ${item.lastName}`,
      }));
    });
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

    this.ordersService.addOrders(data).subscribe((response: any) => {
      console.log(response)
      if (response) {
        this.snackBar.open('Success', 'Close', {
          ...this.snackbarOptions,
        });
      } else {
        this.snackBar.open(`Error`, 'Close', {
          ...this.snackbarOptions,
        });
      }
      this.ordersService.updateTable();
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

    console.log(data);

    this.ordersService
      .editOrders(this.ordersService.currentOrderId$.getValue(), data)
      .subscribe(() => this.ordersService.updateTable());

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
