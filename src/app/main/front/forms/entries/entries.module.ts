import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormentriesService, CommonService } from 'app/_services';
import { NgxMaskModule } from 'ngx-mask';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { FrontFooterModule } from 'app/layout/components/front-footer/front-footer.module';
import { ViewentryComponent } from './viewentry/viewentry.component';
import { EntriesComponent } from './entries.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { ViewworkxhubComponent } from './viewworkxhub/viewworkxhub.component';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';



const routes = [
  { 
      path      : 'forms/my-entries', 
      name      : 'Entries',
      component : EntriesComponent , 
      resolve   : {
      formentry : FormentriesService,
                  },
       data		    : { 
                trash: null ,
                entryid: 'entry_id',
       } 
},  
{ 
  
    path      : 'forms/view/entries/:id', 
    name      : 'view form',
    component : ViewentryComponent, 

},{ 
  
  path      : 'forms/view/workxhub/:id', 
  name      : 'view form',
  component : ViewworkxhubComponent, 

},    
  
];


@NgModule({
  declarations: [EntriesComponent, ViewentryComponent, ViewworkxhubComponent,],
  imports: [
    CommonModule,
    FuseSharedModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FieldsComponentModule ,
    FrontFooterModule,
    SignaturePadModule,
    FusePipesModule,
    NgxMaskModule.forRoot(),
    BreadcumbModule
  ],
  providers : [FormentriesService,CommonService]
})
export class EntriesModule { }
