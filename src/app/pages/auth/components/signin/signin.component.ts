import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  hide: boolean = true;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

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
    return '';
  }

  submit(): void {
    this.authService.signin(this.loginForm.value).subscribe((response: any) => {
      if (response) {
        this.authService.isAuthenticated.next(true);
        this.router.navigate(['/main/dashboard']).then();
      }
      this.authService.saveToken(response.access_token);
    });
    this.loginForm.reset();
  }
}
