import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers';
import { CommonService, RolesService } from 'app/_services';
import { Fields } from 'app/_models';


export class ListItemSimplified {
  id: string;          
  name: string;         
}

@Component({
  selector: 'app-dynamic-form-fields',
  templateUrl: './dynamic-form-fields.component.html',
  styleUrls: ['./dynamic-form-fields.component.scss']
})
export class DynamicFormFieldsComponent implements OnInit {
 
  @Input() Fields: any[] = []; //edit list ifno array
  @Input() formSettings: any;
  @Input() listName: any={};
  @Output() resetList = new EventEmitter<number>(); //Send reste count value to parent 
  @Output() updatelistInfo1 = new EventEmitter<any>(); //Send updated lisfield

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  public optionsForm        : FormGroup; 
  public dbsettings         : FormArray;
  filteredLists             : any[] = [];
  sendListInfo              : any[] = [];
  usersJson                 : any[] = [];
  dynamiclistdata           : any   = [];
  checkboxfielderror        : any   = false;
  Checkeditems              : any   = [];
  public params             : object = {table :"",category_type:"",roles:""};
  table                     = "";
  category_type             = "";
  roles                     = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private dynamiclist :CommonService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  
  
  ngOnInit() {
    this.usersJson = Array.of(this.Fields); //access the all fields data .. 
    this.table = this.usersJson[0].dbsettings.table;
    
    if(this.table !== undefined){
        if( this.table == 'category'){
            this.category_type = this.usersJson[0].dbsettings.category_type.join(','); 
        }
        this.roles = this.usersJson[0].dbsettings.category_type.join(',');
    }
  
   this.params ={"table":this.table,"category_type":this.category_type,"roles":this.roles}   // created the json variables for access the data
  
    //Convert Form Settings strings to json
    if(this.formSettings){
      let formSettings;
      formSettings      = CommonUtils.getStringToJson(this.formSettings);
      this.formSettings = formSettings.formsettings;
    }
    this.optionsForm = this._formBuilder.group({
      selectfields        : new FormControl(''),
      autocompletefield  : new FormControl(''),
      checkboxfield      : new FormControl(''),
      radiofields        : new FormControl('')
    });

    // dynamicfield service is cal here
     this.dynamiclist.getdynmaiclist(this.params).then(res => { 
       this.dynamiclistdata = res;
     });
  }

  // CheckBox selection event
  onChange1(event ,value){
    
    if (event.checked) {

      this.Checkeditems.push(value); //if value is not  checked..
    } 
    if (!event.checked) {

      let index = this.Checkeditems.indexOf(value);

      if (index > -1) {

        this.Checkeditems.splice(index, 1); //if value is checked ...
      }
    }    
    let listfieldValues = {form_element_id:this.Fields.values,form_element_value:JSON.stringify(this.Checkeditems),dynamicformValid:this.optionsForm.valid};
    this.updatelistInfo1.emit(listfieldValues);
 }

  //Submit form on every field change
   onChange(newValue) {
    this.sendListInfo   = newValue;
    let listfieldValues = {form_element_id:this.Fields.values,form_element_value:JSON.stringify(this.sendListInfo),dynamicformValid:this.optionsForm.valid};
    this.updatelistInfo1.emit(listfieldValues);
}

}
