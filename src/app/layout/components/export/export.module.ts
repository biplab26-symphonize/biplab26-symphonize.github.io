import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { ExportComponent } from './export.component';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
  declarations: [ExportComponent],
  imports: [
    FuseSharedModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule
  ],
  entryComponents: [
    ExportComponent
  ],
})
export class ExportModule { }
