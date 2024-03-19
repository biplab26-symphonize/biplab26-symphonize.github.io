import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LocationService, EventcategoryService, EventsService, CommonService, CalendarGeneratorService } from 'app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
//import { MatSnackBar } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-event-selection',
  templateUrl: './event-selection.component.html',
  styleUrls: ['./event-selection.component.scss']
})
export class EventSelectionComponent implements OnInit {
  @Output() EventSelectionData = new EventEmitter();
  @Input('tempdata') tempdata;
  public locations: any = [];
  public CommonCategories: any = [];
  public categories: any = [];
  public metafields: any = [];
  public metafieldsfloor: any = [];
  public formmetafields: any;
  public metafieldsarr: any = [];
  public metafieldsfloorarr: any = [];
  public defoulteventdata
  public eventselectionform: FormGroup;
  public urlID: any;
  EventMetaFields: any[] = [];
  SelectedTeamMetafields: any = [];
  SelectedFloorMetafields: any = [];
  SelectedCategories: any[] = [];
  SelectedLocations: any[] = [];
  SelectedCommonCategories: any[] = [];
  SelectedMetafields: any[] = [];
  masterSelected: boolean;
  filterParams: any = {};
  AllFloorArr: any = [];
  AllTeamArr: any = [];
  public defoulttmpvalue: any;
  public defoulttmparray: any = [];
  public CalendarGeneratorSettings: Object = {};
  public MetaArray: any[] = [];
  public ShowMetaFilters: string = 'N';
  public eventCalendar: any;
  public commonCategories: any = [];
  constructor(private fb: FormBuilder,
    private _locationService: LocationService,
    private _eventCategoryService: EventcategoryService,
    private _calendarGeneratorService: CalendarGeneratorService,
    private _eventService: EventsService,
    private _commonService: CommonService,
    private _matSnackBar: MatSnackBar,
    private route: ActivatedRoute) {
    this.masterSelected = false;
    this.route.params.subscribe(params => {
      this.urlID = params.id;
    });

  }

