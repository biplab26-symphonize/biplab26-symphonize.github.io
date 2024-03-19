import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/main/material.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FuseSharedModule } from '@fuse/shared.module';
import { ViewformComponent } from './viewform.component';
import { AuthGuard } from 'app/_guards';
import { RouterModule } from '@angular/router';
import { FormsService, ProfileService } from 'app/_services';
import { ElementsComponent } from './elements/elements.component';
import { ListFormFieldModule } from 'app/layout/components/form-fields/list-form-field/list-form-field.module';
import { DynamicFormFieldsModule } from 'app/layout/components/form-fields/dynamic-form-fields/dynamic-form-fields.module';
import { RatingModule } from 'ng-starrating';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ConfirmationmsgComponent } from './confirmationmsg/confirmationmsg.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { BreadcumbModule } from 'app/layout/components/breadcumb/breadcumb.module';
 
const routes = [
  { 
    path: 'forms/view/:slug', 
  
    component   : ViewformComponent, 
    canActivate : [AuthGuard], 
    resolve     : {form: FormsService,}
  },
  { 
    path: 'forms/view/Showformentry/:id', 
  
    component   : ConfirmationmsgComponent, 
    canActivate : [AuthGuard], 
    resolve     : {form: FormsService,}
  }
];

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [ViewformComponent, ElementsComponent, ConfirmationmsgComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    MaterialModule,
    NgxMaskModule.forRoot(maskConfig),
    MatAutocompleteModule,
    ListFormFieldModule,
    DynamicFormFieldsModule,
    RatingModule,
    SignaturePadModule  ,
    FusePipesModule,
    BreadcumbModule
    

  ],
  exports:[ElementsComponent],
  entryComponents:[ElementsComponent],
  providers : [FormsService,ProfileService]
})
export class ViewformModule { }
