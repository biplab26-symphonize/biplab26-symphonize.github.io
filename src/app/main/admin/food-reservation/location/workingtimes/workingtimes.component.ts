import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormArray, FormControl } from '@angular/forms';
import { FoodReservationService,OptionsList } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
//import { MatSnackBar, MatDialog, MatDialogRef  } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import moment from 'moment';
@Component({
  selector: 'app-workingtimes',
  templateUrl: './workingtimes.component.html',
  styleUrls: ['./workingtimes.component.scss'],
  animations : fuseAnimations
})
export class WorkingtimesComponent implements OnInit {
  public url_id: any;
  public workingDeliveryTimes : any;
  public workingPickupTimes : any;
  public addWorkingTimesForm : FormGroup;
  public week_days            : any = [];
  public pickup_days_status = { 'monday': true, 'tuesday': true, 'wednesday': true, 'thursday': true, 'friday': true, 'saturday': true, 'sunday': true };  
  public delivery_days_status = { 'monday': true, 'tuesday': true, 'wednesday': true, 'thursday': true, 'friday': true, 'saturday': true, 'sunday': true };
  
  constructor(private fb : FormBuilder,
    private _foodService : FoodReservationService,
    private _matSnackBar : MatSnackBar,
    private router       : Router,
    private route        : ActivatedRoute,
    private _dialog      : MatDialog) {
      this.url_id   = this.route.params['value'].id;
  }

  ngOnInit() {
    this.week_days           = OptionsList.Options.food_week_days;
    this.fillWorkingTimes();
  }

