import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { EntriesComponent } from './entries.component';
import { FormentriesService, FormsService, SettingsService } from 'app/_services';
import { EditentryComponent } from './editentry/editentry.component';
import { FieldsModule } from '../../fields/fields.module';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { MaterialModule } from 'app/main/material.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ViewEntriesComponent } from './view-entries/view-entries.component';
import { NgxMaskModule } from 'ngx-mask';
import { DialogComponent } from './dialog/dialog.component';
import { ExportEntriesComponent } from './export-entries/export-entries.component';

const routes = [
    {
      path        : 'admin/forms/entries',
      component   : EntriesComponent,
      canActivate : [AuthGuard],
      resolve     : {
                      formentry : FormentriesService,
                      forms     : FormsService
                    },
      data		    : { 
                     
                      entryid: 'entry_id',
                       key : "form-settings",
                   
                     } 
    },
    {
      path        : 'admin/forms/entries/:form_id',
      component   : EntriesComponent,
      canActivate : [AuthGuard],
      resolve     : {
                      formentry : FormentriesService,
                      forms     : FormsService
                    },
      data		    : { 
                       trash: '',
                      form_id: 'form_id',
                       key : "form-settings",
                   
                     } 
    },
  
    { 
      path		    : 'admin/entries/trash', 
      component	  : EntriesComponent, 
      canActivate	: [AuthGuard],
      resolve  	  : {formentry : FormentriesService,
                      forms   : FormsService
                    },
      data		    : { 
                      trash: 1 ,
                      entryid: 'entry_id'

                    }
    },
  
    {
      path        : 'admin/forms/entries/edit/:id',
      component   : EditentryComponent,
      canActivate : [AuthGuard],
      resolve     : {
                      formentry : FormentriesService,
                      forms     : FormsService
                    },
      data		    : { 
                     
                      entryid: 'entry_id'
                     } 
    },
    {
      path        : 'admin/entries/view/:id',
      component   : ViewEntriesComponent,
      canActivate : [AuthGuard],
      resolve     : {
                      formentry : FormentriesService,
                      forms     : FormsService
                    },
      data		    : { 
                     
                      entryid: 'entry_id',
                      key : "form-settings",
                     } 
    }
];

@NgModule({
  declarations: [EntriesComponent, EditentryComponent, ViewEntriesComponent, DialogComponent, ExportEntriesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FieldsModule,
    FieldsComponentModule,
    SignaturePadModule,
    NgxMaskModule.forRoot(),
    
  ],
  providers : [FormentriesService,FormsService,SettingsService]
})
export class EntriesModule { 

}
