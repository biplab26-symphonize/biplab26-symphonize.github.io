import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SettingsService, EventsService } from 'app/_services';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations   : fuseAnimations
})
export class SettingsComponent implements OnInit {
  public addCalendarGeneratorSetting : FormGroup;
  public EventMetaFields: any[] = [];
  public CalendarSettingsData:any = [];
  constructor(private fb : FormBuilder, 
  private _eventService  : EventsService, 
  private _matSnackBar : MatSnackBar,
  private _settingService : SettingsService) { }

  ngOnInit() {
    this.getEventMetaFields();
    this.setControls();
    let response = this._settingService.setting;
    console.log('response',response);
    this.getCalendarSettingData(response);

  }
  setControls(){
    this.addCalendarGeneratorSetting = this.fb.group({
      show_meta_filters       : this.fb.control('Y'),
      meta_fields             : this.fb.control([])
    });
  }

  //Get Meta Fields For Filter at event list
  getEventMetaFields(){
    //Get Event MetaFields
      this._eventService.getEventMetaFields({field_form_type:'E'}).subscribe(metaInfo=>{
        this.EventMetaFields  = metaInfo.data || [];
      });
  }

  saveFormValue(){
    let value = this.addCalendarGeneratorSetting.value;
    let data:any = [];
    data.push({
      "calendar_generator_setting": {
        "show_meta_filters": value.show_meta_filters,
        "meta_fields": value.meta_fields
      }
    });
    return data;
  }

  onClickSave(){
    let settingData = this.saveFormValue();
    let saveData = {
      meta_type: 'E',
      meta_key: 'calendar_generator_setting',
      meta_value : JSON.stringify(settingData)
    };      
    this._settingService.createSetting(saveData)
    .then(response =>
        {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration        : 2000
        });
        },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
                  verticalPosition: 'top',
                  duration        : 2000
          });
      });
  }

  getCalendarSettingData(response){
    
    this.CalendarSettingsData = JSON.parse(response.settingsinfo.meta_value);    
    this.CalendarSettingsData = this.CalendarSettingsData[0];
    if(this.CalendarSettingsData){
      this.addCalendarGeneratorSetting = this.fb.group({
        //Admin site Event Settings
        show_meta_filters                 : this.fb.control(this.CalendarSettingsData.calendar_generator_setting.show_meta_filters),
        meta_fields                       : this.fb.control(this.CalendarSettingsData.calendar_generator_setting.meta_fields)
      });
    }
  }

}
