import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule} from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { NotificationsComponent } from './notifications.component';
import { NgxMaskModule } from 'ngx-mask';
import { AddnotificationComponent } from './addnotification/addnotification.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsService } from 'app/_services';


const routes = [
  { 
    path        : 'admin/form/notification/:id', 
    component   : NotificationsComponent, 
    canActivate : [AuthGuard],
    resolve     : {forms: FormsService},
    data        : {form_id :'form_id'}
  },
 
]
@NgModule({
  declarations: [NotificationsComponent],
  imports: [
            CommonModule,
            RouterModule.forChild(routes),
            FuseSharedModule,
            MaterialModule,
            NgxMaskModule.forRoot(),
            EditorModule
  ]
})
export class NotificationsModule { }
