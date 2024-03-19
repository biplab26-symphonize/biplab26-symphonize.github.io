import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { ExportComponent } from './export.component';
import { FormentriesService, FormsService } from 'app/_services';

const routes = [
  { path:'admin/forms/export',
   component: ExportComponent, 
   canActivate: [AuthGuard], 
   resolve     : {
    formentry : FormentriesService,
    forms     : FormsService
  },
},
   
];

@NgModule({
  declarations: [ExportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ]
})
export class ExportModule { }
