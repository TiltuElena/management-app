import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { confirmPasswordValidator } from './confirmPassword.validator';
import { MaterialModule } from '@/shared/modules/material/material.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  loginForm: FormGroup;
  hide_password: boolean = true;
  hide_confirm_password: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: [
        '',
        [
          Validators.required,
          confirmPasswordValidator('password', 'confirm_password'),
        ],
      ],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.checkConfirmPasswordValidity();
    });
  }
  checkConfirmPasswordValidity() {
    const confirmControl = this.loginForm.controls['confirm_password'];
    if (confirmControl.errors && confirmControl.errors['passwordMismatch']) {
      confirmControl.setErrors(null);
    }
    if (confirmControl.value !== this.loginForm.controls['password'].value) {
      confirmControl.setErrors({ passwordMismatch: true });
    }
  }

  getErrorEmailMessage(): string {
    if (this.loginForm.controls['email'].hasError('required')) {
      return 'You must enter a value';
    }
    return this.loginForm.controls['email'].hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getErrorPasswordMessage(): string {
    if (this.loginForm.controls['password'].hasError('required')) {
      return 'You must enter a value';
    }
    if (
      this.loginForm.controls['confirm_password'].hasError('passwordMismatch')
    ) {
      return 'Passwords do not match';
    }
    return '';
  }

  submit(): void {
    this.authService.signup(this.loginForm.value).subscribe((response: any) => {
      if (response) {
        this.authService.isAuthenticated.next(true);
        this.router.navigate(['/main/dashboard']).then();
      }
      this.authService.saveToken(response.access_token);
    });

    this.loginForm.reset();
  }
}
