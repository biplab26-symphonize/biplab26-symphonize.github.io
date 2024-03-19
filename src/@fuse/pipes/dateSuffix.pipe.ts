import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({ name: 'dateSuffix' })
export class DateSuffixPipe implements PipeTransform {

   transform(date: string): string {
    const fullDate = moment(date).format("MMMM Do");   
    return fullDate;
   } // transform ()
} //  class