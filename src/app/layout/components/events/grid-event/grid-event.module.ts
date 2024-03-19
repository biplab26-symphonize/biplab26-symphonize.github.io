import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridEventComponent } from './grid-event.component';

@NgModule({
  declarations: [GridEventComponent],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports:[GridEventComponent],
  entryComponents:[GridEventComponent]
})
export class GridEventModule { }
