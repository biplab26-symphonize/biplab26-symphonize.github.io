import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSharedModule } from '@fuse/shared.module';
import { BannerComponent } from './banner.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';


@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    FuseSharedModule,
    FusePipesModule
  ],
  exports     : [
    BannerComponent
  ]
})
export class BannerModule { }
