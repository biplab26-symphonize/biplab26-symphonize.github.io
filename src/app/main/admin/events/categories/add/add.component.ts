import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Eventcategorymodel } from 'app/_models';
import { EventcategoryService, CommonService } from 'app/_services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {
  public addCategoryForm : FormGroup;
  public EventSettings: any = {};
  public categorySettings: any = {event_background_color:'#000000',text_color:'#ffffff'};
  public title : string = '';
  public StatusList : any = [];
  public url_id : any;
  public editLocation : boolean=false;
  public isSubmit: boolean = false;
  public Category_Calendar_list ;
  public selectedCalendar: any='';
  public allistRoute    : any = '';    
  public displaySlug    : string = ''; 
  public calendarSlug: string='';
  private _unsubscribeAll: Subject<any>;

  constructor(
      private fb : FormBuilder,
      private _categoryService : EventcategoryService,
      private _commonService : CommonService,
      private _matSnackBar : MatSnackBar,
      private router : Router,
      private route : ActivatedRoute
  ) 
  { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if(this.route.routeConfig.path=='admin/events/categories/edit/:id' && this.route.params['value'].id>0){
			this.url_id   = this.route.params['value'].id;
			this.editLocation= true;
    }
    this.url_id ? this.title = "Update Category":this.title = "Add New Category";

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
        if(this.calendarSlug!==''){
          this.displaySlug    = this.calendarSlug.replace('-',' ');
          this.allistRoute    =  ['/admin/event/category/',this.calendarSlug];  
          this.setSelectedCalendar();
        }
        else{
          this.allistRoute        =  ['/admin/events/categories/list'];
          this.setSelectedCalendar();
        }
        
    });
  }

  ngOnInit() {
    let eventSettings  = this._commonService.getLocalSettingsJson('event-settings');
    this.EventSettings = eventSettings ? eventSettings[0] : {};
    this.categorySettings = this.EventSettings.category_settings;
    this.setControls();
  }
  setControls()
  {
    this.addCategoryForm = this.fb.group({	
      id                  : this.fb.control(null),       
      category_name       : this.fb.control('', [Validators.required]),
      description         : this.fb.control(''),
      font_color 		      : this.fb.control(this.categorySettings.text_color),
      bg_color 			      : this.fb.control(this.categorySettings.event_background_color),
      status			        : this.fb.control('A', [Validators.required]),
      disp_on_registration: this.fb.control('N', [Validators.required]),
      disp_on_calendar    : this.fb.control('N', [Validators.required]),
      calendar_id         : this.fb.control(0),

    });
    	//Load Edit Form Values
    if(this.route.routeConfig.path =='admin/events/categories/edit/:id'){
      this.fillAnnouncementValues();
      if(this._categoryService.editeventcategory && this._categoryService.editeventcategory.eventcalendar && this._categoryService.editeventcategory.eventcalendar.category_alias!==''){
        this.calendarSlug = this._categoryService.editeventcategory.eventcalendar.category_alias;
        if(this.calendarSlug!==''){
          this.displaySlug    = this.calendarSlug.replace('-',' ');
          this.allistRoute    =  ['/admin/event/category/',this.calendarSlug]; 
        }
        else{
          this.allistRoute        =  ['/admin/events/categories/list'];
        }
      }
    }
  }

  setSelectedCalendar(){
    this._categoryService.getCategory({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
      this.Category_Calendar_list = res.data;
      if(this.calendarSlug!=='' && this.Category_Calendar_list && this.Category_Calendar_list.length>0){
        let selCalendar = this.Category_Calendar_list.find(item=>{
          return item.category_alias==this.calendarSlug;
        });
        this.selectedCalendar = selCalendar && selCalendar.id>0 ? selCalendar.id : 0;
        if(this.selectedCalendar!==''){
          this.addCategoryForm.get('calendar_id').setValue(this.selectedCalendar);
        }
      }
    });     
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillAnnouncementValues(){
    let formData = new Eventcategorymodel().deserialize(this._categoryService.editeventcategory,'single');
    this.addCategoryForm.patchValue(formData);
  }

  onSaveFieldClick(event:Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.addCategoryForm.valid)
    {
      this.isSubmit = true;
      let addCategoryFormData = this.addCategoryForm.value;
      addCategoryFormData.category_type = 'C';
        this._categoryService.saveCategory(addCategoryFormData,this.editLocation)
        .subscribe(response =>
          {
              this._matSnackBar.open(response.message, 'CLOSE', {
                verticalPosition: 'top',
                duration        : 2000
              });
              this.router.navigate(this.allistRoute);	
          },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
                verticalPosition: 'top',
                duration        : 2000
            });
          });
      
    }
    else
    {
      this.validateAllFormFields(this.addCategoryForm);
    }
  }
  validateAllFormFields(formGroup: FormGroup)
  {
    Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    control.markAsTouched({ onlySelf: true });
    });
  }
}
