import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/_guards';
import { NgxMaskModule } from 'ngx-mask';
import { BirthdateModule } from 'app/layout/components/birthdate/birthdate.module';
import { UsermetaModule } from 'app/main/admin/users/usermeta/usermeta.module';
import { CommonService, UsersService } from 'app/_services';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { UsermetaComponent } from './usermeta/usermeta.component';
import { EditorModule } from '@tinymce/tinymce-angular';

const routes = [
  { 
      path: 'edit-profile', 
      component: EditProfileComponent, 
      canActivate: [AuthGuard], 
      data:{type : 'U'},
        resolve  : {
            Meta :CommonService,
            user :UsersService
        } 
  }
];
@NgModule({
  declarations: [EditProfileComponent, UsermetaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseSidebarModule,
    BirthdateModule,
    UsermetaModule,
    // material module
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMaskModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    FieldsComponentModule,
    EditorModule
  ],providers:[AuthGuard,UsersService]
})
export class EditProfileModule { }
