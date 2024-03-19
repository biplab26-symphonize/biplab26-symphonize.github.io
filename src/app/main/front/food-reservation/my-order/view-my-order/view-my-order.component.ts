import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { CommonService, AppConfig, OptionsList, FoodReservationService } from 'app/_services';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-view-my-order',
  templateUrl: './view-my-order.component.html',
  styleUrls: ['./view-my-order.component.scss'],
  animations: fuseAnimations
})
export class ViewMyOrderComponent implements OnInit {
  public currentUser: any;
  public url_id: number;
  public dateType: any;
  public fieldConfig: any = [];
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public generalSettings: any = {};
  public homeSettings: any = {};
  public timeformat: any;
  public value: any;
  public orderItems: any;
  type: any;
  public content: any = {};
  public orderLength: any;
  public CustomFormats: any;
  public quantityIndex: any = [];
  public sideNumberIndex: any = [];
  constructor(private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _foodReservationService: FoodReservationService,
    private _commonService: CommonService) {
    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });
    // Configure the layout 
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  ngOnInit() {
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    //Get Phone n datePicker Format 
    this.CustomFormats = OptionsList.Options.customformats;
    this.dateType = this.homeSettings.datetimeformat;
    this.currentUser = JSON.parse(localStorage.getItem('token'));
    this.getOrder();

    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  getOrder() {
    this._foodReservationService.getOrderContent(this.url_id)
      .subscribe(response => {
        this.content = response.orderinfo;
        this.content.created_at =  CommonUtils.getStringToDate(this.content.created_at);
        this.orderItems = this.content.orderitems;
        this.orderLength = this.orderItems.length; 
        if (this.content.booking_start_date && this.content.booking_start_time && this.content.booking_start_time != '00:00:00' && this.content.booking_start_time != 'ASAP') {
          this.content.booking_start_time = CommonUtils.getStringToDate(this.content.booking_start_date + ' ' + this.content.booking_start_time);
        }   
        console.log("content",this.content);
      });
  }
  // print display the value
  getPrint() {
    let params = [];
    params.push(
      {
        'id': this.url_id
      },
      {
        'print': '1'
      }
    );
    this._foodReservationService.getPrintOrdergentry('foodreservation/view/foodorder', params)
  }
  getQuantity(quantity) {
    this.quantityIndex = [];
    for (let i = 0; i < quantity; i++) {
      this.quantityIndex[i] = i + 1;
    }
  }
  getSideNumber(sideNumber) {
    this.sideNumberIndex = [];
    let k = 0;
    for(let i = 1; i < sideNumber; i++){
      this.sideNumberIndex[k] = k + 1;
      k = k + 1;
    }
  }

}
