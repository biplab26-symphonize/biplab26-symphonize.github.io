import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiningReservationService, AppointmentBookingService, CommonService } from 'app/_services';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public accent: any;
  public green_bg_header: any;
  title: string;
  url_id: any;
  public date: any;
  public reservationData: any;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };

  constructor(private route: ActivatedRoute,
    private appointementbooking: AppointmentBookingService,
    private _commonService: CommonService) {
    this.title = 'Appointment Booking  Details';
    if (this.route.routeConfig.path == 'admin/fitness-reservation/view/:id/:date' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.date = this.route.params['value'].date;
    }
    console.log(this.url_id);
  }

  ngOnInit() {

    setTimeout(() => {
      if (this.route.routeConfig.path == 'admin/fitness-reservation/view/:id/:date') {
        this.getBookingData();
      }
    }, 200);
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };

  }

  getBookingData() {
    this.appointementbooking.getBookingContentsDashboard(this.url_id).subscribe(response => {
      console.log(response.bookinginfo);
      this.reservationData = response.bookinginfo;
    });
  }

}
