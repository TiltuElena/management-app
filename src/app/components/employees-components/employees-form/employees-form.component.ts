import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../../shared/modules/material/material.module";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EmployeesService} from "../employees.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-employees-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './employees-form.component.html',
  styleUrl: './employees-form.component.scss'
})
export class EmployeesFormComponent {
  constructor(private employeesService: EmployeesService) {}

  currentCustomerId: number = 0;
  show: boolean = false;
  show$: BehaviorSubject<boolean> = this.employeesService.show$
  isInEditMode$: BehaviorSubject<boolean> = this.employeesService.isInEditMode$
  isInAddMode$: BehaviorSubject<boolean> = this.employeesService.isInAddMode$
  addForm: FormGroup = this.employeesService.addForm;

  ngOnInit() {
    this.show$.subscribe((value: any)=> this.show = value)
  }

  enterAddMode(): void{
    this.show$.subscribe((value: any)=> this.show = !value)
    this.show$.next(this.show)
    this.employeesService.isInAddMode$.next(true)
    this.employeesService.isInEditMode$.next(false)
  }

  addEmployee(): void {
    this.employeesService.addEmployees(this.addForm.value).subscribe(() => this.employeesService.updateTable());
    this.employeesService.show$.next(false)
    this.addForm.reset();
  }

  editEmployee() {
    this.employeesService.currentEmployeeId$.subscribe((value: number) => this.currentCustomerId = value)
    this.employeesService.editEmployees(this.currentCustomerId, this.addForm.value).subscribe(() => this.employeesService.updateTable());

    this.employeesService.isInEditMode$.next(false)
    this.employeesService.show$.next(false)
    this.addForm.reset();
  }
  getErrorEmailMessage(): string {
    if (this.addForm.controls['email'].hasError('required')) {
      return 'You must enter a value';
    }
    return this.addForm.controls['email'].hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getErrorRequiredMessage(): string {
    if (this.addForm.controls['firstName'].hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
}
