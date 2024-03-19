import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { CommonService } from 'app/_services';

@Component({
  exportAs: "dynamicForm",
  selector: "app-dynamic",
  template: `
  
  <form  *ngIf="type =='field' "  fxLayout="row" fxLayoutAlign="start" fxFlex="1 0 auto"   [formGroup]="group"    >
       <div fxLayout="row wrap" *ngFor="let data of  dynamicdata "> 
            <div *ngIf="data.dbsettings.show_as =='select'"> 
                <mat-form-field class="w-100-p"   appearance="outline">
                <mat-label>{{field.field_label}}</mat-label>
                      <mat-select
                            formControlName="selectfield"
                            (ngModelChange)="onChange($event)" multiple>
                          <mat-option *ngFor="let options of  dynamiclistdata.listinfo" [value]="options.id" >{{options.name}}</mat-option>
                      </mat-select>
                 </mat-form-field>    
            </div>
            <div *ngIf="data.dbsettings.show_as =='radio'" fxLayout="row"  fxLayout.lt-md="column" fxLayoutGap="20px">
                 <mat-label>{{field.field_label}}</mat-label>
                   <mat-radio-group aria-label="radio"  (ngModelChange)="onChange($event)" formControlName='radiofields' >
                      <mat-radio-button class="example-radio-button"    *ngFor="let options of dynamiclistdata.listinfo" [value]="options.id">
                       {{options.name}}
                      </mat-radio-button>
                   </mat-radio-group>
            </div>
            <div *ngIf="data.dbsettings.show_as =='autocomplete'" fxLayout.lt-md="column" fxLayoutGap="20px">
                <mat-label>{{field.field_label}}</mat-label>
                  <mat-form-field class="example-full-width" >
                        <input type="text" name="autocompletefield" (ngModelChange)="onChange($event)"  formControlName="autocompletefield" aria-label="Number" matInput [matAutocomplete]="auto">
                          <mat-autocomplete #auto="matAutocomplete" fxFlex>
                            <mat-option  *ngFor="let options of dynamiclistdata.listinfo" [value]="options.name">
                            {{options.name}}
                          </mat-option>
                        </mat-autocomplete>
                </mat-form-field>
           </div>
           <div *ngIf="data.dbsettings.show_as =='checkbox'" fxLayout.lt-md="column" fxLayoutGap="20px">
            <mat-label>{{field.field_label}}</mat-label>
            <div *ngFor="let options of dynamiclistdata.listinfo">
                <mat-checkbox [checked]="isChecked(options.id)" class="example-margin" (change)="onChange1($event,options.id)" [value]="options.id" >{{options.name}}</mat-checkbox>
            </div>
           </div>
      </div>
  </form>  
    <form  fxLayout="row" fxLayoutAlign="start" fxFlex="1 0 auto" class="app-dynamic"  [formGroup]="group"  *ngIf="type == 'dynForm' "  (submit)="onSubmit($event)" >
      <h4>{{field.description}}</h4>
         <div fxLayout="row wrap" *ngFor="let data of  dynamicdata ">
              <div *ngIf="data.dbsettings.show_as =='radio'" fxLayout="row"  fxLayout.lt-md="column" fxLayoutGap="20px">
                 <mat-label>{{field.field_label}}</mat-label>
                   <mat-radio-group aria-label="radio"  (ngModelChange)="onChange($event)" formControlName='radiofields' >
                      <mat-radio-button class="example-radio-button"    *ngFor="let options of dynamiclistdata.listinfo" [value]="options.id">
                       {{options.name}}
                      </mat-radio-button>
                   </mat-radio-group>
               </div>
               <div *ngIf="data.dbsettings.show_as =='select'">
                  <mat-form-field appearance="outline" fxLayout="row" floatLabel="always" fxFlex class="w-100-p" >
                    <mat-label>{{field.field_label}}</mat-label>
                     <mat-select name="selectfield" formControlName="selectfield" id="selectfield" [(ngModel)]="fieldContent" (ngModelChange)="onChange($event)" multiple>  
                       <mat-option *ngFor="let options of  dynamiclistdata.listinfo" (selected)="isChecked1(options.id)" [value]="options.id">
                        {{options.name}}
                       </mat-option>
                     </mat-select>
                  </mat-form-field>
               </div>
               <div *ngIf="data.dbsettings.show_as =='autocomplete'" fxLayout.lt-md="column" fxLayoutGap="20px">
                    <mat-label>{{field.field_label}}</mat-label>
                      <mat-form-field class="example-full-width" >
                        <input type="text" name="autocompletefield" (ngModelChange)="onChange($event)"  formControlName="autocompletefield" aria-label="Number" matInput [matAutocomplete]="auto">
                          <mat-autocomplete #auto="matAutocomplete" fxFlex>
                             <mat-option  *ngFor="let options of dynamiclistdata.listinfo" [value]="options.name">
                             {{options.name}}
                              </mat-option>
                            </mat-autocomplete>
                     </mat-form-field>
               </div>
               <div *ngIf="data.dbsettings.show_as =='checkbox'" fxLayout.lt-md="column" fxLayoutGap="20px">
                  <mat-label>{{field.field_label}}</mat-label>
                     <div *ngFor="let options of dynamiclistdata.listinfo">
                         <mat-checkbox [checked]="isChecked(options.id)" class="example-margin" (change)="onChange1($event,options.id)" [value]="options.id" >{{options.name}}</mat-checkbox>
                     </div>
              </div>
         </div>   
    </form>
  `,
  styles: []
})
​
export class DynamicComponent implements OnInit {
  
