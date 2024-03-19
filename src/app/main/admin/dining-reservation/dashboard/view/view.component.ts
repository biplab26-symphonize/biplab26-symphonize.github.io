import { Component, OnInit } from '@angular/core';
import { CommonService, DiningReservationService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  animations: fuseAnimations
})
export class ViewComponent implements OnInit {
  public green_bg_header: any;
  public button: any;
  public accent: any;
  title: string;
  url_id: any;
  public reservationData: any;

  constructor(private _commonService: CommonService,private route: ActivatedRoute, private _diningService: DiningReservationService) {
    this.title = 'Reservation Details';
    if (this.route.routeConfig.path == 'admin/dining-reservation/view/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
    }
    console.log(this.url_id);
  }

  ngOnInit() {
    if (this.route.routeConfig.path == 'admin/dining-reservation/view/:id') {
      this.getBookingData();
    }

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

  getBookingData() {
    this._diningService.getBookingContent(this.url_id).subscribe(response => {
      console.log(response.bookinginfo);
      this.reservationData = response.bookinginfo;
    });
  }
}
