import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { BirthdateModule } from 'app/layout/components/birthdate/birthdate.module';
import { UsermetaModule } from 'app/main/admin/users/usermeta/usermeta.module';
import { CommonService, UsersService } from 'app/_services';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EditOtherProfileComponent } from './edit-other-profile.component';
import { ProfileResolver } from 'app/_resolvers';

const routes: Routes = [
  { 
    path: 'edit-other-profile/:id', 
    component: EditOtherProfileComponent, 
    canActivate: [AuthGuard], 
      data:{type : 'U'},
        resolve  : {
            Meta :CommonService,
            user :UsersService
        } 
  }
];

@NgModule({
  declarations: [
    EditOtherProfileComponent
  ],
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
  ],
  providers:[
    AuthGuard,UsersService
  ]
})
export class EditOtherProfileModule { }
