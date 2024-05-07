import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomersFormComponent} from "../customers/components/customers-form/customers-form.component";
import {CustomersTableComponent} from "../customers/components/customers-table/customers-table.component";
import {EmployeesFormComponent} from "./components/employees-form/employees-form.component";
import {EmployeesTableComponent} from "./components/employees-table/employees-table.component";

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, CustomersFormComponent, CustomersTableComponent, EmployeesFormComponent, EmployeesTableComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

}
