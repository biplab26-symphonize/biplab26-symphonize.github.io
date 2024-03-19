import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/material.module';
import { AddComponent } from './add.component';
import { RolesService } from 'app/_services';
import { MediaModule } from 'app/layout/components/page-editor/media/media.module';
import { EditorModule } from 'app/layout/components/page-editor/editor/editor.module';
import { MatOptionSelectAllModule } from 'app/layout/components/mat-option-select-all/mat-option-select-all.module';

const routes = [
  { 
    path          : 'admin/pages/add', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    resolve  : {
      roles: RolesService
    }
  },
  { 
    path          : 'admin/pages/edit/:id', 
    component     : AddComponent, 
    canActivate   : [AuthGuard],
    canDeactivate : [DeactivateGuard],
    resolve  : {
      roles: RolesService
    }
  },
];

@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    MediaModule,
    EditorModule,
    MatOptionSelectAllModule
  ],
  providers:[DeactivateGuard]
})
export class AddModule { }
