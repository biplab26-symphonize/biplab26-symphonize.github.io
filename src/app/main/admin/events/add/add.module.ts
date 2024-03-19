import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard,AdminRoleGuard, DeactivateGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

import { AddComponent } from './add.component';
import { MaterialModule } from 'app/main/material.module';
import { CommonUtils } from 'app/_helpers';
import { FieldsComponentModule } from 'app/layout/fields-component/fields-component.module';
import { OptionsList, EventcategoryService, EventsService, CommonService, ChatService} from 'app/_services';
import { AddEventResolver } from 'app/_resolvers';
import { RecurringModule } from '../recurring/recurring.module';
import { RegisterdataModule } from '../registerdata/registerdata.module';
import { EventmetaModule } from '../eventmeta/eventmeta.module';
import { AddLocationComponent } from '../locations/add/add.component';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FormfieldModule } from 'app/layout/components/form-fields/formfield.module';
import { SignageModule } from './signage/signage.module';
import { SpecialFieldsModule } from './special-fields/special-fields.module';
//editor media gallery
import { EditorGalleryModule } from 'app/layout/components/dialogs/editor-gallery/editor-gallery.module';
import { MatOptionSelectAllModule } from 'app/layout/components/mat-option-select-all/mat-option-select-all.module';
const routes = [
    {
      path        : 'admin/events/add', 
      component   : AddComponent, 
      canActivate : [AuthGuard,AdminRoleGuard],
      data        : {type : 'E'},
      resolve  	  : {
                      event         : AddEventResolver,
                      eventcategory : EventcategoryService,
                      eventMeta     : CommonService,
                    },
    },
    {
      path        : 'admin/event/add/:slug', 
      component   : AddComponent, 
      canActivate : [AuthGuard,AdminRoleGuard],
      data        : {type : 'E'},
      resolve  	  : {
                      event         : AddEventResolver,
                      eventcategory : EventcategoryService,
                      eventMeta     : CommonService,
                    },
    },
    {
      path        : 'admin/events/edit/:id', 
      component   : AddComponent, 
      canActivate : [AuthGuard],
      canDeactivate : [DeactivateGuard],
      data        : {type : 'E'},
      resolve  	  : {
                      event         : AddEventResolver,
                      eventcategory : EventcategoryService,
                      editevent     : EventsService,
                      eventMeta     : CommonService,
                      chat: ChatService
                    },
    },
];

@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    FieldsComponentModule,
    RecurringModule,
    RegisterdataModule,
    EventmetaModule,
    FormfieldModule,
    SignageModule,
    SpecialFieldsModule,
    EditorGalleryModule,
    MatOptionSelectAllModule
  ],
  providers:[
    CommonUtils,OptionsList,
    AddEventResolver,
    EventcategoryService,
    EventsService,
    CommonService
  ],
  entryComponents:[AddLocationComponent,FormFieldsComponent]
})
export class AddModule { }
