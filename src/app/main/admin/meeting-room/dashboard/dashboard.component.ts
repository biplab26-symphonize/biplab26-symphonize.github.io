import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingRoomService, AppConfig } from 'app/_services';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  title: string;
  public bookingsmadetoday: any;
  public bookingsfortoday: any;
  public totalbookingsmade: any;
  public latestBookingList: any;
  public date;
  filterParamsPrint: any = {};
  orderFilter: any;
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  constructor(private _meetingRoomService :MeetingRoomService,private router : Router) { 
    this.title = 'Meeting Room';
  }
  
  ngOnInit() {
    this.date = new FormControl(new Date());
    this.getMeetingaRoomDashboardData();    
    this.getLatestBookingDashboardData();    
  }
  getOrderListData(){
    this.router.navigate(['admin/food-reservation/orders/orders-list',{ type: 'pickup', status:'A' }]);
  }
  // getOrderList(params: any) {
  //   return this._foodReservation.getProductCategoryList(params).then(Response => {
  //     this.categoryData = Response.data;
  //   });
  // }
  getMeetingaRoomDashboardData() {
    return this._meetingRoomService.getMeetbookingcountDashboardData().subscribe(Response => {
       this.bookingsmadetoday = Response.bookingsmadetoday;
       this.bookingsfortoday = Response.bookingsfortoday;
       this.totalbookingsmade = Response.totalbookingsmade;      
    });
    
  }
  getLatestBookingDashboardData(){
    return this._meetingRoomService.getMeetlatestbookingDashboardData().subscribe(Response => {      
      this.latestBookingList = Response.BookingList;
    });
  }
  bookingPrint() {
    let selecteddate = moment(this.date.value).format('YYYY-MM-DD');
    this.filterParamsPrint['print'] = '1';
    this.filterParamsPrint['date'] = selecteddate;
    return this._meetingRoomService.getBookingList(this.filterParamsPrint).then(Response => {
      this.uploadInfo.avatar.url = (Response.pdfinfo ? AppConfig.Settings.url.mediaUrl + Response.pdfinfo : "");
      window.open(this.uploadInfo.avatar.url);
    });
  }

}
