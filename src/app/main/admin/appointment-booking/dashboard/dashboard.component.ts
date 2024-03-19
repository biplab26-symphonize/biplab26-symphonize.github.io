import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AppConfig, AppointmentBookingService, CommonService } from 'app/_services';
import * as moment from 'moment';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public service_id: any;
  public dashboarddataB: FormGroup;
  public DaystartTime: any
  public DayendTime: any
  public TotalLength: any;
  public date
  public ShowServices: any = [];
  public GetTimeSlot: any = [];
  public timeStops: any = [];
  filterParams: any = {};
  filterParamsPrint: any = {};
  public BookingData: any;
  public defaultTimeSlot: boolean = false;
  public serviceNotAvilable: boolean = false;
  //public service_id: any;
  public defaultServiceData: any;
  public dashboarddata: any = [];
  public checkBooking: any;
  public activeElement = 1;
  public filterDate: any;
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  constructor(
    private _commonService: CommonService,
    private fb: FormBuilder,
    private appointementbookingservices: AppointmentBookingService,) {
    this.checkBooking = 'No';

  }

  ngOnInit() {

    this.date = new FormControl(new Date());
    this.appointementbookingservices.getServices({ 'status': 'A' }).subscribe(response => {
      this.ShowServices = response.data;

      let i = 0;
      this.ShowServices.forEach(item => {
        if (i == 0) {
          this.service_id = item.id;
        }
        i = i + 1;
      });
      let selecteddate = moment(this.date.value).format('YYYY-MMM-DD');

      this.filterParams['service_id'] = this.service_id;
      this.filterParams['dashboard'] = '1';
      this.filterParams['date'] = selecteddate;
      this.get_servicedata(selecteddate);
    });

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
  }
  // set the next day date  to the date picker
  Setnextdate() {
    this.date.setValue(new Date());
    this.date.setValue(new Date(this.date.value.setDate(this.date.value.getDate() + 1)));
    let selecteddate = moment(this.date.value).format('YYYY-MMM-DD');
    this.filterParams['service_id'] = this.service_id;
    this.filterParams['dashboard'] = '1';
    this.filterParams['date'] = selecteddate;
    this.get_servicedata(selecteddate);
  }
  getServiceTimeSlot() {
    let selecteddate = moment(this.date.value).format('YYYY-MMM-DD');
    this.filterParams['service_id'] = this.service_id;
    this.filterParams['dashboard'] = '1';
    this.filterParams['date'] = selecteddate;
    this.get_servicedata(selecteddate);
  }
  // set the todays day date  to the date picker
  SetTodyasDate() {
    this.date.setValue(new Date());
    let selecteddate = moment(this.date.value).format('YYYY-MMM-DD');
    this.filterDate = moment(this.date.value).format('YYYY-MMM-DD');
    console.log("filterDate",this.filterDate);
    this.filterParams['service_id'] = this.service_id;
    this.filterParams['dashboard'] = '1';
    this.filterParams['date'] = selecteddate;
    this.get_servicedata(selecteddate);
  }

  get_servicedata(selecteddate) {
    let selecteddate2 = moment(this.date.value).format('YYYY-MM-DD');
    this.appointementbookingservices.viewService({ 'id': this.service_id, 'date': selecteddate }).subscribe(res => {
      //  this.defaultServiceData = res.serviceinfo; 
      let startdate = res.serviceinfo.service_start_date;
      let enddate = res.serviceinfo.service_end_date;
      this.DaystartTime = new Date(startdate + " " + res.serviceinfo.service_start_time);// get the timestamp of the start time
      this.DayendTime = new Date(enddate + " " + res.serviceinfo.service_end_time); // get the timestamp of the end time
      let start = this.DaystartTime.getTime();
      this.TotalLength = res.serviceinfo.length;
      let offset = this.DayendTime <= this.DaystartTime ? 86400 : 0;
      let serv_total = this.TotalLength * 60;
      let endOffset = this.DayendTime + offset - serv_total;

      if (res.serviceinfo.service_start_time == null) {
        this.serviceNotAvilable = true;
      } else {
        this.serviceNotAvilable = false;
      }
      res.serviceinfo.dates.forEach(item => {
        if (item.date == selecteddate2) {
          this.serviceNotAvilable = true;
        }
      });
      var startTime = moment(res.serviceinfo.service_start_time, 'HH:mm');
      var endTime = moment(res.serviceinfo.service_end_time, 'HH:mm');
      if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
      }
      this.timeStops = [];
      while (startTime < endTime) {
        this.timeStops.push(moment(startTime).format('HH:mm:ss'));
        startTime.add(this.TotalLength, 'minutes');

      }
      this.getFilteredBookings(this.filterParams);
    });
  }
  // display the services data 
  Displayservicesdata(service_id) {
    this.activeElement = service_id;
    this.defaultTimeSlot = true;
    this.service_id = service_id;
    let selecteddate = moment(this.date.value).format('YYYY-MMM-DD');
    this.filterParams['service_id'] = service_id;
    this.filterParams['dashboard'] = '1';
    this.filterParams['date'] = selecteddate;
    this.get_servicedata(selecteddate);

  }
  getFilteredBookings(params: any) {
    return this.appointementbookingservices.getBookingList(params).then(Response => {
      this.dashboarddata = Response.BookingList.data;
      console.log("dashboarddata", this.dashboarddata);
    });
  }
  bookingPrint(service_id) {
    let selecteddate = moment(this.date.value).format('YYYY-MMM-DD');
    this.filterParamsPrint['service_id'] = service_id;
    this.filterParamsPrint['print'] = '1';
    this.filterParamsPrint['date'] = selecteddate;
    return this.appointementbookingservices.getBookingList(this.filterParamsPrint).then(Response => {
      this.uploadInfo.avatar.url = (Response.pdfinfo ? AppConfig.Settings.url.mediaUrl + Response.pdfinfo : "");
      window.open(this.uploadInfo.avatar.url);
    });
  }
  chartMethod(time) {
    return (new Date("1955-11-05T" + time + "Z")).toLocaleTimeString("bestfit", {
      timeZone: "UTC",
      hour12: !0,
      hour: "numeric",
      minute: "numeric"
    });
  }

  checkBookingEntries(time) {
    this.checkBooking = 'No'
    if (this.dashboarddata !== undefined) {
      this.dashboarddata.forEach(item => {
        if (time == item.booking_start_time) {
          this.checkBooking = 'Yes';
        }
      });
    }

  }
}
