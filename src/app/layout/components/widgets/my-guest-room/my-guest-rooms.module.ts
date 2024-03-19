import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MyGuestRoomsComponent } from './my-guest-rooms.component';



@NgModule({
  declarations: [MyGuestRoomsComponent],
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
    MyGuestRoomsComponent
  ],
  exports: [
    MyGuestRoomsComponent
  ]
})
export class MyGuestRoomsModule { }
