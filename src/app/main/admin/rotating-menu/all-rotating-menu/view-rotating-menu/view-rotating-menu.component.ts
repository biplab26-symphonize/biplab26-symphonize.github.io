import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RotatingMenuService, AppConfig, CommonService } from 'app/_services';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-view-rotating-menu',
  templateUrl: './view-rotating-menu.component.html',
  styleUrls: ['./view-rotating-menu.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ViewRotatingMenuComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public url_id;
  public rotationnumber: any;
  public showmsg: boolean = false;
  public defaultmsg: any;
  public StartDate: any
  public Displaydata: any;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };

  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };


  constructor(
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private _rotatingmenuservices: RotatingMenuService,

  ) {

    this.route.params.subscribe(params => {
      this.url_id = params.id;

    });
  }

  ngOnInit() {


    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;

    if (this.url_id !== undefined) {
      this._rotatingmenuservices.viewallrotatingmenu({ 'id': this.url_id }).subscribe(res => {

        if (res.rotatingmenuinfo !== undefined) {
          this.rotationnumber = res.rotatingmenuinfo.rotation_number;
          this.StartDate = res.rotatingmenuinfo.start_date;
          this.Displaydata = res.rotatingmenuinfo.pdfinfo;
        } else {
          this.rotationnumber = res.week_no;
          this.StartDate = res.date;
          this.showmsg = true;
          this.defaultmsg = res.pdf

        }

      })

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
    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      console.log("element", element);
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });

  }

  viewpdf(Url) {
    this.uploadInfo.avatar.url = (Url ? AppConfig.Settings.url.mediaUrl + Url : "");
    window.open(this.uploadInfo.avatar.url);
  }
  savesetting($event) {
    return true;
  }

}
