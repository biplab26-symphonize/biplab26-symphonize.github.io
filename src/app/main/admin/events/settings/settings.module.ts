import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'app/main/material.module';
import { RolesService, SettingsService} from 'app/_services';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@busacca/ng-pick-datetime';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { MatOptionSelectAllModule } from 'app/layout/components/mat-option-select-all/mat-option-select-all.module';

const routes = [
    { 
      path          : 'admin/events/settings', 
      component     : SettingsComponent, 
      canActivate   : [AuthGuard], 
      resolve       :{roles : RolesService,
                      setting:SettingsService},
      data           : { key : "event-settings"},
    },
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FieldsComponentModule,
    MatOptionSelectAllModule
  ],
  providers: [RolesService,SettingsService]
})
export class SettingsModule { 
  

}
