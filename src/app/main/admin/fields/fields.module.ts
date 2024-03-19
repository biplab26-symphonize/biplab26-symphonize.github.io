import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { AddComponent } from './add/add.component';
import { ImportComponent } from './import/import.component';
import { ListComponent } from './list/list.component';
import { MaterialModule } from 'app/main/material.module';
import { ChatService, FieldsService, SettingsService } from 'app/_services';
import { FileSaverModule } from 'ngx-filesaver';
import { ColorPickerModule } from 'ngx-color-picker';
import { EditorModule } from '@tinymce/tinymce-angular';
 
const routes = [
  { 
      path          : 'admin/fields/list', 
      component     : ListComponent,
      canActivate   : [AuthGuard],
      resolve       : { fields: FieldsService }
  },
  {
      path          : 'admin/fields/trash',
      component     : ListComponent,
      canActivate   : [AuthGuard],
      resolve       : { fields : FieldsService },
      data          : { trash:1 }
  },
  { 
      path          : 'admin/fields/add', 
      component     : AddComponent, 
      canActivate   : [AuthGuard]
  },
  { 
      path          : 'admin/fields/edit/:id', 
      component     : AddComponent, 
      canActivate   : [AuthGuard],
      //canDeactivate: [DeactivateGuard],
      resolve       : {field : FieldsService, chat: ChatService}
  },
  { 
      path          : 'admin/fields/import', 
      component     : ImportComponent, 
      canActivate   : [AuthGuard]
  },
];

@NgModule({
  declarations: [
          ListComponent, 
          AddComponent, 
          ImportComponent
  ],
  imports: [
		RouterModule.forChild(routes),
        MaterialModule,
        FileSaverModule,
        FuseSharedModule,
        ColorPickerModule,
        FuseConfirmDialogModule,
        EditorModule
  ],
  providers: [
        FieldsService,
      SettingsService
    ]
})
export class FieldsModule {
 }
