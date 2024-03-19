import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterdataComponent } from './registerdata.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RecurringModule } from '../recurring/recurring.module';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MomentUtcDateAdapter } from 'app/_helpers';



@NgModule({
  declarations: [RegisterdataComponent],
  exports     : [RegisterdataComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FuseSharedModule,
    RecurringModule,
    
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
  ]
})
export class RegisterdataModule { }
