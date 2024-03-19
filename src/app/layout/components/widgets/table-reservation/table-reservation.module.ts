import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableReservationComponent } from './table-reservation.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [TableReservationComponent],
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
    TableReservationComponent
  ],
  exports: [
    TableReservationComponent
  ],
})
export class TableReservationModule { }
