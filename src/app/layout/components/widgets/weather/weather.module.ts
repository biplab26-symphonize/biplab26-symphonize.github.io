import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './weather.component';
import { MatIconModule } from '@angular/material/icon';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
  declarations: [WeatherComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FuseSharedModule,
    FuseWidgetModule
  ],
  entryComponents: [
    WeatherComponent
  ],
  exports: [
    WeatherComponent
  ],
})
export class WeatherModule { }
