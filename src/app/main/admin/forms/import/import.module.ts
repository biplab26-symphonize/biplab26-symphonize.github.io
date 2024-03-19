import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { ImportComponent } from './import.component';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { path: 'admin/forms/import', component: ImportComponent, canActivate: [AuthGuard] },
];

@NgModule({
declarations: [ImportComponent],
imports:[
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MaterialModule
        ]
})
export class ImportModule { }
