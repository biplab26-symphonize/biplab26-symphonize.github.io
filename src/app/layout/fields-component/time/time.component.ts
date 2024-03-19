import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { CommonService } from 'app/_services';



@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styles: [`
  .all-entry-tag{
    max-width: 100%;
    margin:0 4px;
  }
`],
  providers: []
})
export class TimeComponent implements OnInit {


  hour 				     	 : any;
  minutes 		         : any;
  twentyfourhour 		 : any;
  twentyfourminutes 	 : any;
  field            : any;
  group            : FormGroup;
  type             : string;
  fieldContent     : any;
  timezonevalue    : any;
  getdata          : any;
  editeddata       : any;
  edited_dataes    : any;
  time_format      : any;
  time_zoneformat  : any;
  currenttime      : any;
  timevalue        : Date | undefined = new Date()
  minTime          : Date = new Date();
  maxTime          : Date = new Date();
  structure_format : any;
  hours            : any;
   minute          : any;
   twentyfourhours : any ;
   twentyfourminute : any ;
   twelvehoursName :any =[];
   twenty_four_Name : any =[];

  @Output() filterMeta    = new EventEmitter<any>();
  
  constructor(private fb: FormBuilder,private commonService :CommonService) { 
    this.minTime.setHours(1);
      this.minTime.setMinutes(0);
      this.maxTime.setHours(12);
      this.maxTime.setMinutes(59);}

  ngOnInit() {
    let fieldgroup={};

     console.log(this.field);
           if(this.type == 'field' || this.type == 'resident' || this.type=='dynForm'){
    
                this.fieldContent = typeof this.field === 'string' ? JSON.parse(this.field) : this.field;
                this.time_zoneformat=this.fieldContent.content.extra_field_content.time_zone;
                this.time_format=this.fieldContent.content.extra_field_content. time_format;
                this.structure_format = this.fieldContent.content.extra_field_content.text_format;

            if(this.fieldContent.content.extra_field_content. time_format =='twelve' &&  this.fieldContent.content.extra_field_content.text_format == 'text') {
              console.log(this.fieldContent.content.extra_field_content.dafaultValue.split(':'));
                this.getdata=this.fieldContent.content.extra_field_content.dafaultValue.split(':');               
                this.hour =this.getdata[0];
                this.minute =this.getdata[1];
                this.timezonevalue = this.getdata[2];
                if(this.fieldContent.content.extra_field_content. time_format == 'twelve'){
                 
                  this.twelvehoursName.push({'type':'hours','label': this.fieldContent.form_element_id+'hours','id':this.fieldContent.form_element_id},{'type':'minutes','label':this.fieldContent.form_element_id+'minutes','id':this.fieldContent.form_element_id},{'type':'time_zone','label':this.fieldContent.form_element_id+'time_zone','id':this.fieldContent.form_element_id});
                             
                  this.twelvehoursName.forEach(input_template=>{
                    fieldgroup[input_template.label] = new FormControl('');  
                  }) 
                
                } 
                this.group = new FormGroup(fieldgroup); 
            }
            if(this.fieldContent.content.extra_field_content. time_format =='twenty-four' && this.structure_format == 'text'){
                let getdata   =this.fieldContent.content.extra_field_content.dafaultValue.split(':');  
                this.twentyfourhour = getdata[0];
                this.twentyfourminutes =getdata[1];
                if(this.fieldContent.content.extra_field_content. time_format =="twenty-four"){
                  this.twenty_four_Name.push({'type':'twenty_four_hours','label': this.fieldContent.form_element_id+'twenty_four_hours','id':this.fieldContent.form_element_id},{'type':'twenty_four_minutes','label':this.fieldContent.form_element_id+'twenty_four_minutes','id':this.fieldContent.form_element_id},);  
                  this.twenty_four_Name.forEach(input_template=>{
                    fieldgroup[input_template.label] = new FormControl('');  
                  })
                }
                
            this.group = new FormGroup(fieldgroup);
            }

            if(this.fieldContent.content.extra_field_content. time_format =='twelve' &&  this.fieldContent.content.extra_field_content.text_format == 'dropdown') {
                    this.createControl();
            }else{

              if(this.fieldContent.content.extra_field_content. time_format =='twenty-four' &&  this.fieldContent.content.extra_field_content.text_format == 'dropdown'){
                this.createControl();
              }
            }

           
      }
   
      
 }
   

   hoursValue($event,id){
     console.log(id);
    console.log($event.target.value);
    let  timeValue =[]
  
    timeValue.push($event.target.value,this.minute,this.timezonevalue)      
         let data =timeValue.join(); 
         this.commonService.setdynamicdata({'form_value':data.replace(/,/g, ':'),'id':id});
   }
   

   
  minutesValue($event,id){
    console.log(id);
    console.log($event.target.value);
    let  timeValue =[]
    timeValue.push(this.hour,$event.target.value,this.timezonevalue);   
    let data =timeValue.join(); 
    this.commonService.setdynamicdata({'form_value':data.replace(/,/g, ':'),'id':id})
  }

  twentyfourhoursValue($event,id){
    let  timeValue =[]
        timeValue.push($event.target.value,this.twentyfourminutes)
    let data =timeValue.join(); 
    this.commonService.setdynamicdata({'form_value':data.replace(/,/g, ':'),'id':id})
  }
  twentyfourminutesValue($event,id){
    let  timeValue =[]
    timeValue.push(this.twentyfourhour, $event.target.value)
    let data =timeValue.join(); 
    console.log(data);
    this.commonService.setdynamicdata({'form_value':data.replace(/,/g, ':'),'id':id})
  }


    // for radio button
  OnradioChange($event,id){
    console.log(id);
      if(this.time_format =='twelve'){
         let  timeValue =[]
         timeValue.push(this.hour,this.minute,$event.value)
         let data =timeValue.join(); 
         this.commonService.setdynamicdata({'form_value':data.replace(/,/g, ':'),'id':id})
       }
   }
    //  for select box 
    Onselect($event,id){
      console.log($event)
      console.log(this.minute)
      if(this.time_format=='twelve'){
        let  timeValue =[]
        timeValue.push(this.hour,this.minute,$event.value)
        let data =timeValue.join(); 
        this.commonService.setdynamicdata({'form_value':data.replace(/,/g, ':'),'id':id})
      }
      
  }
 
    

  createControl() {
        
            let defaultValue = (this.field.field_value) ? this.field.field_value :this.fieldContent.content.extra_field_content.dafaultValue ;
            console.log(this.fieldContent.content.extra_field_content.text_format);
            defaultValue = this.fieldContent.content.extra_field_content.text_format == 'dropdown' ?  this.fieldContent.content.extra_field_content.dafaultValue :'';
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

}
