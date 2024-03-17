import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../shared/modules/material/material.module";

@Component({
  selector: 'app-distributors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './distributors-form.component.html',
  styleUrl: './distributors-form.component.scss'
})
export class DistributorsFormComponent {
  show: boolean = false;

  addForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    distributed_product: new FormControl('', [Validators.required]),
  });

  add(): void {
    console.log(this.addForm.value);
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
    if (this.addForm.controls['first_name'].hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
}
