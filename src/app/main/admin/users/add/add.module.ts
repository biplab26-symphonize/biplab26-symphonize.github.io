import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { AddComponent } from './add.component';
import { OptionsList, CommonService, UsersService, RolesService } from 'app/_services';
import { FileUploadModule } from 'app/layout/components/file-upload/file-upload.module';
import { CommonUtils } from 'app/_helpers';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { UsermetaModule } from '../usermeta/usermeta.module';
import { BirthdateModule } from 'app/layout/components/birthdate/birthdate.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { GalleryModule } from 'app/layout/components/dialogs/gallery/gallery.module';
const routes = [
    { 
        path: 'admin/users/add', 
        component: AddComponent, 
        canActivate: [AuthGuard],
        data:{status:'A' ,type : 'U'},
        resolve  : {
            roles: RolesService,
            Meta :CommonService
        } 
    },
    { 
        path: 'admin/users/edit/:id', 
        component: AddComponent, 
        canActivate: [AuthGuard],
        data:{type : 'U'},
        resolve  : {
            roles: RolesService,
            user: UsersService,
            Meta :CommonService
        } 
    },
];

@NgModule({
    declarations: [AddComponent],
    imports:[
              CommonModule,
              RouterModule.forChild(routes),
              FuseSharedModule,
              MaterialModule,
              FieldsComponentModule,
              UsermetaModule,
              BirthdateModule,
              FileUploadModule,
              EditorModule,
              GalleryModule,
              NgxMaskModule.forRoot()
          ],
    providers: [OptionsList, CommonService, RolesService, UsersService, CommonUtils]        
})
export class AddModule { }
