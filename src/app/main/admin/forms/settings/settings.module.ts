import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { SettingsService } from 'app/_services';
import { AuthGuard } from 'app/_guards';

const routes = [
  { 
    path: 'admin/forms/settings', 
    component: SettingsComponent, 
    canActivate: [AuthGuard],
    resolve  : {
      setting :SettingsService,
    },
    data           : { key : "form-settings"},
  },
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FieldsComponentModule,
  ],
  providers :[SettingsService]
})
export class SettingsModule { }
