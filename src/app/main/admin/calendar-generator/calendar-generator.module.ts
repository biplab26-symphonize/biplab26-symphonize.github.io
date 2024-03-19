import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'app/_guards';//#AuthGuard For Routing
import { CommonModule } from '@angular/common';
import { CalendarGeneratorComponent } from './calendar-generator.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { CalendarFormatComponent } from './calendar-format/calendar-format.component';
import { FormatComponent } from './format/format.component';
import { DesignComponent } from './design/design.component';
import { EventSelectionComponent } from './event-selection/event-selection.component';


import { SettingsModule } from './settings/settings.module';
import { CalendarListModule } from './calendar-list/calendar-list.module';
import { CalendarFormatModule } from './calendar-format/calendar-format.module';
import { CalendarCustomizationComponent } from './calendar-customization/calendar-customization.component';
import { CalendarCustomizationModule } from './calendar-customization/calendar-customization.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';





const routes = [
  {
      path     : 'admin/calendar-generator',
      component: CalendarGeneratorComponent,
      canActivate: [AuthGuard]
  },{
      path: 'calendar-list',
      loadChildren: () => import('./calendar-list/calendar-list.module').then(m => m.CalendarListModule)
  },{
      path: 'calendar-settings',
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },{
      path: 'admin/calendar-generator/:id',
      component: CalendarGeneratorComponent
  }
];


@NgModule({
 
  declarations: [CalendarGeneratorComponent, CalendarFormatComponent, FormatComponent, DesignComponent, EventSelectionComponent, CalendarCustomizationComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    SettingsModule,
    CalendarListModule,
    CalendarFormatModule,
    CalendarCustomizationModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports:[CalendarGeneratorComponent,CalendarFormatComponent]
})
export class CalendarGeneratorModule { }
