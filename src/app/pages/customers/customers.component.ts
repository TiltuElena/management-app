import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomersTableComponent} from "./components/customers-table/customers-table.component";
import {CustomersFormComponent} from "./components/customers-form/customers-form.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, CustomersFormComponent, CustomersTableComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {

}
