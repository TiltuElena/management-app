import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {EmployeesInterface} from "../../../shared/models";

@Injectable({
  providedIn: 'root'
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
  })

  url = 'http://localhost:8082'
  constructor(private httpClient: HttpClient) {}

  getEmployees() {
    return this.httpClient.get(`${this.url}/employees`)
  }

  updateTable(){
    this.getEmployees().subscribe((result: any) => {
      this.source.next(result.items)
    })
  }

  editEmployees(employeeId: number, employeeDetails: EmployeesInterface) {
    return this.httpClient.put(`${this.url}/employees/${employeeId}`, employeeDetails)
  }

  deleteEmployees(employeeId: number) {
    return this.httpClient.delete( `${this.url}/employees/${employeeId}`)
  }

  addEmployees(employee: EmployeesInterface){
    return this.httpClient.post(`${this.url}/employees`, employee);
  }
}
