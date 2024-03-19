import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatOptionSelectionChange } from '@angular/material/core';
import { CalendarGeneratorService } from 'app/_services';

import { ActivatedRoute,Router } from '@angular/router';



@Component({
  selector: 'app-format',
  templateUrl: './format.component.html',
  styleUrls: ['./format.component.scss']
})
export class FormatComponent implements OnInit {
  public formatform : FormGroup;
  @Output() formatpartData = new EventEmitter();
  @Input('tempdata')  tempdata;
  public defoultformatvalue :any;
  public getFormValue : any;
  public urlID        :any;
  constructor(private fb:FormBuilder,
  private calendarservices : CalendarGeneratorService,
  private route : ActivatedRoute,
  private _matSnackBar: MatSnackBar) { 

  this.route.params.subscribe( params => {
    this.urlID = params.id;
  });   

  }
  editdata :any ;





  ngOnInit() {
    this.formatform = this.fb.group({
      papersize    : this.fb.control('A3-L'),
      font         : this.fb.control(''), 
      font_sizing    : this.fb.control('auto_size'),
      special_event_font    : this.fb.control('font-weight: normal;'),
      holiday_font    : this.fb.control('font-weight: normal;'),
      registration_required_font    : this.fb.control('font-weight: normal;'),
      location_font    : this.fb.control('F'),
    });
    this.formatpartData.emit(this.formatform.value);
    if(this.route.routeConfig.path=='admin/calendar-generator/:id'){
      this.calendarservices.getCalendarData(this.urlID)
        .then(Response=>{
            this.calendarservices.setdynamicdata(Response.data); 
            this.getEditData(Response.data);
        },
        error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
                    verticalPosition: 'top',
                    duration        : 2000
            });
        });
    }
  }
 

  ngOnChanges()
  {
    if(this.tempdata!=undefined){
      if(this.tempdata.format !== undefined){
        this.defoultformatvalue = JSON.parse(this.tempdata.format);
        this.formatform.patchValue(this.defoultformatvalue);
        this.formatpartData.emit(this.formatform.value);
      }
      this.setediteddata();
    }
    

    
  }

  setediteddata()
  {
    if(this.editdata !== undefined){

         this.editdata = this.calendarservices.getedittemplatedata();
   let editvalue = JSON.parse(this.editdata.format);
  //  this.formatform.controls['papersize'].setValue({ papersize: editvalue.papersize})
    //  console.log(editvalue);
    console.log("editvalue",editvalue);
      this.formatform.patchValue(editvalue);
     this.formatpartData.emit(this.formatform.value);  
    }
  
  }
     


  getEditData(getData){
    this.getFormValue = getData[0].format;
    this.formatform.patchValue(JSON.parse(this.getFormValue));
    this.formatpartData.emit(this.formatform.value);
  }

  isPaperChange(event){
    this.formatpartData.emit(this.formatform.value);
  }

  isFontChange(event: MatOptionSelectionChange){
    console.log('event',event.source);
    this.formatpartData.emit(this.formatform.value);
  }

  isFontSizeChange(event){
    this.formatpartData.emit(this.formatform.value);
  }

  isSpecialEventFontChange(event){
    this.formatpartData.emit(this.formatform.value);
  }

  isHolidayFontChange(event){
    this.formatpartData.emit(this.formatform.value);
  }

  isRegistrationREquiredEventChange(event){
    this.formatpartData.emit(this.formatform.value);
  }

  isLocationDisplayChange(event){
    this.formatpartData.emit(this.formatform.value);
  }

}
