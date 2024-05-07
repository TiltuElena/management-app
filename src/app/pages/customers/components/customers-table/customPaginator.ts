import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {

  private totalCustomers$ = new BehaviorSubject<number>(0);

  constructor(private customerService: CustomersService) {
    super();
    this.refreshTotalCustomers();
  }

  private refreshTotalCustomers() {
    this.customerService
      .getNrOfCustomers()
      .subscribe((total: any) => this.totalCustomers$.next(total));
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ): string => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);

    // return this.totalCustomers$.getValue()
    //   ? `${start} - ${end} of ${this.totalCustomers$.getValue()}`
    //   : '';
    return ''
  };
}
