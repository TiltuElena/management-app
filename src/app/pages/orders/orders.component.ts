import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersFormComponent } from '../../components/orders-components/orders-form/orders-form.component';
import { OrdersTableComponent } from '../../components/orders-components/orders-table/orders-table.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrdersFormComponent, OrdersTableComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {}
