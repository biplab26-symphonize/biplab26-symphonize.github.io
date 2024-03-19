import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FavoriteEventComponent } from './favorite-event.component';
import { FuseSharedModule } from '@fuse/shared.module';



@NgModule({
  declarations: [FavoriteEventComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule  ,
    FuseSharedModule,
  ],
  entryComponents: [
    FavoriteEventComponent
  ],
  exports: [
    FavoriteEventComponent
  ],
})
export class FavoriteEventModule { }
