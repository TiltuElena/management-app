import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/modules/material/material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './customers-form.component.html',
  styleUrl: './customers-form.component.scss',
})
export class CustomersFormComponent {
  constructor(
    private customersService: CustomersService,
    private snackBar: MatSnackBar,
  ) {}
  currentCustomerId: number = 0;
  show: boolean = false;
  show$: BehaviorSubject<boolean> = this.customersService.show$;
  isInEditMode$: BehaviorSubject<boolean> = this.customersService.isInEditMode$;
  isInAddMode$: BehaviorSubject<boolean> = this.customersService.isInAddMode$;
  addForm: FormGroup = this.customersService.addForm;

  snackbarOptions: MatSnackBarConfig = environment.snackbarOptions;

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
    this.customersService.addCustomer(this.addForm.value).subscribe({
      next: () => {
        this.snackBar.open('Success', 'Close', {
          ...this.snackbarOptions,
        });

        this.customersService.updateTable(
          this.customersService.skip$.getValue(),
          this.customersService.take$.getValue(),
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error: ', error);
        this.snackBar.open(`Error: ${error.error.message}`, 'Close', {
          ...this.snackbarOptions,
        });
      },
    });
    this.customersService.show$.next(false);
    this.addForm.reset();
  }

  editCustomer() {
    this.customersService.currentCustomerId$.subscribe(
      (value: number) => (this.currentCustomerId = value),
    );
    this.customersService
      .editCustomer(this.currentCustomerId, this.addForm.value)
      .subscribe({
        next: () => {
          this.snackBar.open('Success', 'Close', {
            ...this.snackbarOptions,
          });

          this.customersService.updateTable(
            this.customersService.skip$.getValue(),
            this.customersService.take$.getValue(),
          );
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error: ', error);
          this.snackBar.open(`Error: ${error.error.message}`, 'Close', {
            ...this.snackbarOptions,
          });
        },
      });

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
