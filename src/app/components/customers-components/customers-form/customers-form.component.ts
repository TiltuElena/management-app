import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomersService } from '../customers.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './customers-form.component.html',
  styleUrl: './customers-form.component.scss',
})
export class CustomersFormComponent {
  constructor(private customersService: CustomersService) {}
  currentCustomerId: number = 0;
  show: boolean = false;
  show$: BehaviorSubject<boolean> = this.customersService.show$;
  isInEditMode$: BehaviorSubject<boolean> = this.customersService.isInEditMode$;
  isInAddMode$: BehaviorSubject<boolean> = this.customersService.isInAddMode$;
  addForm: FormGroup = this.customersService.addForm;

  ngOnInit() {
    this.show$.subscribe((value: any) => (this.show = value));
  }

  enterAddMode(): void {
    this.show$.subscribe((value: any) => (this.show = !value));
    this.show$.next(this.show);
    this.customersService.isInAddMode$.next(true);
    this.customersService.isInEditMode$.next(false);
  }

  addCustomer(): void {
    this.customersService
      .addCustomer(this.addForm.value)
      .subscribe(() =>
        this.customersService.updateTable(
          this.customersService.skip$.getValue(),
          this.customersService.take$.getValue(),
        ),
      );
    this.customersService.show$.next(false);
    this.addForm.reset();
  }

  editCustomer() {
    this.customersService.currentCustomerId$.subscribe(
      (value: number) => (this.currentCustomerId = value),
    );
    this.customersService
      .editCustomer(this.currentCustomerId, this.addForm.value)
      .subscribe(() =>
        this.customersService.updateTable(
          this.customersService.skip$.getValue(),
          this.customersService.take$.getValue(),
        ),
      );

    this.customersService.isInEditMode$.next(false);
    this.customersService.show$.next(false);
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
