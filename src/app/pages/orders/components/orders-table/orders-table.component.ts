import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { OrdersInterface } from '../../../../shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OrdersService } from '../../services/orders.service';
import { MdlCurrencyPipe } from '../../../../shared/pipes/mdl-currency.pipe';
import { MatSort } from '@angular/material/sort';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, MdlCurrencyPipe],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss',
})
export class OrdersTableComponent {
  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
  ) {}
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(
    Array.isArray(this.ordersService.source.getValue())
      ? this.ordersService.source.getValue()
      : [],
  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'orderId',
    'customer',
    'date',
    'products',
    'totalPrice',
    'delete',
    'edit',
  ];

  snackbarOptions: MatSnackBarConfig = {
    panelClass: 'snackbar',
    verticalPosition: 'top',
    duration: 2000,
  };

  ngOnInit() {
    this.ordersService.updateTable();
    this.ordersService.source.subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(
        Array.isArray(res) ? res : [],
      );
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  delete_item(order: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: '',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.ordersService
          .deleteOrders(order.orderId)
          .subscribe(() => this.ordersService.updateTable());
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  edit_item(order: any): void {
    this.ordersService.getOrder(order.orderId).subscribe((order: any) => {
      this.ordersService.addForm.setValue({
        customer: order.customer.id.toString(),
        date: order.date,
      });

      this.ordersService.currentOrderId$.next(order.id);
      this.ordersService.products$.next(order.products);
    });

    this.ordersService.show$.next(true);
    this.ordersService.isInEditMode$.next(true);
    this.ordersService.isInAddMode$.next(false);
  }
}
