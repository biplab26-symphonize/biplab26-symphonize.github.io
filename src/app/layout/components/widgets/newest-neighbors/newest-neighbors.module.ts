import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewestNeighborsComponent } from './newest-neighbors.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [NewestNeighborsComponent],
  imports: [
    CommonModule,
    CarouselModule,
  ],
  entryComponents : [
    NewestNeighborsComponent
  ],
  exports : [
    NewestNeighborsComponent
  ]
})
export class NewestNeighborsModule { }
