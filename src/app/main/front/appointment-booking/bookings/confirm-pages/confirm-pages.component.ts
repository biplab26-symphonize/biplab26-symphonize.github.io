import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentBookingService,AppConfig } from 'app/_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
//import { MatSnackBar } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CommonUtils } from 'app/_helpers'

@Component({
  selector: 'app-confirm-pages',
  templateUrl: './confirm-pages.component.html',
  styleUrls: ['./confirm-pages.component.scss'],
  animations : fuseAnimations
})
export class ConfirmPagesComponent implements OnInit {
  public booking_id: any;
  public appConfig: any;

  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private _appointmentService : AppointmentBookingService,
    private _fuseConfigService: FuseConfigService,
    private _matSnackBar: MatSnackBar){
    this.appConfig         = AppConfig.Settings;
    if(this.route.routeConfig.path=='fitness-reservation-confirm-bookings/:id' && this.route.params['value'].id>0){
			this.booking_id   = this.route.params['value'].id;
    }
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
  }

  exportToGoogle(){
    
    this._appointmentService.exportGoogleCal({id:this.booking_id}).subscribe(response=>{
      if(response.status==200){
        this.showSnackBar(response.message,'CLOSE');
        window.open(response.url, "_blank");
      }
      else{
        this.showSnackBar(response.message,'CLOSE');
      }
    });
  }

  exportToOutlook(){
    if(this.booking_id>0){
      window.open(this.appConfig.url.apiUrl+'download/appointmentbookingical?id='+this.booking_id, "_blank");
    }
  }

   /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
      this._matSnackBar.open(message, buttonText, {
          verticalPosition: 'top',
          duration        : 2000
      });
  }

  makeAnotherReservation(){
    this.router.navigate(['fitness-reservation/services']);
  }

  returnToHomePage(){
    this.router.navigate(['']);
  }

}
