// customDateAdapter.ts
import { Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

import { DatePickerFormatsService, CommonService } from 'app/_services';

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter
{
  public defaultDateFormat: any = {date_format:'MM/dd/yyyy'};

  constructor(
    private _datePickerFormatService: DatePickerFormatsService,
    private _commonService:CommonService
  )
  {
    super(_datePickerFormatService.locale);
    //Deault DateTime Formats
    let defaultDateFormat = this._commonService.getDefaultDateTimeFormat;
    this.defaultDateFormat = defaultDateFormat && defaultDateFormat.date_format ? defaultDateFormat.date_format : this.defaultDateFormat; 
        
  }

  public format(date: moment.Moment, displayFormat: string): string
  {
    const locale = this._datePickerFormatService.locale;
    const result = date.locale(locale).format(this.defaultDateFormat.toUpperCase());
    return result;
  }
  public getFirstDayOfWeek(): number {
    return 0;
  }
}