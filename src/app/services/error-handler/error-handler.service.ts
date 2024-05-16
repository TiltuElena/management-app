import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  public handle(error: HttpErrorResponse, ignoredErrors?: Array<number>): void {
    if (ignoredErrors?.includes(error.status)) {
      return;
    }

    const statusCodes: { [key: number]: Function } = {
      401: () => this.router.navigateByUrl('/signin'),
      404: () => {
        console.log('test 404');
      },
    };

    statusCodes[error.status]?.();
  }
}
