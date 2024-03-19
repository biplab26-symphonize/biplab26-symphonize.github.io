import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MyBookingComponent } from './my-booking.component';



@NgModule({
  declarations: [MyBookingComponent],
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
    MyBookingComponent
  ],
  exports: [
    MyBookingComponent
  ],
})
export class MyBookingModule { }
