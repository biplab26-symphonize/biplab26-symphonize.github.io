import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEventsComponent } from './my-events.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MyEventsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule  
  ],
  entryComponents: [
    MyEventsComponent
  ],
  exports: [
    MyEventsComponent
  ],
})
export class MyEventsModule { }
