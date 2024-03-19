import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AddnotificationComponent } from './addnotification.component';
import { FormsService } from 'app/_services';
import { AuthGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from 'app/main/material.module';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';

const routes = [
{ 
  path        : 'admin/forms/notification/addnotification/:id', 
  component   : AddnotificationComponent, 
  canActivate : [AuthGuard],
  resolve     : {forms: FormsService},
  data        : {form_id :'form_id'},
},
{
  path        : 'admin/notification/edit/:id', 
  component   : AddnotificationComponent, 
  canActivate : [AuthGuard],
  resolve     : {forms: FormsService},
  data        : {form_id :'form_id'}
  }

]

@NgModule({
  declarations: [AddnotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    EditorModule
  ]
})
export class AddnotificationModule { }
