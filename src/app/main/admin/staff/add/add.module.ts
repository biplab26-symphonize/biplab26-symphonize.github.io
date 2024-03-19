import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { AddComponent } from './add.component';
import { MaterialModule } from 'app/main/material.module';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { NgxMaskModule } from 'ngx-mask';

import { ChatService, OptionsList, StaffService} from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { AddStaffResolver } from 'app/_resolvers/addStaff.resolver';
import { EditorModule } from '@tinymce/tinymce-angular';
import { StaffmetaModule } from '../staffmeta/staffmeta.module';
const routes = [
  { 
    path: 'admin/staff/add', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    resolve  : {
      Categorys: AddStaffResolver,
    }
  },
  { 
    path: 'admin/staff/edit/:id', 
    component: AddComponent, 
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve  : {
      Categorys: AddStaffResolver,
      staff : StaffService,
      chat: ChatService,
    }
  }
];

@NgModule({
declarations: [AddComponent],
imports: [
  CommonModule,
  RouterModule.forChild(routes),
  FuseSharedModule,
  MaterialModule,
  FileUploadModule,
  EditorModule,
  StaffmetaModule,
  NgxMaskModule.forRoot()
],
providers: [OptionsList ,CommonUtils ,AddStaffResolver ,StaffService]       
})
export class AddModule { }
