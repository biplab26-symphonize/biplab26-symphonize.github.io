import { Component, OnInit } from '@angular/core';
import { DiningReservationService,CommonService,OptionsList } from 'app/_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { Router } from '@angular/router';
//import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.scss'],
  animations : fuseAnimations
})
export class ViewBookingsComponent implements OnInit {
  
  public bookingValues : any;
  public guestsInfo : any = [];
  public CustomFormats      : any;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};

  constructor(private _diningService : DiningReservationService,
  private _fuseConfigService    : FuseConfigService,
  public  router 			    : Router,
  private _matSnackBar: MatSnackBar,
  public _matDialog: MatDialog,
  public _commonService    : CommonService) { 
     this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
     //Get Phone n datePicker Format 
    this.CustomFormats = OptionsList.Options.customformats;
    this.getBookingValues();
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  getBookingValues(){
    this.bookingValues = this._diningService.getViewBookingData();
    console.log('booki',this.bookingValues);
    this.guestsInfo = JSON.parse(this.bookingValues.guestinfo);
  }

  goDisplayBookingPage(){
    this.router.navigate(['dining-reservations']);
  }
  
  makeReservation(){
    this._diningService.addBooking(this.bookingValues,false)
      .subscribe(response =>{
        if(response.status==200){
          /*this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration        : 2000
              
          });*/ 
          this.router.navigate(['confirm-bookings/',response.bookinginfo.id]);
          this.bookingValues='';
          this._diningService.setViewBookingData(this.bookingValues);
        }       
        if(response.errorcode==500){
          this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration        : 2000
              
          });
          this.router.navigate(['dining-reservations/services']);   
        }     
    },
    error => {
      // Show the error message
      // this._matSnackBar.open(error.message, 'Retry', {
      //     verticalPosition: 'top',
      //     duration        : 2000
      // });
      this.showSnackBar(error.message,'CLOSE');
      this.router.navigate(['dining-reservations/services']);
    });
  }

  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }

}
