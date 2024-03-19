import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { FieldsModule } from '../../fields/fields.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path: 'admin/forms/preview/:id', 
    component: PreviewComponent, 
    canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [PreviewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FieldsModule,
    FieldsComponentModule,
  ]
})
export class PreviewModule { }
