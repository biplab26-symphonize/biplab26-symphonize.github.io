import { Component, OnInit,Input,Output,EventEmitter,ViewChild } from '@angular/core';
import { TabelReservationService,ProfileService,UsersService,CommonService } from 'app/_services';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms'
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { DiningGuestsComponent } from 'app/main/admin/dining-reservation/bookings/dining-guests/dining-guests.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-display-bookings',
  templateUrl: './display-bookings.component.html',
  styleUrls: ['./display-bookings.component.scss']
})
export class DisplayBookingsComponent implements OnInit {
  @Input() service_id;
  @Input() service_title;
  @Input() service_description;
  @Input() selected_date;
  @Input() service_image;
  @Input() displayFormData;
  @Output() displayFrontBooking = new EventEmitter<boolean>(); 

  
  public getTimeSlots : any=[];
  filteredUsers: any[] = [];
  
  
  public currentTimeSlot : any;
 
  public serviceID : any;
  public selectedDate : any;
  public defaultImage : any;
  public sendUserId : any;
  public disableSubmit: boolean = false;
  public tableSizes : any=[];
  public tableImages : any = [];
  public defaultSettingImage : any;
  public tableMinSize : any;
  public tableMaxSize : any;
  public displayDateMac : any;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  @ViewChild(DiningGuestsComponent,{static:true}) private guestInfo: DiningGuestsComponent;


  constructor(private _tableService : TabelReservationService,
  private fb : FormBuilder,
  private _profileservices :ProfileService,
  private _userService     : UsersService,
  public  router 			     : Router,
  public route             : ActivatedRoute,
  public _commonService    : CommonService) { }

  ngOnInit() {

    this.displayDateMac = CommonUtils.getStringToDate(this.selectedDate);
    this._tableService.getTableImages({'meta_key':'table_image'}).subscribe(response =>{
      this.tableImages = JSON.parse(response.settingsinfo.meta_value);

    });
    this._tableService.getDefaultImages({'meta_key':'default_image'}).subscribe(response =>{
      this.defaultSettingImage = response.settingsinfo.meta_value;

    });
    this.defaultImage = '/assets/images/backgrounds/diningReservation.jpg';
    //this.setControls();
    this.timeSlots();
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    setTimeout(() => {
      this.getFormValues();
    }, 200);  //5s
    
  }

  


  /*setControls(){
    this._profileservices.getProfileInfo().subscribe(res=>{
      if(res.userinfo!='' && res.userinfo!=undefined){
        this.addBookingForm.patchValue({first_name:res.userinfo.first_name+' '+res.userinfo.last_name});
        this.addBookingForm.patchValue({email:res.userinfo.email});
        this.addBookingForm.patchValue({phone:res.userinfo.phone});
        this.addBookingForm.patchValue({id:res.userinfo.id});
        this.sendUserId = res.userinfo.id
        //Get UserMeta Fields To Print
        if(res.userinfo && res.userinfo.usermeta){
          this.userMeta = CommonUtils.getMetaValues(res.userinfo.usermeta);
          for(let i=0;i<this.userMeta.length;i++){
            if(this.userMeta[i].field_name == 'Apartment' || this.userMeta[i].field_name == 'Home'){
                this.addBookingForm.patchValue({address:this.userMeta[i].field_value});
            }
          }
        }
      }
    });
    this.serviceID = this.service_id;
    
    this.selectedDate = this.selected_date;
  }  */

  getFormValues(){
    let getData = this._tableService.getViewBookingData();
    if(getData!='' && getData!=undefined && this.displayFormData==true){

      // this.addBookingForm.patchValue({first_name:getData.name});
      // this.addBookingForm.patchValue({email:getData.email});
      // this.addBookingForm.patchValue({address:getData.address});
      // this.addBookingForm.patchValue({notes:getData.notes});
      // this.addBookingForm.patchValue({guestinfo:JSON.parse(getData.guestinfo)});
      // this.addBookingForm.patchValue({guestcount:getData.guestcount});
      // this.addBookingForm.patchValue({phone:getData.phone});
      // this.addBookingForm.patchValue({id:getData.user_id});
        this.service_title = getData.service_title;
        this.service_description = getData.service_description;
        this.service_image = getData.service_image;
        this.service_id = getData.service_id;
        this.selected_date = getData.selected_date;
        this.displayDateMac = CommonUtils.getStringToDate(this.selectedDate);
        this.timeSlots();
        this.getTableSizes(getData.current_time_slot);
      //this.getPartySizes(getData.booking_start_time);
      
    }
    
  }
  

 
  timeSlots(){
    this._tableService.getTimeSlots({'service_id': this.service_id,'date':this.selected_date,'front':1}).subscribe(response =>{
      this.getTimeSlots = response.timeslot;
    });
    
  }
  getTableSizes(timeslot){
    //this.editTableSizesData = false;
    this.currentTimeSlot = timeslot; 
     
    this._tableService.getTableSize({'service_id': this.service_id,'date':this.selected_date,'timeslot':timeslot,'front':1}).subscribe(response =>{  
      this.tableSizes = response.tableinfo;
    });  
    
  }
  
  
  getPartySizes(minTableSize,maxTableSize){
   
    /*this.partySize = [];
    for(var i=minTableSize;i<=maxTableSize;i++){
      this.partySize.push(i);
    }*/
    this.tableMinSize = minTableSize;
    this.tableMaxSize = maxTableSize;
    /*this.addBookingForm.patchValue({guestcount:minTableSize});
    let groupLimit = maxTableSize || 0;
    this.groupLimit = Array.from(new Array(groupLimit),(val,index)=>index+1); */
  }
 

  
  
  /** Update Guest Info From Array */
  /*setguestInfoFieldValue($event:any){
    this.addBookingForm.get('guestinfo').setValue($event);
    
  }

  //validate form from guest component
  validateParentForm($event){
    this.disableSubmit = $event;
  }

  setFormfields(userInfo:any){    
    if(userInfo.option.value){
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.addBookingForm.patchValue(userInfo.option.value);
    }
  } */

  getNextPreview(){
   
    //let formValue = this.addBookingForm.value;
    
    /*let formData = {
      'name'                  : formValue.first_name,
      'email'                 : formValue.email,
      'phone'                 : formValue.phone,
      'service_id'            : this.serviceID,
      'notes'                 : formValue.notes,
      'booking_start_date'    : this.selectedDate,
      'booking_start_time'    : this.currentTimeSlot,
      'address'               : formValue.address,
      'attendee_type'         : 'M',
      'status'                : 'pending',
      'is_recurring'          : 'N',
      'recurring_meta'        : '',
      'recurrences'           : '',
      'guestcount'            : formValue.guestcount,
      'guestinfo'             : JSON.stringify(formValue.guestinfo),
      'user_id'               : this.sendUserId,
      'id'                    : '',
      'update'                : '',
      'parent_booking_id'     : '',
      'front'                 : 1,
      'service_title'         : this.service_title,
      'service_image'         : this.service_image
    }*/
    let formData = {
      'service_id'            : this.service_id,
      'service_title'         : this.service_title,
      'service_description'   : this.service_description,  
      'service_image'         : this.service_image,
      'selected_date'         : this.selected_date,
      'min_table_size'        : this.tableMinSize,
      'max_table_size'        : this.tableMaxSize,
      'current_time_slot'     : this.currentTimeSlot 
    }

    
    this._tableService.setViewBookingData(formData);
    this.router.navigate(['view-detail-bookings']);
  }

  displayMainBooking(){
    this.router.navigate(['restaurant-reservations']);
    this.displayFrontBooking.emit(false);
  }

}
