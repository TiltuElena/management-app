import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesFormComponent } from './components/employees-form/employees-form.component';
import { EmployeesTableComponent } from './components/employees-table/employees-table.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    EmployeesFormComponent,
    EmployeesTableComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent {}
