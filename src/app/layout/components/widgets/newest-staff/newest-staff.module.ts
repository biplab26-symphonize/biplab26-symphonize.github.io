import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewestStaffComponent } from './newest-staff.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [NewestStaffComponent],
  imports: [
    CommonModule,
    CarouselModule 
  ],
  entryComponents:[
        NewestStaffComponent
  ],
  exports :[
    NewestStaffComponent
  ]
})
export class NewestStaffModule { }
