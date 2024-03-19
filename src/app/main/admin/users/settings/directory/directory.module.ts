import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryComponent } from './directory.component';
import { MaterialModule } from 'app/main/material.module';
import { OptionsList, CommonService, UsersService, RolesService } from 'app/_services';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatOptionSelectAllModule } from 'app/layout/components/mat-option-select-all/mat-option-select-all.module';
@NgModule({
  declarations: [DirectoryComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    MatOptionSelectAllModule
  ], 
  exports:[
    DirectoryComponent
  ],
  providers: [OptionsList, CommonService, RolesService, UsersService]
})
export class DirectoryModule { }