  ngOnInit() {
    let calendarGeneratorSettings = this._commonService.getLocalSettingsJson('calendar_generator_setting');
    this.CalendarGeneratorSettings = calendarGeneratorSettings ? calendarGeneratorSettings[0] : {};
    if (this.CalendarGeneratorSettings && this.CalendarGeneratorSettings['calendar_generator_setting']) {
      this.ShowMetaFilters = this.CalendarGeneratorSettings['calendar_generator_setting'].show_meta_filters;

      this.MetaArray = this.CalendarGeneratorSettings['calendar_generator_setting'].meta_fields;

    }


    this.eventselectionform = this.fb.group({
      event_calendar_category: this.fb.control(''),
      common_category: this.fb.control(''),
      location: this.fb.control(''),
      categories: this.fb.control(''),
      metafields: this.fb.control(''),
      teamMeta: this.fb.control(''),
      floorMeta: this.fb.control('')
    });


    this._eventService.getEventMetaFields({ field_form_type: 'E' }).subscribe(metaInfo => {
      this.EventMetaFields = metaInfo.data || [];
      if (this.EventMetaFields.length > 0) {
        //Convert string content to Array
        this.EventMetaFields.map(metafield => {
          if (metafield.field_content) {
            metafield['floor_content'] = JSON.parse(metafield.field_content);
            metafield['team_content'] = JSON.parse(metafield.field_content);
          }
          if (metafield.field_name == 'floor') {
            this.AllFloorArr = JSON.parse(metafield.field_content);
          }
          if (metafield.field_name == 'team') {
            this.AllTeamArr = JSON.parse(metafield.field_content);
          }
        });
      }



      this.EventSelectionData.emit(this.eventselectionform.value);


    });


    if (this.route.routeConfig.path == 'admin/calendar-generator/:id') {
      this._calendarGeneratorService.getCalendarData(this.urlID)
        .then(Response => {
          this._calendarGeneratorService.setdynamicdata(Response.data);
          this.getEditData(Response.data);
        },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }

    this._eventCategoryService.getCategory({ 'column': 'category_name', 'direction': 'desc', 'status': 'A', 'category_type': 'ECL' }).then(Response => {
      this.eventCalendar = Response.data;
    });
    this.filterParams['category_type'] = 'C';
    this.filterParams['status'] = 'A';
    this._eventCategoryService.getCategory(this.filterParams).then(Response => {
      this.commonCategories = Response.data;
    });
  }

  getCategoryAndLocation(event) {
    this.filterParams['category_type'] = 'EL';
    this.filterParams['calendar_id'] = event.value.join();
    this._locationService.getLocation(this.filterParams).then(Response => {
      this.locations = Response.data;
    });

    this.filterParams['category_type'] = 'C';
    this._eventCategoryService.getCategory(this.filterParams).then(Response => {
      this.categories = Response.data;
    });
    // this.eventselectionform.patchValue({ event_calendar_category : event.value.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }
  CategoryAndLocation(calendar_id, getData: any[] = []) {
    this.filterParams['category_type'] = 'EL';
    this.filterParams['calendar_id'] = calendar_id.join();
    this._locationService.getLocation(this.filterParams).then(Response => {
      this.locations = Response.data;
    });

    this.filterParams['category_type'] = 'C';
    this._eventCategoryService.getCategory(this.filterParams).then(Response => {
      this.categories = Response.data;
    });

    this.filterParams['category_type'] = 'C';
    this.filterParams['calendar_id'] = '';
    this.filterParams['status'] = 'A';
    this._eventCategoryService.getCategory(this.filterParams).then(Response => {
      // console.log("this.commonCategories", this.commonCategories);
      this.commonCategories = Response.data;
      if (getData && getData[0].common_category !== undefined  && getData[0].common_category !== "" && this.commonCategories.length > 0) {
        this.SelectedCommonCategories = getData[0].common_category.split(',').map(Number);
        this.eventselectionform.patchValue({ common_category: this.SelectedCommonCategories.join() });
      }
    });

    if (getData && getData[0].categories !== undefined) {
      this.SelectedCategories = getData[0].categories.split(',').map(Number);
      this.eventselectionform.patchValue({ categories: this.SelectedCategories.join() });
    }
    if (getData && getData[0].location !== undefined) {
      this.SelectedLocations = getData[0].location.split(',').map(Number);
      this.eventselectionform.patchValue({ location: this.SelectedLocations.join() });
    }
    if (getData && getData[0].event_calendar_category !== undefined) {
      let event_calendar_category = getData[0].event_calendar_category.split(',').map(Number);
      this.eventselectionform.patchValue({ event_calendar_category: event_calendar_category });
    }
    // this.eventselectionform.patchValue({ event_calendar_category : event.value.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }
  getCategories(event) {
    //this.eventselectionform.patchValue({ common_category: event.value.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }
  getEditData(getData) {
    setTimeout(() => {
      let event_calendar_category = getData[0].event_calendar_category.split(',').map(Number);
      this.CategoryAndLocation(event_calendar_category, getData);
    }, 300);
  }


  ngOnChanges() {
    // this.defoulttmpvalue = this.tempdata;        
    if (this.tempdata != undefined) {
      // console.log("this.tempdata",this.tempdata);
      if(this.tempdata && this.tempdata.event_calendar_category!==undefined && this.tempdata.event_calendar_category!==''){
        let getData = [this.tempdata];
        // console.log("getData",getData);
        let event_calendar_category = getData[0].event_calendar_category.split(',').map(Number);
        this.CategoryAndLocation(event_calendar_category, getData);
      }
      
    }



  }


  //  for one bye one select checkbox
  toggle(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.SelectedCategories.push(item);
    } else {
      const index = this.SelectedCategories.indexOf(item);
      if (index >= 0) {
        this.SelectedCategories.splice(index, 1);
      }
    }
    this.eventselectionform.patchValue({ categories: this.SelectedCategories.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }


  exists(item) {

    return this.SelectedCategories.indexOf(item) > -1;
  };

  isIndeterminate() {
    return (this.SelectedCategories.length > 0 && !this.isChecked());
  };

  isChecked() {

    return this.SelectedCategories.length === this.categories.length;
  };



  toggleAll(event: MatCheckboxChange) {

    if (event.checked) {

      this.categories.forEach(row => {
        this.SelectedCategories.push(row.id)
      });


    } else {
      this.SelectedCategories.length = 0;
    }
    this.eventselectionform.patchValue({ categories: this.SelectedCategories.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);

  }



  // for   location  check all or one by one check code

  togglelocations(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.SelectedLocations.push(item);
    } else {
      const index = this.SelectedLocations.indexOf(item);
      if (index >= 0) {
        this.SelectedLocations.splice(index, 1);
      }
    }
    this.eventselectionform.patchValue({ location: this.SelectedLocations.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }

  toggleCommonCategories(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.SelectedCommonCategories.push(item);
    } else {
      const index = this.SelectedCommonCategories.indexOf(item);
      if (index >= 0) {
        this.SelectedCommonCategories.splice(index, 1);
      }
    }
    this.eventselectionform.patchValue({ common_category: this.SelectedCommonCategories.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }

  existslocations(item) {
    return this.SelectedLocations.indexOf(item) > -1;
  };

  existsCommonCategories(item) {
    return this.SelectedCommonCategories.indexOf(item) > -1;
  };

  isIndeterminatelocations() {
    return (this.SelectedLocations.length > 0 && !this.isCheckedlocations());
  };

  isIndeterminateCommonCategories() {
    return (this.SelectedCommonCategories.length > 0 && !this.isCheckedCommonCategories());
  };

  isCheckedlocations() {
    return this.SelectedLocations.length === this.locations.length;
  };
  isCheckedCommonCategories() {
    return this.SelectedCommonCategories.length === this.commonCategories.length;
  };

  toggleAlllocations(event: MatCheckboxChange) {

    if (event.checked) {
      this.locations.forEach(row => {
        this.SelectedLocations.push(row.id)
      });


    } else {
      this.SelectedLocations.length = 0;
    }
    this.eventselectionform.patchValue({ location: this.SelectedLocations.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);

  }

  toggleAllCommonCategories(event: MatCheckboxChange) {

    if (event.checked) {
      this.commonCategories.forEach(row => {
        this.SelectedCommonCategories.push(row.id)
      });


    } else {
      this.SelectedCommonCategories.length = 0;
    }
    this.eventselectionform.patchValue({ common_category: this.SelectedCommonCategories.join() });
    this.EventSelectionData.emit(this.eventselectionform.value);

  }
  //  end here laoction check   box code





  toggleAllmeta(event: MatCheckboxChange, metafield) {

    if (event.checked) {

      metafield.floor_content.options.forEach(row => {
        this.SelectedTeamMetafields.push(row.key);
        this.formmetafields = { field_id: metafield.id, field_value: this.SelectedTeamMetafields.join() };
      });

      this.metafieldsarr.push(this.formmetafields);
    } else {

      this.SelectedTeamMetafields.length = 0;
      //this.metafieldsarr.length = 0;
      this.formmetafields = { field_id: metafield.id, field_value: this.SelectedTeamMetafields.join() };

      this.metafieldsarr.push(this.formmetafields);
    }
    this.getAllMetaValues(this.metafieldsarr, this.metafieldsfloorarr);
  }

  togglemeta(value, event: MatCheckboxChange, metafield) {
    if (event.checked) {
      this.SelectedTeamMetafields.push(value);
      this.formmetafields = { field_id: metafield.id, field_value: this.SelectedTeamMetafields.join() };
      this.metafieldsarr.push(this.formmetafields);
    } else {

      let index = this.SelectedTeamMetafields.indexOf(value);
      if (index >= 0) {
        this.SelectedTeamMetafields.splice(index, 1); //if value is checked ...
      }
      this.formmetafields = { field_id: metafield.id, field_value: this.SelectedTeamMetafields.join() };
      this.metafieldsarr.push(this.formmetafields);
    }
    this.getAllMetaValues(this.metafieldsarr, this.metafieldsfloorarr);
  }



  existsmeta(item) {

    return this.SelectedTeamMetafields.indexOf(item) > -1;
  };

  isIndeterminatemeta() {
    return (this.SelectedTeamMetafields.length > 0 && !this.isCheckedmeta());
  };

  isCheckedmeta() {
    return this.SelectedTeamMetafields.length == this.AllTeamArr.options.length;

  };


  togglemetafloor(value, event: MatCheckboxChange, metafield) {
    if (event.checked) {
      //this.SelectedMetafields.push(item);
      this.SelectedFloorMetafields.push(value);
      this.formmetafields = { field_id: metafield.id, field_value: this.SelectedFloorMetafields.join() };
      this.metafieldsfloorarr.push(this.formmetafields);
    } else {
      let index = this.SelectedFloorMetafields.indexOf(value);
      if (index >= 0) {
        this.SelectedFloorMetafields.splice(index, 1); //if value is checked ...
      }
      this.formmetafields = { field_id: metafield.id, field_value: this.SelectedFloorMetafields.join() };
      this.metafieldsfloorarr.push(this.formmetafields);
    }
    this.getAllMetaValues(this.metafieldsarr, this.metafieldsfloorarr);
  }


  toggleAllmetafloor(event: MatCheckboxChange, metafield) {
    if (event.checked) {

      this.AllFloorArr.options.forEach(row => {
        this.SelectedFloorMetafields.push(row.key);
        this.formmetafields = { field_id: metafield.id, field_value: this.SelectedFloorMetafields.join() };
      });

      this.metafieldsfloorarr.push(this.formmetafields);
    } else {


      this.SelectedFloorMetafields.length = 0;
      //this.metafieldsfloorarr.length=0;
      this.formmetafields = { field_id: metafield.id, field_value: this.SelectedFloorMetafields.join() };
      this.metafieldsfloorarr.push(this.formmetafields);
    }
    this.getAllMetaValues(this.metafieldsarr, this.metafieldsfloorarr);
    //this.getAllMetaValues(this.eventselectionform.get('floorMeta').value,this.eventselectionform.get('teamMeta').value);      


  }

  getAllMetaValues(teamValue, floorValue) {
    this.eventselectionform.patchValue({ metafields: JSON.stringify(teamValue.concat(floorValue)) });
    this.EventSelectionData.emit(this.eventselectionform.value);
  }

  existsmetafloor(item) {

    return this.SelectedFloorMetafields.indexOf(item) > -1;
  };

  isIndeterminatemetafloor() {
    return (this.SelectedFloorMetafields.length > 0 && !this.isCheckedmetafloor());
  };
  isCheckedmetafloor() {
    return this.SelectedFloorMetafields.length == this.AllFloorArr.options.length;
  }
}
