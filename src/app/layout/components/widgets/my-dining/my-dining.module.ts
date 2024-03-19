import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDiningComponent } from './my-dining.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MyDiningComponent],
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
    MyDiningComponent
  ],
  exports: [
    MyDiningComponent
  ],
})
export class MyDiningModule { }