  field                           : any;
  type                            : string;
  usresdata                       :any =[];
  group                           : FormGroup;
  fieldContent                    : any = {};
  otherFieldsJson                 : any;
  dynamicdata                     : any = [];
  dynamiclistdata                 : any = [];
  Checkeditems                    : any = [];
  public listFields               : FormArray;
  public keysFormFieldData        : any;
  public url                      : string;
  public newFieldContent          : any = [];
  sendListInfo                    : string;
  fieldContents                   : any;
  public params                   : object = {table :"",category_type:"",roles:""};
  table                           = "";
  category_type                   = "";
  roles                           = "";
  id                              = "";
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  /* =============== Auto Complete vars =============== */
  filteredOptions: Observable<string[]>;  
​
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService:CommonService,
    private  dynamiclist :CommonService) { }
​
  ngOnInit() {​

    this.group = this._formBuilder.group({
      selectfield : new FormControl(''),
      autocompletefield : new FormControl(''),
      checkboxfield : new FormControl(''),
      radiofields : new FormControl(''),
    });
    if(this.field.field_form_type !=='F'){
      this.otherFieldsJson = typeof this.field.field_content=== 'string' ? JSON.parse(this.field.field_content) : this.field.field_content;
      this.dynamicdata = Array.of(this.otherFieldsJson);
      this.table  = this.dynamicdata[0].dbsettings.table;  
    }
    else{
      this.dynamicdata = Array.of(this.field.content);
      this.table       = this.dynamicdata[0].dbsettings.table;  
    }

    // stroed the data from  json variables 
    if(this.table !== undefined){
      if( this.table == 'category'){
        this.category_type = this.dynamicdata[0].dbsettings.category_type.join(','); 
      }
      else{
        this.roles = this.dynamicdata[0].dbsettings.category_type.join(',');
      }
    }
    this.params ={"table":this.table,"category_type":this.category_type,"roles":this.roles}   // created the json variables for access the data
    this.dynamiclist.getdynmaiclist(this.params).then(res => { 
      this.dynamiclistdata = res;

    //  check that dafault value is null or undefined
    if(this.field.field_form_type=='F'){
         if(this.field.content.extra_field_content.defaultValue !="" && this.fieldContent!= null ){
            this.fieldContent = JSON.parse( this.field.content.extra_field_content.defaultValue);
          } 
         else{
                this.fieldContent= this.dynamiclistdata.listinfo;
                
             }
    }
    else{
      if(this.otherFieldsJson.extra_field_content.defaultValue !="" && this.fieldContent!= null ){
        this.fieldContent = this.otherFieldsJson.extra_field_content.defaultValue;
      } 
      else{
        if(this.field.field_value !== "" && this.field.field_value != undefined){
          
           let tmpdata = this.field.field_value.split(',');
           for(let indexs  of tmpdata){
            let field_values =indexs.replace(/[\[\]']+/g,'');
           this.usresdata.push(field_values);
           }
           
          //  let data =this.usresdata.map(Number)
           let data  = this.usresdata.filter(e => typeof e === 'number')
           
          this.fieldContent= typeof this.field.field_value === "string" ? data: JSON.parse(this.field.field_value);
          
        }
        else{
          this.fieldContent= this.dynamiclistdata.listinfo;
          
         }
       
      } 
    }
     
 
   this.group.patchValue(this.dynamiclistdata.listinfo)
    this.group.controls.selectfield.setValue(this.fieldContent);
    for(var index in this.fieldContent){
      if(this.field.field_form_type !=='F'){
          if(this.field.field_value !="" && this.field.field_value != undefined){
              this.Checkeditems.push(this.fieldContent[index]);
      } 
           else{
            this.Checkeditems.push(this.fieldContent[index].id );
           }
      }else{
          this.Checkeditems.push(this.fieldContent[index])
      }  //selecetd checkbox  default value  is stroed here
    }
    this._commonService.resetMataFieldsObservable.subscribe(data =>
    {
      this.group.reset();
    });

    });
  }
​
​
  isChecked(id){
    //  check that dafault value is  undefined
    if(this.fieldContent.length > 0 && this.field.field_form_type !=='F' ){
      if(this.field.field_value !==""  && this.field.field_value != undefined){
        return this.fieldContent.some(item => item == id);   
      }
      else{
        return this.fieldContent.some(item => item.id == id);   
      }
        //  set defaults values according to the id to the dynamic fields
    }
    else{
    if(this.fieldContent.length > 0 && this.field.field_value != "" ){
      
      return this.fieldContent.some(item => item == id);     //  set defaults values according to the id to the dynamic fields
      }
    }
  }
​
​
  onChange1(event ,value){
   
    if (event.checked){
      this.Checkeditems.push(value); //if value is not  checked..
    
    } 
    if (!event.checked){
      let index = this.Checkeditems.indexOf(value);
      if (index > -1){
        this.Checkeditems.splice(index, 1); //if value is checked ...
       
      }
    }
 
    this.dynamiclist.setdynamicdata(this.Checkeditems);  //service  is cal for send the selecetd data
    
    //Set value with field id
    let filterObj = {field_id:this.field.id,field_value:'',field_type:this.field.field_type || 'dynamic'};
    this.sendListInfo     = this.Checkeditems.join();
    filterObj.field_value = this.sendListInfo;
    this.dynamiclist.filterMetaFields.next(filterObj);
   }
​
  onChange(fieldValue) {
    let filterObj = {field_id:this.field.id,field_value:'',field_type:this.field.field_type || 'dynamic'};
    if(Array.isArray(fieldValue) && fieldValue.length>0){
      this.sendListInfo     = fieldValue.join();
      this.dynamiclist.setdynamicdata(this.sendListInfo);    
      //filterObj.field_value = JSON.stringify(this.sendListInfo);
      filterObj.field_value = this.sendListInfo;
    }
    this.dynamiclist.filterMetaFields.next(filterObj);
  }
}