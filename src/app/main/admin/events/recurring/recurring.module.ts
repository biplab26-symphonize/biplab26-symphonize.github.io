import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringComponent } from './recurring.component';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SettingsService } from 'app/_services';
import { RouterModule } from '@angular/router';
import { ManualModule } from './manual/manual.module';
import { AddEventResolver } from 'app/_resolvers';


const routes = [
  { 
    path          : 'recurring', 
    component     : RecurringComponent,
    resolve       : {setting:AddEventResolver}
  },
];
@NgModule({
  declarations: [RecurringComponent],
  exports     : [RecurringComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    ManualModule
  ],
  providers:[SettingsService]
})
export class RecurringModule { }
