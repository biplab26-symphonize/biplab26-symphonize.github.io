import { Component, OnInit, ViewChild, EventEmitter, Output  } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService, AppConfig } from 'app/_services';

@Component({
  selector: 'app-signature',
   template: `<div  [ngClass]="fieldContent.extra_field_content.col_class" *ngIf="type == 'field' || type == 'resident'">
                <mat-label>{{field.description}}</mat-label>
                <signature-pad [options]="signaturePadOptions"   format="base64" (onBeginEvent)="drawStart()" (onEndEvent)="drawComplete()"></signature-pad>  
              </div>
              <div  *ngIf="type == 'dynForm'" class="All-half-full w-100-p all-entry-tag" >
                <mat-label>{{field.description}}</mat-label>
                <img [src]=" field.content.extra_field_content.dafaultValue "   alt="{{img}}" height="100" width="100" />   
              </div>`,
            styles: [`
            .all-entry-tag{
              max-width: 100%;
              margin:0 4px;
            }
          `]
})
export class SignatureComponent implements OnInit {

 
  field: any;
  group: FormGroup;
  type: string;
  fieldContent: any;
   Imgurl :any;
  @Output() filterMeta    = new EventEmitter<any>();
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  uploadInfo: any={
    'avatar':{'type':'defaultprofile','media_id':0,'url':"",'apimediaUrl':'media/upload'},
  };
  
  private signaturePadOptions: Object = { 
    'minWidth': 5,
    'canvasWidth': 500,
     'backgroundColor':'#D3D3D3',
    'canvasHeight': 300
  };

  
  constructor(private fb: FormBuilder,
    private _commonService:CommonService) {
  }

  ngOnInit() {
   
    if(this.type == 'field' || this.type == 'resident' || this.type == 'dynForm'){
        this.fieldContent = typeof this.field === 'string' ? JSON.parse(this.field) : this.field; 
        console.log("signatuer",this.fieldContent.content.extra_field_content.dafaultValue);
         this.Imgurl =this.fieldContent.content.extra_field_content.dafaultValue; 
         this.uploadInfo.avatar.url= ( this.Imgurl? AppConfig.Settings.url.mediaUrl +  this.Imgurl:"");
          this.field.content.extra_field_content.dafaultValue = this.uploadInfo.avatar.url;
          this.createControl();
    }      
  }

  createControl() {
    let defaultValue = (this.field.field_value) ? this.field.field_value :  this.field.content.extra_field_content.dafaultValue;
    let residentType = (this.type == 'resident' ? '' : this.field.field_required);
    const control = this.fb.control(
      defaultValue,
      this.bindValidations(residentType, this.field.field_pregmatch)
    );
    this.group.addControl(this.field.field_name, control);    
  }

  bindValidations(validationRequired = null, validationRegexmatch = null) {
    if(validationRequired === 'Y' || validationRegexmatch != '') {
      const validList = [];
      let tmpValidationRequired, tmpValidationRegexmatch;

      if(validationRequired === 'Y') {
        tmpValidationRequired = Validators.required;
        validList.push(tmpValidationRequired);
      }

      if(validationRegexmatch != '') {
        tmpValidationRegexmatch = Validators.pattern(validationRegexmatch);
        validList.push(tmpValidationRegexmatch);
      }
      return Validators.compose(validList);
    }
  } 

  drawComplete() {
    console.log(this.signaturePad.toDataURL());
  }

}
