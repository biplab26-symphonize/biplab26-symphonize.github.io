import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { AllComponent } from './all.component';
import { FormsService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path        : 'admin/forms/all', 
    component   : AllComponent, 
    canActivate : [AuthGuard],
    resolve     : {forms: FormsService},
    data		    : {formid: 'form_id' } 
  },
  {
    path        : 'admin/forms/trash', 
    component   : AllComponent, 
    canActivate : [AuthGuard],
    resolve     : {forms: FormsService},
    data        : {
                    trash : 1,
                    formid: 'form_id' 
                  }
  },
];

@NgModule({
declarations: [AllComponent],
imports:[
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MaterialModule,
        ],
providers : [FormsService]
})
export class AllModule {
 }
