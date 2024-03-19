import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/_guards';
import { LibraryComponent } from './library.component';
import { MediaService, CommonService } from 'app/_services';
import { MaterialModule } from 'app/main/material.module';

const routes = [
  { 
    path: 'admin/media/library', 
    component     : LibraryComponent, 
    canActivate   : [AuthGuard] ,
    resolve       : {media : MediaService}
  }
];
@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule
  ],
  providers :[MediaService,CommonService]
})
export class LibraryModule { }
