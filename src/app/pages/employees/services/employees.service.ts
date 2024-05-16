import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@/services/http/http.service';
import { EmployeesInterface } from '@/shared/models';
import { ApiRoutes } from '@/ts/enums';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInAddMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentEmployeeId$: BehaviorSubject<number> = new BehaviorSubject(0);
  source: BehaviorSubject<any> = new BehaviorSubject({});

  addForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
  });

  constructor(private httpClient: HttpService) {}

  getEmployees() {
    return this.httpClient.get(ApiRoutes.Employees);
  }

  updateTable() {
    this.getEmployees().subscribe((result: any) => {
      this.source.next(result.items);
    });
  }

  editEmployees(employeeId: number, employeeDetails: EmployeesInterface) {
    return this.httpClient.put(
      `${ApiRoutes.Employees}/${employeeId}`,
      employeeDetails,
    );
  }

  deleteEmployees(employeeId: number) {
    return this.httpClient.delete(`${ApiRoutes.Employees}/${employeeId}`);
  }

  addEmployees(employee: EmployeesInterface) {
    return this.httpClient.post(ApiRoutes.Employees, employee);
  }
}
