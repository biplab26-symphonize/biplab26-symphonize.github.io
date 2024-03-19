import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingRoomComponent } from './meeting-room.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MeetingRoomComponent],
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
    MeetingRoomComponent
  ],
  exports: [
    MeetingRoomComponent
  ],
})
export class MeetingRoomModule { }
