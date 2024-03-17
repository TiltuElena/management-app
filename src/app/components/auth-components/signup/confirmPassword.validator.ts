import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(controlName);
    const confirmControl = formGroup.get(matchingControlName);

    if (!passwordControl || !confirmControl) {
      return null;
    }

    if (confirmControl.value !== passwordControl.value) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  };
}
