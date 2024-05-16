import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8082',

  snackbarOptions: {
    panelClass: 'snackbar',
    verticalPosition: 'top',
    duration: 5000,
  } as MatSnackBarConfig,
};
