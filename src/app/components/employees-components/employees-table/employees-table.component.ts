import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {MatPaginator} from "@angular/material/paginator";
import {EmployeesInterface} from "../../../shared/models";
import {MatTableDataSource} from "@angular/material/table";
import {EmployeesService} from "../employees.service";

@Component({
  selector: 'app-employees-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.scss'
})
export class EmployeesTableComponent {
  constructor(private employeesService: EmployeesService) {}
  dataSource: MatTableDataSource<EmployeesInterface> = new MatTableDataSource<EmployeesInterface>(this.employeesService.source.getValue())

  @ViewChild(MatPaginator) paginator: any;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'email',
    'address',
    'salary',
    'edit',
    'delete',
  ];

  ngOnInit() {
    this.employeesService.updateTable()
    this.employeesService.source.subscribe((res: any) => {
      this.dataSource =  new MatTableDataSource<EmployeesInterface>(res)
      this.dataSource.paginator = this.paginator;
    })
  }

  delete_item(employee: any):void {
    this.employeesService.deleteEmployees(employee.id).subscribe(() => this.employeesService.updateTable())
  }

  edit_item(employee: any):void {
    this.employeesService.currentEmployeeId$.next(employee.id)
    this.employeesService.show$.next(true)
    this.employeesService.isInEditMode$.next(true)
    this.employeesService.isInAddMode$.next(false)

    this.employeesService.addForm.setValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone,
      email: employee.email,
      address: employee.address,
      salary: employee.salary
    })
  }
}

const employees: EmployeesInterface[] = [
  {
    id: 1,
    first_name: 'Doe',
    last_name: 'Joe',
    phone: '+373060214498',
    email: 'john.doe@gmail.com',
    address: 'New York',
    salary: 5000,
  },
  {
    id: 2,
    first_name: 'Smith',
    last_name: 'Anne',
    phone: '+373789214498',
    email: 'anne.smith@gmail.com',
    address: 'New York',
    salary: 7700,
  },
  {
    id: 3,
    first_name: 'King',
    last_name: 'Mary',
    phone: '+373789214998',
    email: 'mary.king@gmail.com',
    address: 'New York',
    salary: 1300,
  },
  {
    id: 4,
    first_name: 'Carsley',
    last_name: 'John',
    phone: '+373744444998',
    email: 'john.carsley@gmail.com',
    address: 'New York',
    salary: 900,
  },
  {
    id: 5,
    first_name: 'Great',
    last_name: 'Mark',
    phone: '+373799214998',
    email: 'mark.great@gmail.com',
    address: 'New York',
    salary: 5220,
  },
  {
    id: 6,
    first_name: 'Doom',
    last_name: 'Helen',
    phone: '+373339214998',
    email: 'helen.doom@gmail.com',
    address: 'New York',
    salary: 5001,
  },
  {
    id: 7,
    first_name: 'Meet',
    last_name: 'Hikaru',
    phone: '+373789214977',
    email: 'hikaru.meet@gmail.com',
    address: 'New York',
    salary: 7000,
  },
  {
    id: 8,
    first_name: 'Beast',
    last_name: 'Marrie',
    phone: '+373789214668',
    email: 'marie.beast@gmail.com',
    address: 'New York',
    salary: 36000,
  },
  {
    id: 9,
    first_name: 'Sweet',
    last_name: 'Valery',
    phone: '+373799914998',
    email: 'valery.sweet@gmail.com',
    address: 'New York',
    salary: 7000,
  },
  {
    id: 10,
    first_name: 'Dracula',
    last_name: 'Vlad',
    phone: '+373789211198',
    email: 'vlad.dracula@gmail.com',
    address: 'New York',
    salary: 6000,
  },
  {
    id: 11,
    first_name: 'Many',
    last_name: 'Lily',
    phone: '+373789217898',
    email: 'lily.many@gmail.com',
    address: 'New York',
    salary: 5890,
  },
];
