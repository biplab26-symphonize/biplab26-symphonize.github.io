import { AbstractControl } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {
  if (!control.value.startsWith('https') || !control.value.startsWith('http')) {
    return { validUrl: true };
  }
  return null;
}
