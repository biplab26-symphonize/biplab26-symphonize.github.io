import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatOptionSelectAllComponent } from './mat-option-select-all.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [MatOptionSelectAllComponent],
  exports: [
    MatOptionSelectAllComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,
  ]
})
export class MatOptionSelectAllModule { }
