import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FieldsService, CommonService } from 'app/_services';
@Component({
  selector: 'user-meta-filter',
  templateUrl: './meta-filter.component.html',
  styleUrls: ['./meta-filter.component.scss']
})
export class MetaFilterComponent implements OnInit {

  // @Input() EventSettings: any   = {calendar_settings:{show_floor:'N',show_room:'N',show_team:'N',special_event:'N'}};
  @Output() usermetaArray      = new EventEmitter<any>(); //Send updated guestinfo
  @Input() filtermetafields: any[] = [];

  metaFields              : FormArray;
  metaValues              : any[] = [];
  fieldformGroup          : FormGroup;
  public filterFields     : any[]=[];
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
      usermeta: this._formBuilder.array([])
    });
    this.setFilterInputs();


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
    //  this.metaValues.filter()
    let filterMetaValues = this.metaValues.filter( metaValues => metaValues.field_value );
      this.usermetaArray.emit(filterMetaValues);
    });

    //to reset meta fields -- by using BehaviorSubject 
    this._commonService.resetMataFieldsObservable.subscribe(data =>
    {
      this.metaValues = []
      this.fieldformGroup.reset();
    });
  }
  ngOnChanges(){
    if(this.filtermetafields.length>0){
      this.setFilterInputs();
    }
  }
  setFilterInputs(){
    this._fieldService.getFieldsForFilter({field_form_type:'RD',column:'order',direction:'asc'}).subscribe(fieldresponse=>{
      //Check Fields Array Not Empty
      if(fieldresponse.data.length>0){
        this.filterFields = fieldresponse.data.filter(field=>{ return this.filtermetafields.includes(field.id)});
      } 
      if(this.filterFields.length>0){
        this.metaFields = this.fieldformGroup.get('usermeta') as FormArray;
        this.filterFields.map((item) => {
          //Get field_meta_id From extra_field_content string
          let tempObj         = {};
          tempObj['field_id']   = new FormControl(item.id);
          let fieldContent      = JSON.parse(item.field_content);
          if(fieldContent.extra_field_content && fieldContent.extra_field_content.field_meta_id>0){
            item.id             = fieldContent.extra_field_content.field_meta_id;
            tempObj['field_id'] = new FormControl(fieldContent.extra_field_content.field_meta_id);
          }
          this.metaFields.push(this._formBuilder.group(tempObj));
          return item;
        });
      }
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void{
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}
