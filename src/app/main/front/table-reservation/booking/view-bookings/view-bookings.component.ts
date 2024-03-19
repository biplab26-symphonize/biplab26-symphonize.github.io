import { Component, OnInit } from '@angular/core';
import { TabelReservationService,CommonService,OptionsList } from 'app/_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { Router } from '@angular/router';
//import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef,MatDialog} from '@angular/material/dialog';
import { Subject, merge, BehaviorSubject, Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.scss'],
  animations : fuseAnimations
})
export class ViewBookingsComponent implements OnInit {
  
  public bookingValues : any;
  public bookingDataValues : any;
  public guestsInfo : any = [];
  public CustomFormats      : any;
    private _unsubscribeAll: Subject<any>;
    
  public notes : any;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};

  constructor(private _tableService : TabelReservationService,
  private _fuseConfigService    : FuseConfigService,
  public  router 			    : Router,
  private _matSnackBar: MatSnackBar,
  public _matDialog: MatDialog,
  public _commonService    : CommonService) { 
     this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
     //Get Phone n datePicker Format 
     this._unsubscribeAll = new Subject();
    this.CustomFormats = OptionsList.Options.customformats;
    this.getBookingValues();
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  getBookingValues(){
    this.bookingDataValues = this._tableService.getViewBookingData();
    this.bookingValues = this._tableService.getViewBookingDetailData();
    this.notes = this.bookingValues.notes;
    this.guestsInfo = JSON.parse(this.bookingValues.guestinfo);
  }

  goDisplayBookingPage(){
    this.router.navigate(['view-detail-bookings']);
  }
  
  // makeReservation(){
  //   this._tableService.addBooking(this.bookingValues,false)
  //     .subscribe(response =>{
  //       if(response.status==200){
  //         /*this._matSnackBar.open(response.message, 'CLOSE', {
  //             verticalPosition: 'top',
  //             duration        : 2000
              
  //         });*/ 
  //         this.router.navigate(['confirm-table-bookings/',response.bookinginfo.id]);
  //         this.bookingValues='';
  //         this._tableService.setViewBookingDetailData(this.bookingValues);
  //       }            
  //   },
  //   error => {
  //     // Show the error message
  //     // this._matSnackBar.open(error.message, 'Retry', {
  //     //     verticalPosition: 'top',
  //     //     duration        : 2000
  //     // });
  //     this.showSnackBar(error.message,'CLOSE');
  //     this.router.navigate(['view-detail-bookings']);
  //   });
  // }
  makeReservation(){
    this._tableService.addBooking(this.bookingValues,false)
      .subscribe(response =>{
        if(response.status==200){
          /*this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration        : 2000
              
          });*/ 
          this.router.navigate(['confirm-table-bookings/',response.bookinginfo.id]);
          this.bookingDataValues = '';
          this._tableService.setViewBookingData(this.bookingDataValues);
          this.bookingValues='';
          this._tableService.setViewBookingDetailData(this.bookingValues);
        }if(response.status==500){
          this.showSnackBar(response.message,'CLOSE');
          this.router.navigate(['restaurant-reservations/services']);
        }            
    },
    error => {
      // Show the error message
      // this._matSnackBar.open(error.message, 'Retry', {
      //     verticalPosition: 'top',
      //     duration        : 2000
      // });
      this.showSnackBar(error.message,'CLOSE');
      this.router.navigate(['view-detail-bookings']);
    });
  }

  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
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
