import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { UsersService, EventsService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {
  public url_id;
  public eventData : any= [];
  public newName : any = [];
  public guestUser : any = [];
  public eventRegister: FormGroup;
  public guestinfo : FormArray;

  // View event
  public attendee_limit:any=[];
  public eventInfo;
  public date;
  public eventTitle;
  public isDate : boolean = false;
  public enddate ; 
  public isEndDate : boolean = false;
  public location; 
  public isLocation : boolean = false;
  public allDayEvent ;
  public isAllDay : boolean = false;
  public availableSpace ;
  public CheckInTime;
  public isCheckInTime : boolean = false;
  public endTime;
  public isEndTime : boolean = false;

  constructor(
    private _eventService : EventsService,
    private route         : ActivatedRoute,
    private fb            : FormBuilder,
    private _userService  : UsersService,
    private _matSnackBar  : MatSnackBar,
    private router        : Router
  ) 
    {
      this.route.params.subscribe( params => {
        this.url_id = params.id;
      });
   }

  ngOnInit() {
    
    let token           = JSON.parse(localStorage.getItem('token')).token;
    let jwtData         = token.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData  = JSON.parse(decodedJwtJsonData)
    console.log(decodedJwtData);

    this.eventRegister  = this.createFormGroup(decodedJwtData.user);//FORM GROUP
    this.guestinfo      = this.fb.array([]);     //FORM ARRAY      
    this.getEventList();
    let eventInfo       = this._eventService.event.data; 
    this.eventData      = eventInfo.filter(e=>e.event_id==this.url_id);

    let attendee_limit  = (this.eventData[0].group_limit);
    for (let i = 0; i < attendee_limit; i++) {
      this.newName.push({"id":i+1})
    }
    console.log("eventData",this.eventData)
  }

  getEventList() {
  
    this._eventService.getEventInfo(this.url_id)
      .subscribe(response =>
      {
         
          this.attendee_limit = (response.eventinfo.group_limit);
          for (let i = 0; i <  this.attendee_limit; i++) {
            this.newName.push({"id":i+1})
          }
          this.eventInfo = response.eventinfo;
          this.eventTitle = this.eventInfo.event_title;
          if(this.eventInfo.event_start_date)
          {
            this.date =  this.eventInfo.event_start_date;
            this.isDate = true;
          } 
          if(this.eventInfo.event_end_date)
          {
            this.enddate =  this.eventInfo.event_end_date;
            this.isEndDate = true;
          }
          if(this.eventInfo.event_location)
          {
            this.location =  this.eventInfo.event_location;
            this.isLocation = true;
          }
          if(this.eventInfo.is_all_day)
          {
            this.allDayEvent =  this.eventInfo.is_all_day;
            this.isAllDay = true;
          }
          this.availableSpace =  this.eventInfo.attendee_limit;
          if(this.eventInfo.event_start_time)
          {
            this.CheckInTime =  this.eventInfo.event_start_time;
            this.isCheckInTime = true;
          }
          if(this.eventInfo.event_end_time)
          {
            this.endTime =  this.eventInfo.event_end_time;
            this.isEndTime = true;
          }
          // if(this.eventInfo.organizerName)
          // {
          //   this.endTime =  this.eventInfo.event_end_time;
          //   this.isEndTime = true;
          // }
          // if(this.eventInfo.organizerEmail)
          // {
          //   this.endTime =  this.eventInfo.event_end_time;
          //   this.isEndTime = true;
          // }
      
      });
  }

  //FORM ARRAY
  createItemFormGroup(data): FormGroup {
      let first_name  = '';
      let last_name   = '';
      let email       = '';
      let phone       = '';
      let user_id     = '';
      let attendee_type = 'G';

      if(data){
        first_name    = data.Name ? data.Name : '';
        last_name     = data.last_name ? data.last_name : '';
        email         = data.email ? data.email : '';
        phone         = data.phone ? data.phone : '';
        user_id       = data.user_id ? data.user_id : '';
        attendee_type = data.attendee_type ? data.attendee_type : 'G';
      }
      return this.fb.group({
        first_name    : this.fb.control(first_name, Validators.required), 
        last_name     : this.fb.control(last_name, Validators.required), 
        email         : this.fb.control(email, [Validators.required,Validators.email]),
        phone         : this.fb.control(phone, Validators.required),
        attendee_type : this.fb.control(attendee_type, Validators.required),
        user_id       : this.fb.control(user_id),
      });
  }

  //FORM GROUP
  createFormGroup(data) 
  {
    
    let username = '';
    let first_name = '';
    let last_name = '';
    let email = '';
    let phone = '';
    let guestcount = '';
    // this.guestinfo.get('email').setValue(data.email);
        if(data){
          username    = data.username ? data.username : '';
          first_name  = data.first_name ? data.first_name : '';
          last_name   = data.last_name ? data.last_name : '';
          email       = data.email ? data.email : '';
          phone       = data.phone ? data.phone : '';
          guestcount  = data.guestcount ? data.guestcount : '1';
        }
  	  return this.fb.group({
	    userName        : this.fb.control(username,[Validators.required]),
	    first_name      : this.fb.control(first_name,[Validators.required]),
      last_name       : this.fb.control(last_name,[Validators.required]),
      email           : this.fb.control(email,[Validators.required,Validators.email]),
      phone           : this.fb.control(phone,[Validators.required]),
      guestcount      : this.fb.control(guestcount,[Validators.required]),
      notes           : this.fb.control('',[Validators.required]),
      email1          : this.fb.control('', [Validators.required,Validators.email]),
      phone1          : this.fb.control('', Validators.required),
      });
  }
  //guest autocomplete
  applyFilter(filterValue:any)
  {
    this.getUserList(filterValue);
  }
  getUserList(value:any)
  {
    let params = [];
    params.push(
      {
        'searchKey': value
      })
    this._userService.getUsers(params)
      .then(response =>
      {
          this.guestUser = response.data.map(this.formatElement);
      },
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
                verticalPosition: 'top',
                duration        : 2000
        });
      });
  }
  formatElement(ele) {

    return {
      user_id: ele.id,
      Name: ele.first_name + ' ' + ele.last_name,
      first_name: ele.first_name,
      last_name: ele.last_name,
      email: ele.email,
      phone: ele.phone
    };
  }

  selectChange(value)
  {      
      if (value !=1) {
        for (let i = 2; i <= value; i++) {
          this.guestinfo.removeAt(i-1)
          this.eventRegister.addControl('guestinfo', this.guestinfo);   
          this.guestinfo.push(this.createItemFormGroup(null));
          this.guestinfo.removeAt(i-1) 
        }
      }else{
        while (this.guestinfo.length !== 0) {
          this.guestinfo.removeAt(0)
        }
      }
  }

  OnSelected(option,index)
  {
    for (let i = 0; i <= index; i++)
    {
      //this.guestinfo.removeAt(index-1 )
      this.guestinfo.insert(index,this.createItemFormGroup(option))
      this.guestinfo.removeAt(index+1) 
    }
  }

  onSubmit(event:Event)
  {
  
    let registerData      = this.eventRegister.value;
    registerData.user_id  = JSON.parse(localStorage.getItem('token')).user_id;
    registerData.event_id = this.url_id ;
    registerData.attendee_type = 'M';
    
    if (registerData)
    {
        this._eventService.addNew(registerData,'actions/eventregister')
        .subscribe(response =>
          {
            this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration        : 2000
            });       
              this.router.navigate(['events/all']);
          },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
                    verticalPosition: 'top',
                    duration        : 2000
            });
          })
    }      
    else 
    {
      this.validateAllFormFields(this.eventRegister);
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
