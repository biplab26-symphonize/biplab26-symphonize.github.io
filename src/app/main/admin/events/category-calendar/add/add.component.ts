import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor(
      private fb : FormBuilder,
      private _categoryService : EventcategoryService,
      private _commonService : CommonService,
      private _matSnackBar : MatSnackBar,
      private router : Router,
      private route : ActivatedRoute
  ) 
  { 
    if(this.route.routeConfig.path=='admin/events/category_Calendar/edit/:id' && this.route.params['value'].id>0){
			this.url_id   = this.route.params['value'].id;
			this.editLocation= true;
    }
    this.url_id ? this.title = "Update  Category Calendar":this.title = "Add New Category Calendar";
  }

  ngOnInit() {
    //Event Settings From LocalStorage
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
      disp_on_calendar    : this.fb.control('N', [Validators.required])

    });
    	//Load Edit Form Values
    if(this.route.routeConfig.path =='admin/events/category_Calendar/edit/:id'){
      this.fillAnnouncementValues();
    }
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
      addCategoryFormData.category_type = 'ECL';
        this._categoryService.saveCategory(addCategoryFormData,this.editLocation)
        .subscribe(response =>
          {
              this._matSnackBar.open(response.message, 'CLOSE', {
                verticalPosition: 'top',
                duration        : 2000
              });
              this.router.navigate(['admin/events/category_Calendar/list']);	
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
