import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/modules/material/material.module';
import { CustomersInterface } from '../../../../shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CustomersService } from '../../services/customers.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './customers-table.component.html',
  styleUrl: './customers-table.component.scss',
})
export class CustomersTableComponent {
  constructor(
    private customersService: CustomersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>(
    Array.isArray(this.customersService.source.getValue())
      ? this.customersService.source.getValue()
      : [],
  );

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'email',
    'edit',
    'delete',
  ];

  snackbarOptions: MatSnackBarConfig = environment.snackbarOptions;

  ngOnInit() {
    this.customersService.updateTable(0, 10);

    this.customersService.source.subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(
        Array.isArray(res) ? res : [],
      );

      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  initPaginator() {
    this.paginator.page.subscribe((event: PageEvent) => {
      let take = event.pageSize + 1 + event.pageSize * event.pageIndex;
      let skip =
        event.pageIndex >= 2 ? event.pageSize * (event.pageIndex - 1) + 1 : 0;

      this.customersService.skip$.next(skip);
      this.customersService.take$.next(take + event.pageSize);

      this.customersService.updateTable(skip, take);
    });
  }

  delete_item(customer: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: customer.id,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.customersService.deleteCustomer(customer.id).subscribe({
          next: () => {
            this.snackBar.open('Deleted successfully', 'Close', {
              ...this.snackbarOptions,
            });

            this.customersService.updateTable(
              this.customersService.skip$.getValue(),
              this.customersService.take$.getValue(),
            );
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error: ', error);
            this.snackBar.open(`Error: ${error.error.message}`, 'Close', {
              ...this.snackbarOptions,
            });
          },
        });
      }
    });
  }

  edit_item(customer: any): void {
    this.customersService.currentCustomerId$.next(customer.id);
    this.customersService.show$.next(true);
    this.customersService.isInEditMode$.next(true);
    this.customersService.isInAddMode$.next(false);

    this.customersService.addForm.setValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email,
    });
  }
}
