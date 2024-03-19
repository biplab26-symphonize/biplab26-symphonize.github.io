import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonUtils } from 'app/_helpers';
import { CommonService, UsersService } from 'app/_services';

@Component({
  selector: 'edit-usermeta',
  templateUrl: './usermeta.component.html',
  styleUrls: ['./usermeta.component.scss']
})
export class UsermetaComponent implements OnInit {

  @Input() MetaUploadInfo: any;
  @Input() formGroup:FormGroup;
  @Input() field:any;
  @Output() metaUploaded=new EventEmitter<object>();
  DynamicFieldType :any;
  fieldConfig: any;
  fieldConfigValues:any;
  dynamicFieldMeta: any[] = [];
  DynamicFieldData : [];
  category_name : any[]  =[]
  type:any;
  public uploadedResponse:any={};
  currentselectedvalue :any;
  
  constructor(
    private _commonService:CommonService,
    private userServices : UsersService
  ) { }

  ngOnInit() {
    if(this.MetaUploadInfo.type == 'field'){
      this.type = this.MetaUploadInfo.type;
    }

    //Get Dynamic field values and bind it to formgroup
    this._commonService.filterMetaObservable.subscribe(metadata=>{
      if(metadata!==null && metadata.field_type=='dynamic'){
        let itemexists = this.dynamicFieldMeta.map(item=>{return item.field_id}).indexOf(metadata.field_id);
        if(itemexists!==-1) {
          this.dynamicFieldMeta[itemexists]={field_id:metadata.field_id,field_value:metadata.field_value};
        }
        else{
          this.dynamicFieldMeta.push({field_id:metadata.field_id,field_value:metadata.field_value});
        }
      }
      if( typeof this.dynamicFieldMeta !== 'undefined' && this.dynamicFieldMeta.length > 0){
        let fieldvalues =this.dynamicFieldMeta[0]. field_value.replace(/^"(.*)"$/, '$1');
        //call the service   for get the category name 
        this.userServices.getProfileValue(fieldvalues).subscribe(res => { 
          for( let i=0; i<res.data.length-1;i++){
            this.category_name.push(res.data[i].category_name); 
          }
          this.dynamicFieldMeta[0].field_value=this.category_name.toString();             
        });     
      }
    });
  }

  public validateUserMetaForm(isSubmit:boolean){
    if (isSubmit === true) {
       if(this.formGroup.valid){
        let value     = this.formGroup.value;       
        let usermeta  = [];
        this.fieldConfig.forEach(field=> {
          let field_value = (value[field.field_name] instanceof Array) ? value[field.field_name].toString() : value[field.field_name];
          if(field_value!==undefined && field_value!==''){
            if(field.field_value == 'checkbox'){
              usermeta.push({
                'field_id': field.id,
                'field_value': JSON.stringify(this.DynamicFieldData)  
              });
            }
            else{
              usermeta.push({
                'field_id': field.id,
                'field_value': field_value
              });
            }
          } 
        });        
        const finalusermeta = [...usermeta, ...this.dynamicFieldMeta];
        this.metaUploaded.emit({'usermeta':finalusermeta})
      }
      else{
        CommonUtils.validateAllFormFields(this.formGroup);
      }
    }
  }

  public fillUserMetaForm(fieldConfig,usermeta:any){
    
    fieldConfig.forEach(field => {
      usermeta.forEach(meta=> {
        //assign value if field ids are same else no change in fieldconfig
        if(field.id===meta.field_id){
          if(field.field_type == 'dynamic'){
            this.setDynamicFieldValues({fieldInfo:field,metaInfo:meta});
          }
          //Checkbox Y/N Convert to true/false
          if(meta.field_type == 'checkbox'){
            field.field_value = meta.field_value == "Y" ? true : false;
          }
          else{
            field.field_value = meta.field_value;
          }
        }
      });
    });
    this.fieldConfig = fieldConfig;
  }
  //Set Dynamic Fields Values 
  setDynamicFieldValues(dynamicFieldsInfo:any={}){
    this.DynamicFieldType = JSON.parse(dynamicFieldsInfo.fieldInfo.field_content);
    if(this.DynamicFieldType && this.DynamicFieldType.dbsettings.show_as == 'checkbox'){
      dynamicFieldsInfo.fieldInfo.field_value = this.currentselectedvalue || [];
    }
    return dynamicFieldsInfo.fieldInfo;
  }

}