  fillWorkingTimes(){

    this.addWorkingTimesForm = this.fb.group({	
      d_monday_from: this.fb.control(''),
      d_tuesday_from: this.fb.control(''),
      d_wednesday_from: this.fb.control(''),
      d_thursday_from: this.fb.control(''),
      d_friday_from: this.fb.control(''),
      d_saturday_from: this.fb.control(''),
      d_sunday_from: this.fb.control(''),

      d_monday_to: this.fb.control(''),
      d_tuesday_to: this.fb.control(''),
      d_wednesday_to: this.fb.control(''),
      d_thursday_to: this.fb.control(''),
      d_friday_to: this.fb.control(''),
      d_saturday_to: this.fb.control(''),
      d_sunday_to: this.fb.control(''),

      p_monday_from: this.fb.control(''),
      p_tuesday_from: this.fb.control(''),
      p_wednesday_from: this.fb.control(''),
      p_thursday_from: this.fb.control(''),
      p_friday_from: this.fb.control(''),
      p_saturday_from: this.fb.control(''),
      p_sunday_from: this.fb.control(''),

      p_monday_to: this.fb.control(''),
      p_tuesday_to: this.fb.control(''),
      p_wednesday_to: this.fb.control(''),
      p_thursday_to: this.fb.control(''),
      p_friday_to: this.fb.control(''),
      p_saturday_to: this.fb.control(''),
      p_sunday_to: this.fb.control('')


    });

    this._foodService.getLocationContent(this.url_id).subscribe(response =>{
      this.workingDeliveryTimes = response.locationinfo.deliveryworkingtimes;
      this.workingPickupTimes = response.locationinfo.pickupworkingtimes;


      if(this.workingDeliveryTimes.d_monday_from != null){
        this.addWorkingTimesForm.get('d_monday_from').setValue( new Date(moment(this.workingDeliveryTimes.d_monday_from, 'HH:mm:ss').toString()));
        
      }else{
        this.delivery_days_status['monday'] = false;
        this.addWorkingTimesForm.get('d_monday_from').setValue(this.workingDeliveryTimes.d_monday_from);
      }
      
      if(this.workingDeliveryTimes.d_tuesday_from != null){
          this.addWorkingTimesForm.get('d_tuesday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_tuesday_from, 'HH:mm:ss').toString()));
      }else{
        this.delivery_days_status['tuesday'] = false;
        this.addWorkingTimesForm.get('d_tuesday_from').setValue(this.workingDeliveryTimes.d_tuesday_from);
      }

      if(this.workingDeliveryTimes.d_wednesday_from != null){
        this.addWorkingTimesForm.get('d_wednesday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_wednesday_from, 'HH:mm:ss').toString()));
      }else{
         this.delivery_days_status['wednesday'] = false;
        this.addWorkingTimesForm.get('d_wednesday_from').setValue(this.workingDeliveryTimes.d_wednesday_from);
      }

      if(this.workingDeliveryTimes.d_thursday_from != null){
        this.addWorkingTimesForm.get('d_thursday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_thursday_from, 'HH:mm:ss').toString()));
      }else{
        this.delivery_days_status['thursday'] = false;
        this.addWorkingTimesForm.get('d_thursday_from').setValue(this.workingDeliveryTimes.d_thursday_from);
      }

      if(this.workingDeliveryTimes.d_friday_from != null){
       this.addWorkingTimesForm.get('d_friday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_friday_from, 'HH:mm:ss').toString()));
      }else{
         this.delivery_days_status['friday'] = false;
        this.addWorkingTimesForm.get('d_friday_from').setValue(this.workingDeliveryTimes.d_friday_from);
      }

      if(this.workingDeliveryTimes.d_saturday_from != null){
        this.addWorkingTimesForm.get('d_saturday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_saturday_from, 'HH:mm:ss').toString()));
      }else{
         this.delivery_days_status['saturday'] = false;
        this.addWorkingTimesForm.get('d_saturday_from').setValue(this.workingDeliveryTimes.d_saturday_from);
      }


      if(this.workingDeliveryTimes.d_sunday_from != null){
        this.addWorkingTimesForm.get('d_sunday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_sunday_from, 'HH:mm:ss').toString()));
         
      }else{
        this.delivery_days_status['sunday'] = false;
        this.addWorkingTimesForm.get('d_sunday_from').setValue(this.workingDeliveryTimes.d_sunday_from);
      } 


       if(this.workingDeliveryTimes.d_monday_to != null){
        this.addWorkingTimesForm.get('d_monday_to').setValue( new Date(moment(this.workingDeliveryTimes.d_monday_to, 'HH:mm:ss').toString()));
        
      }else{
        this.delivery_days_status['monday'] = false;
        this.addWorkingTimesForm.get('d_monday_to').setValue(this.workingDeliveryTimes.d_monday_to);
      }
      
      if(this.workingDeliveryTimes.d_tuesday_to != null){
         this.addWorkingTimesForm.get('d_tuesday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_tuesday_to, 'HH:mm:ss').toString()));
      }else{
        this.delivery_days_status['tuesday'] = false;
        this.addWorkingTimesForm.get('d_tuesday_to').setValue(this.workingDeliveryTimes.d_tuesday_to);
      }

      if(this.workingDeliveryTimes.d_wednesday_to != null){
        this.addWorkingTimesForm.get('d_wednesday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_wednesday_to, 'HH:mm:ss').toString()));

      }else{
         this.delivery_days_status['wednesday'] = false;
        this.addWorkingTimesForm.get('d_wednesday_to').setValue(this.workingDeliveryTimes.d_wednesday_to);
      }

      if(this.workingDeliveryTimes.d_thursday_to != null){
        this.addWorkingTimesForm.get('d_thursday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_thursday_to, 'HH:mm:ss').toString()));
      }else{
        this.delivery_days_status['thursday'] = false;
        this.addWorkingTimesForm.get('d_thursday_to').setValue(this.workingDeliveryTimes.d_thursday_to);
      }

      if(this.workingDeliveryTimes.d_friday_from != null){
       this.addWorkingTimesForm.get('d_friday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_friday_to, 'HH:mm:ss').toString()));
      }else{
         this.delivery_days_status['friday'] = false;
        this.addWorkingTimesForm.get('d_friday_to').setValue(this.workingDeliveryTimes.d_friday_to);
      }

      if(this.workingDeliveryTimes.d_saturday_to != null){
        this.addWorkingTimesForm.get('d_saturday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_saturday_to, 'HH:mm:ss').toString()));
      }else{
         this.delivery_days_status['saturday'] = false;
        this.addWorkingTimesForm.get('d_saturday_to').setValue(this.workingDeliveryTimes.d_saturday_to);
      }


      if(this.workingDeliveryTimes.d_sunday_to != null){
         this.addWorkingTimesForm.get('d_sunday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_sunday_to, 'HH:mm:ss').toString())); 
      }else{
        this.delivery_days_status['sunday'] = false;
        this.addWorkingTimesForm.get('d_sunday_to').setValue(this.workingDeliveryTimes.d_sunday_to);
      } 

      
        /*this.addWorkingTimesForm.get('d_monday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_monday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_tuesday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_tuesday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_wednesday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_wednesday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_thursday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_thursday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_friday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_friday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_saturday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_saturday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_sunday_from').setValue(new Date(moment(this.workingDeliveryTimes.d_sunday_from, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_monday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_monday_to, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_tuesday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_tuesday_to, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_wednesday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_wednesday_to, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_thursday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_thursday_to, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_friday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_friday_to, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_saturday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_saturday_to, 'HH:mm:ss').toString()));
        this.addWorkingTimesForm.get('d_sunday_to').setValue(new Date(moment(this.workingDeliveryTimes.d_sunday_to, 'HH:mm:ss').toString()));*/
      
      if(this.workingPickupTimes.p_monday_from != null){
        this.addWorkingTimesForm.get('p_monday_from').setValue( new Date(moment(this.workingPickupTimes.p_monday_from, 'HH:mm:ss').toString()));
        
      }else{
        this.pickup_days_status['monday'] = false;
        this.addWorkingTimesForm.get('p_monday_from').setValue(this.workingPickupTimes.p_monday_from);
      }
      
      if(this.workingPickupTimes.p_tuesday_from != null){
          this.addWorkingTimesForm.get('p_tuesday_from').setValue(new Date(moment(this.workingPickupTimes.p_tuesday_from, 'HH:mm:ss').toString()));
      }else{
        this.pickup_days_status['tuesday'] = false;
        this.addWorkingTimesForm.get('p_tuesday_from').setValue(this.workingPickupTimes.p_tuesday_from);
      }

      if(this.workingPickupTimes.p_wednesday_from != null){
        this.addWorkingTimesForm.get('p_wednesday_from').setValue(new Date(moment(this.workingPickupTimes.p_wednesday_from, 'HH:mm:ss').toString()));
      }else{
         this.pickup_days_status['wednesday'] = false;
        this.addWorkingTimesForm.get('p_wednesday_from').setValue(this.workingPickupTimes.p_wednesday_from);
      }

      if(this.workingPickupTimes.p_thursday_from != null){
        this.addWorkingTimesForm.get('p_thursday_from').setValue(new Date(moment(this.workingPickupTimes.p_thursday_from, 'HH:mm:ss').toString()));
      }else{
        this.pickup_days_status['thursday'] = false;
        this.addWorkingTimesForm.get('p_thursday_from').setValue(this.workingPickupTimes.p_thursday_from);
      }

      if(this.workingPickupTimes.p_friday_from != null){
       this.addWorkingTimesForm.get('p_friday_from').setValue(new Date(moment(this.workingPickupTimes.p_friday_from, 'HH:mm:ss').toString()));
      }else{
         this.pickup_days_status['friday'] = false;
        this.addWorkingTimesForm.get('p_friday_from').setValue(this.workingPickupTimes.p_friday_from);
      }

      if(this.workingPickupTimes.p_saturday_from != null){
        this.addWorkingTimesForm.get('p_saturday_from').setValue(new Date(moment(this.workingPickupTimes.p_saturday_from, 'HH:mm:ss').toString()));
      }else{
         this.pickup_days_status['saturday'] = false;
        this.addWorkingTimesForm.get('p_saturday_from').setValue(this.workingPickupTimes.p_saturday_from);
      }


      if(this.workingPickupTimes.p_sunday_from != null){
        this.addWorkingTimesForm.get('p_sunday_from').setValue(new Date(moment(this.workingPickupTimes.p_sunday_from, 'HH:mm:ss').toString()));
         
      }else{
        this.pickup_days_status['sunday'] = false;
        this.addWorkingTimesForm.get('p_sunday_from').setValue(this.workingPickupTimes.p_sunday_from);
      } 


       if(this.workingPickupTimes.p_monday_to != null){
        this.addWorkingTimesForm.get('p_monday_to').setValue( new Date(moment(this.workingPickupTimes.p_monday_to, 'HH:mm:ss').toString()));
        
      }else{
        this.pickup_days_status['monday'] = false;
        this.addWorkingTimesForm.get('p_monday_to').setValue(this.workingPickupTimes.p_monday_to);
      }
      
      if(this.workingPickupTimes.p_tuesday_to != null){
         this.addWorkingTimesForm.get('p_tuesday_to').setValue(new Date(moment(this.workingPickupTimes.p_tuesday_to, 'HH:mm:ss').toString()));
      }else{
        this.pickup_days_status['tuesday'] = false;
        this.addWorkingTimesForm.get('p_tuesday_to').setValue(this.workingPickupTimes.p_tuesday_to);
      }

      if(this.workingPickupTimes.p_wednesday_to != null){
        this.addWorkingTimesForm.get('p_wednesday_to').setValue(new Date(moment(this.workingPickupTimes.p_wednesday_to, 'HH:mm:ss').toString()));

      }else{
         this.pickup_days_status['wednesday'] = false;
        this.addWorkingTimesForm.get('p_wednesday_to').setValue(this.workingPickupTimes.p_wednesday_to);
      }

      if(this.workingPickupTimes.p_thursday_to != null){
        this.addWorkingTimesForm.get('p_thursday_to').setValue(new Date(moment(this.workingPickupTimes.p_thursday_to, 'HH:mm:ss').toString()));
      }else{
        this.pickup_days_status['thursday'] = false;
        this.addWorkingTimesForm.get('p_thursday_to').setValue(this.workingPickupTimes.p_thursday_to);
      }

      if(this.workingPickupTimes.p_friday_from != null){
       this.addWorkingTimesForm.get('p_friday_to').setValue(new Date(moment(this.workingPickupTimes.p_friday_to, 'HH:mm:ss').toString()));
      }else{
         this.pickup_days_status['friday'] = false;
        this.addWorkingTimesForm.get('p_friday_to').setValue(this.workingPickupTimes.p_friday_to);
      }

      if(this.workingPickupTimes.p_saturday_to != null){
        this.addWorkingTimesForm.get('p_saturday_to').setValue(new Date(moment(this.workingPickupTimes.p_saturday_to, 'HH:mm:ss').toString()));
      }else{
         this.pickup_days_status['saturday'] = false;
        this.addWorkingTimesForm.get('p_saturday_to').setValue(this.workingPickupTimes.p_saturday_to);
      }


      if(this.workingPickupTimes.p_sunday_to != null){
         this.addWorkingTimesForm.get('p_sunday_to').setValue(new Date(moment(this.workingPickupTimes.p_sunday_to, 'HH:mm:ss').toString())); 
      }else{
        this.pickup_days_status['sunday'] = false;
        this.addWorkingTimesForm.get('p_sunday_to').setValue(this.workingPickupTimes.p_sunday_to);
      } 

    });    
  }

  onCheckboxChange(event, day) {
    let  dayfrom= 'p_'+day+'_from';
    let dayto=   'p_'+day+'_to';
    let WorkingTimes = this.addWorkingTimesForm as FormGroup;
    if (event.checked) {
      this.pickup_days_status[day] = false;
             WorkingTimes.get(dayfrom).setValue(null);
             WorkingTimes.get(dayto).setValue(null);
      // this.addWorkingTimesForm.patchValue({dayto : null });  
    } else {
      this.pickup_days_status[day] = true;
    }

  }

  onCheckboxDeliveryChange(event, day) {

    let  dayfrom= 'p_'+day+'_from';
    let dayto=   'p_'+day+'_to';
    if (event.checked) {
      this.delivery_days_status[day] = false;
      this.addWorkingTimesForm.get(dayfrom).setValue(null);
      this.addWorkingTimesForm.get(dayto).setValue(null)
    } else {
      this.delivery_days_status[day] = true;
    }

  }


  onSaveFieldClick(){
    let value = this.addWorkingTimesForm.value;

    console.log(value);
 let  pickup_working_times = {
    "p_monday_from" : value.p_monday_from !=null? moment(value.p_monday_from).format('HH:mm') :value.p_monday_from  ,
    "p_tuesday_from" : moment(value.p_tuesday_from).format('HH:mm'),
    "p_wednesday_from" : moment(value.p_wednesday_from).format('HH:mm'),
    "p_thursday_from" : moment(value.p_thursday_from).format('HH:mm'),
    "p_friday_from" : moment(value.p_friday_from).format('HH:mm'),
    "p_saturday_from" : moment(value.p_saturday_from).format('HH:mm'),
    "p_sunday_from" : moment(value.p_sunday_from).format('HH:mm'),
    "p_monday_to" : value.p_monday_to ! = null ? moment(value.p_monday_to).format('HH:mm') : value.p_monday_to,
    "p_tuesday_to" : moment(value.p_tuesday_to).format('HH:mm'),
    "p_wednesday_to" : moment(value.p_wednesday_to).format('HH:mm'),
    "p_thursday_to" : moment(value.p_thursday_to).format('HH:mm'),
    "p_friday_to" : moment(value.p_friday_to).format('HH:mm'),
    "p_saturday_to" : moment(value.p_saturday_to).format('HH:mm'),
    "p_sunday_to" : moment(value.p_sunday_to).format('HH:mm'),
}


let delivery_working_times = {
  "d_monday_from" : moment(value.d_monday_from).format('HH:mm'),
  "d_tuesday_from" : moment(value.d_tuesday_from).format('HH:mm'),
  "d_wednesday_from" : moment(value.d_wednesday_from).format('HH:mm'),
  "d_thursday_from" : moment(value.d_thursday_from).format('HH:mm'),
  "d_friday_from" : moment(value.d_friday_from).format('HH:mm'),
  "d_saturday_from" : moment(value.d_saturday_from).format('HH:mm'),
  "d_sunday_from" : moment(value.d_sunday_from).format('HH:mm'),
  "d_monday_to" : moment(value.d_monday_to).format('HH:mm'),
  "d_tuesday_to" : moment(value.d_tuesday_to).format('HH:mm'),
  "d_wednesday_to" : moment(value.d_wednesday_to).format('HH:mm'),
  "d_thursday_to" : moment(value.d_thursday_to).format('HH:mm'),
  "d_friday_to" : moment(value.d_friday_to).format('HH:mm'),
  "d_saturday_to" : moment(value.d_saturday_to).format('HH:mm'),
  "d_sunday_to" : moment(value.d_sunday_to).format('HH:mm')    
}

  let formData={ 
    "location_id" : this.url_id,
    'delivery_working_times' : JSON.stringify(delivery_working_times),
    'pickup_working_times': JSON.stringify(pickup_working_times)
  }
   // console.log('fomr data',JSON.stringify(formData));

    //data.push({
    /*let formData={  
      "location_id" : this.url_id,
      pickup_working_times:{"p_monday_from":"07:00:00","p_monday_to":"22:00:00","p_tuesday_from":"07:00:00","p_tuesday_to":"22:00:00","p_wednesday_from":"07:00:00","p_wednesday_to":"22:00:00","p_thursday_from":"07:00:00","p_thursday_to":"22:00:00","p_friday_from":"07:00:00","p_friday_to":"22:00:00","p_saturday_from":"07:00:00","p_saturday_to":"22:00:00","p_sunday_from":"07:00:00","p_sunday_to":"22:00:00"},
      delivery_working_times:{"d_monday_from":"08:00:00","d_monday_to":"22:00:00","d_tuesday_from":"07:00:00","d_tuesday_to":"22:00:00","d_wednesday_from":"07:00:00","d_wednesday_to":"22:00:00","d_thursday_from":"07:00:00","d_thursday_to":"22:00:00","d_friday_from":"07:00:00","d_friday_to":"22:00:00","d_saturday_from":"07:00:00","d_saturday_to":"22:00:00","d_sunday_from":"07:00:00","d_sunday_to":"22:00:00"}
    }*/
    //})
    
   //console.log('data',data);
   
    if(this.addWorkingTimesForm){
      this._foodService.addWorkingTimes(formData)
        .subscribe(response =>{  
          this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration        : 2000
            });
          this.router.navigate(['admin/food-reservation/location/workingtimes/'+this.url_id]);
          	
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

}
