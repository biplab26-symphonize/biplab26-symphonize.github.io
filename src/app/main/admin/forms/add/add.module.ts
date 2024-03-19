import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { AddComponent } from './add.component';
import { RolesService, FormsService, SettingsService, ChatService } from 'app/_services';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { FieldsModule } from '../../fields/fields.module';
import { FormfieldModule } from 'app/layout/components/form-fields/formfield.module';
import { NgxMaskModule } from 'ngx-mask';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TakeOverComponent } from './take-over/take-over.component';
import { EditRestrictionComponent } from './edit-restriction/edit-restriction.component';


const routes = [
  {
    path: 'admin/forms/add',
    component: AddComponent,
    canActivate: [AuthGuard],
    resolve: {
      roles: RolesService,
      setting: SettingsService,
    },
    data: { key: "event-settings" },
  },
  {
    path: 'admin/forms/edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard],
    canDeactivate: [DeactivateGuard],
    resolve: {
      roles: RolesService,
      setting: SettingsService,
      chat: ChatService
    }
  },
];

@NgModule({
  declarations: [AddComponent, TakeOverComponent, EditRestrictionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FieldsComponentModule,
    FieldsModule,
    FormfieldModule,
    EditorModule,
    NgxMaskModule.forRoot()
  ],
  providers: [RolesService, SettingsService]
})
export class AddModule {
}
