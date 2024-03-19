import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CommonService, PostSmtpService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { SanitizeHtmlPipe } from '@fuse/pipes/sanitize-html.pipe';

@Component({
  selector: 'app-viewlog',
  templateUrl: './viewlog.component.html',
  styleUrls: ['./viewlog.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [SanitizeHtmlPipe]
})
export class ViewlogComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public title: any;
  public url_id: any;
  public viewData: any;
  public From
  public To
  public Subject;
  public Date;
  public Body;
  constructor(
    private _commonService: CommonService,
    private _matSnackBar: MatSnackBar,
    private _smtpService: PostSmtpService,
    private route: ActivatedRoute,
  ) {

    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });
    this._smtpService.getEmailContent(this.url_id).subscribe(res => {
      console.log(res);
      this.viewData = res.email_log;
      this.From = this.viewData.from;
      this.To = this.viewData.to;
      this.Date = this.viewData.date;
      this.Subject = this.viewData.subject;
      this.Body = this.viewData.body;
    })
  }

  ngOnInit() {
    this.title = "View Email Log"

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
