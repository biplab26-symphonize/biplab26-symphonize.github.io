import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from 'app/_services';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';

@Component({
  selector: 'app-eventmeta',
  templateUrl: './eventmeta.component.html',
  styleUrls: ['./eventmeta.component.scss']
})
export class EventmetaComponent implements OnInit {

  @Input() MetaUploadInfo : any;
  @Input() eventMetaData  : any;
  fieldformGroup          : FormGroup;
  @Output() eventMetaUploaded = new EventEmitter<object>();
  fieldConfig : any;
  type        : any;
  DynamicFieldData:any;
  DynamicFieldType : any;
  regularDistribution: string = 100/2 + '%';
  constructor(
    private fb:FormBuilder,
    private _commonService : CommonService,
    private eventbehavioursub : EventbehavioursubService) { }

  ngOnInit() {
    this.fieldformGroup=this.fb.group({
      field_id : this.fb.control(''),
      field_value : this.fb.control('')
    })

    if(this.MetaUploadInfo.type == 'field'){
      this.fieldConfig = this.MetaUploadInfo.fieldConfig ? this.MetaUploadInfo.fieldConfig :'';
      this.type = this.MetaUploadInfo.type;
    }
  if(this.eventMetaData)
  {
    this.fillEventMetaForm();
  }
  }

  public validateEventMetaForm(isSubmit:boolean){
    if (isSubmit === true) {
       if(this.fieldformGroup){
        let value = this.fieldformGroup.value;
        let eventmeta = [];
        this.fieldConfig.forEach(field=> {


          // to add dynamic field 
          
          if(field.field_type == 'dynamic'){
            // this.DynamicFieldType = JSON.parse(field.field_content)
            this.DynamicFieldData = this._commonService.getdynamicdata() ;
            console.log("this.DynamicFieldData",this.DynamicFieldData);
            // if(this.DynamicFieldType.dbsettings.show_as == 'select'){
              // console.log(field_value);
              eventmeta.push({
                'field_id': field.id,
                'field_value': this.DynamicFieldData  
              })
             
            // }
           
          }
          else{
          let field_value = (value[field.field_name] instanceof Array) ? value[field.field_name].toString() : value[field.field_name];
            if(field.field_type == 'checkbox'){
              field_value = field_value == false ? 0 : 1;
            }
            eventmeta.push({
              'field_id': field.id,
              'field_value': field_value
            })
          }
        });
        if(eventmeta.length>0){
          //On Any Recurring Changes 
          this.eventbehavioursub.EnableRecurringModal.next(true);
        }
        this.eventMetaUploaded.emit({'eventmeta':JSON.stringify(eventmeta)})
      }
    } 
  }

  fillEventMetaForm(){
   this.fieldConfig.forEach(field => {
      this.eventMetaData.forEach(meta=> {
          if(field.id == meta.field_id){
            field.field_value = meta.field_value;
          }
        });
    });
    this.fieldConfig = this.fieldConfig;
  }
}
