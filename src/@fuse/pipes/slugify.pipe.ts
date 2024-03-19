import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'slugify'})
export class SlugifyPipe implements PipeTransform {
  transform(input: string, separator:string='-'): string {
    return input.toString().toLowerCase()
      .replace(/\s+/g, separator)           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, separator)         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
}