import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabelReservationService, CommonService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  animations: fuseAnimations,
})
export class ViewComponent implements OnInit {


  title: string;
  url_id: any;
  public reservationData: any;
  public name: any;
  public phone: any;
  public email: any;
  public min: any;
  public max: any;
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public ShowTablesize: any;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };

  constructor(private route: ActivatedRoute,
    private tablereservationservice: TabelReservationService,
    private _commonService: CommonService,) {
    this.title = 'Table Reservation Booking  Details';
    if (this.route.routeConfig.path == 'admin/restaurant-reservations/view/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
    }

  }

  ngOnInit() {
    this.tablereservationservice.getBookingContent(this.url_id).subscribe(response => {
      this.reservationData = response.bookinginfo;
      this.name = this.reservationData.name;
      this.phone = this.reservationData.phone;
      this.email = this.reservationData.email;
      this.min = this.reservationData.min_table_size;
      this.max = this.reservationData.max_table_size
      if (this.min == this.max) {
        this.ShowTablesize = true;
      } else {
        this.ShowTablesize = false;
      }
    });
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

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


}
