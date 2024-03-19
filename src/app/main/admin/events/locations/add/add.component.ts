import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OptionsList, LocationService, EventcategoryService } from 'app/_services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { SlugifyPipe } from '@fuse/pipes/slugify.pipe'; 
import { Locationlist } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddLocationComponent implements OnInit {
  public addLocationForm : FormGroup;
  public title : string = '';
  public StatusList : any = [];
  public url_id : any;
  public openmodal: boolean = false;
  public editLocation : boolean;
  public isSubmit: boolean = false;
  public Category_Calendar_list
  constructor(
      private fb : FormBuilder,
      private slugifyPipe: SlugifyPipe,
      private _locationService : LocationService,
      private _matSnackBar : MatSnackBar,
      private router : Router,
      private eventcategoryservice : EventcategoryService,
      private route : ActivatedRoute,
      public dialogRef: MatDialogRef<AddLocationComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogdata: any
  ) 
  { 
    if(this.route.routeConfig!==null && this.route.routeConfig.path=='admin/events/location/edit/:id' && this.route.params['value'].id>0){
			this.url_id       = this.route.params['value'].id;
			this.editLocation = true;
    }
    this.url_id ? this.title = "Update Location":this.title = "Add New Location";
  }

  ngOnInit() {
    //Open Mat Dialog on add event form
    if(this.dialogdata && this.dialogdata.openmodal){
      this.openmodal = this.dialogdata.openmodal;
    }    
    // call the api for get  all category calendar 
    this.eventcategoryservice.getCategory({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
      this.Category_Calendar_list = res.data;
    });
    this.StatusList       = OptionsList.Options.tables.status.users;
    this.setControls();
  }
  setControls()
  {
    this.addLocationForm = this.fb.group({	
      id            : this.fb.control(null),       
      category_name : this.fb.control('', [Validators.required]),
      abbreviation  : this.fb.control('', [Validators.required]),
      font_color 		: this.fb.control('#000000'),
      bg_color 			: this.fb.control('#ffffff'),
      status			  : this.fb.control('A', [Validators.required]),
      calendar_id : this.fb.control('',[Validators.required])
    });
    	//Load Edit Form Values
    if(this.route.routeConfig!==null && this.route.routeConfig.path =='admin/events/location/edit/:id'){
      this.fillAnnouncementValues();
    }
  }

  /** FILL FORM FROM EDIT ROUTE */
  fillAnnouncementValues(){
    let formData = new Locationlist().deserialize(this._locationService.editLocation,'single');
    this.addLocationForm.patchValue(formData);
  }
  /**Create Slug of location name and assign to abriviation */
  slugifyLocationAbrvn(){
    if(this.addLocationForm.get('category_name').value){
      let locationName = this.addLocationForm.get('category_name').value;
      this.addLocationForm.get('abbreviation').setValue(locationName.split(' ').map(n => n[0]).join('').toUpperCase());
    }    
  }

  onSaveFieldClick(event:Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.addLocationForm.valid)
    {
      this.isSubmit = true;
      let addLocationFormData = this.addLocationForm.value;
        addLocationFormData.category_type = 'EL';
        this._locationService.saveLocation(addLocationFormData,this.editLocation)
        .subscribe(response =>
          {
              this._matSnackBar.open(response.message, 'CLOSE', {
                verticalPosition: 'top',
                duration        : 2000
              });
              if(response.status==200 && this.openmodal==false){
                this.router.navigate(['/admin/events/location/list']);
              }
              else{
                this.dialogRef.close(response);
              }	
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
      this.validateAllFormFields(this.addLocationForm);
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
