import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodReservationService, CommonService } from 'app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  title: string;
  public todaydeliveryordercount: any;
  public todaypickupordercount: any;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public totalordercount: any;
  public latestdeliverybookings: any;
  public latestpickupbookings: any;
  public locationworkingstatus: any;
  orderFilter: any;
  constructor(private foodreservation :FoodReservationService,private router : Router,
   private  _commonService : CommonService) { 
    this.title = 'Food Reservation Categories';
  }
  
  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.getFoodDashboardData();    
  }
  getOrderListData(){
    this.router.navigate(['admin/food-reservation/orders/orders-list',{ type: 'pickup', status:'A' }]);
  }
  // getOrderList(params: any) {
  //   return this._foodReservation.getProductCategoryList(params).then(Response => {
  //     this.categoryData = Response.data;
  //   });
  // }
  getFoodDashboardData() {
    return this.foodreservation.getFoodReservationDashboardData().subscribe(Response => {
      this.todaydeliveryordercount = Response.todaydeliveryordercount;
      this.todaypickupordercount = Response.todaypickupordercount;
      this.totalordercount = Response.totalordercount;
      this.latestdeliverybookings = Response.latestdeliverybookings;
      this.latestpickupbookings = Response.latestpickupbookings;
      this.locationworkingstatus = Response.locationworkingstatus;
     
    });
  }

}
