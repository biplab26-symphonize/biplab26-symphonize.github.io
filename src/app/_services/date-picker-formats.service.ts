// date-time.service
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DatePickerFormatsService
{
  private _format: string;
  private _locale: string;

  public constructor()
  {
    this._format = "LL";
    this._locale = "en-US";
  }

  public get format(): string
  {
    return this._format;
  }
  public set format(value: string)
  {
    console.log(`Setting format to '${ value }'`);

    this._format = value;
  }

  public get locale(): string
  {
    return this._locale;
  }  
  public set locale(value: string)
  {
    console.log(`Setting locale to '${ value }'`);

    this._locale = value;
  }
}