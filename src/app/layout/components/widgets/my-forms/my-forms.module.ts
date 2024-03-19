import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFormsComponent } from './my-forms.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MyFormsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule , 
    MatIconModule
  ],
  entryComponents: [
    MyFormsComponent
  ],
  exports: [
    MyFormsComponent
  ],
})
export class MyFormsModule { }
