import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAppointmentsComponent } from './my-appointments.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [MyAppointmentsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule, 
    MatIconModule
  ],
  entryComponents: [
    MyAppointmentsComponent
  ],
  exports: [
    MyAppointmentsComponent
  ],
})
export class MyAppointmentsModule { }
