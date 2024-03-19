import { AbstractControl } from '@angular/forms';

export function ValidateVideo(control: AbstractControl) {
  if (!control.value.includes('embed') && !control.value.includes('video')) {
    return { validVideo: true };
  }
  return null;
}
