import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {OrdersInterface} from "../../../shared/models";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {OrdersService} from "../orders.service";

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent {
  constructor(private ordersService: OrdersService) {}
  dataSource: MatTableDataSource<OrdersInterface> = new MatTableDataSource<OrdersInterface>(this.ordersService.source.getValue())
  @ViewChild(MatPaginator) paginator: any;

  displayedColumns: string[] = [
    'id',
    'customer_id',
    'date',
    'products',
    'total_price',
    'delete',
    'edit'
  ];

  defaultCustomer: any;

  ngOnInit() {
    this.ordersService.updateTable()
    this.ordersService.source.subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<OrdersInterface>(res)
      this.dataSource.paginator = this.paginator;
    })
  }

  delete_item(employee: any):void {
    this.ordersService.deleteOrders(employee.id).subscribe(() => this.ordersService.updateTable())
  }

  edit_item(order: any):void {
    console.log(order)
    this.ordersService.currentOrderId$.next(order.id)
    this.ordersService.show$.next(true)
    this.ordersService.isInEditMode$.next(true)
    this.ordersService.isInAddMode$.next(false)

    this.ordersService.addForm.setValue({
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      date: order.orderDate,
      products: order.products[0].name,
      quantity: order.products[0].quantity
    })
  }
}

