import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldsService,CommonService } from 'app/_services';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'event-meta-filters',
  templateUrl: './meta-filters.component.html',
  styleUrls: ['./meta-filters.component.scss']
})
export class MetaFiltersComponent implements OnInit {

  @Input() EventSettings: any   = {calendar_settings:{show_floor:'N',show_room:'N',show_team:'N',special_event:'N'}};
  @Output() eventmetaArray      = new EventEmitter<any>(); //Send updated guestinfo
  metaFields              : FormArray;
  metaValues              : any[] = [];
  fieldformGroup          : FormGroup;
  public MetaFilters      : any[]=[];
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _fieldService:FieldsService,
    private _commonService:CommonService,
    private _formBuilder:FormBuilder
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    
    this.fieldformGroup=this._formBuilder.group({
      eventmeta: this._formBuilder.array([])
    })

    //CHECK IF FILTERS ENABLED THEN FETCH EVENT META FIELDS
    if(
      this.EventSettings.calender_settings.show_floor=='Y' || 
      this.EventSettings.calender_settings.show_room=='Y' ||
      this.EventSettings.calender_settings.show_team=='Y' ||
      this.EventSettings.calender_settings.special_event=='Y'
      ){
        this._fieldService.getFields({field_form_type:'EF',column:'id',direction:'asc'}).then(fieldresponse=>{
          this.MetaFilters = fieldresponse.data || [];

          if(this.MetaFilters.length>0){
            this.metaFields = this.fieldformGroup.get('eventmeta') as FormArray;

            this.MetaFilters.map((item, index) => {
              console.log("item",item);
              // Get field_meta_id From extra_field_content string
              let tempObj         = {};
              tempObj['field_id']     = new FormControl(item.id);
              let fieldContent      = JSON.parse(item.field_content);
              if(fieldContent.extra_field_content && fieldContent.extra_field_content.field_meta_id>0){
              item.id             = fieldContent.extra_field_content.field_meta_id;
              tempObj['field_value']  = new FormControl(item.field_id);
              }
              this.metaFields.push(this._formBuilder.group(tempObj));
            });
          }
        });
    }
    //GET VALUES FROM DYNAMIC FIELDS AND SEND TO MAIN FORM
    this._commonService.filterMetaObservable.subscribe(metadata=>{
      
      if(metadata!==null){
        let itemexists = this.metaValues.map(item=>{return item.field_id}).indexOf(metadata.field_id);
        
        if(itemexists!==-1) {
          this.metaValues[itemexists]=metadata;
        }
        else{
          this.metaValues.push(metadata);
        }
      }
 
      let filterMetaValues = this.metaValues.filter( metaValues => metaValues.field_value );
      this.eventmetaArray.emit(filterMetaValues);
    
    })

    //to reset meta fields -- by using BehaviorSubject 
    this._commonService.resetMataFieldsObservable
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data =>
      {
        this.fieldformGroup.reset();
      })

  }
  
  setFiltermetaFields($event:any){
    // console.log("setFiltermetaFields event",$event);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
  

}
