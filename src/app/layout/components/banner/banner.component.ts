import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { CommonService, SettingsService, AppConfig } from 'app/_services';
import { SanitizeHtmlPipe } from '@fuse/pipes/sanitize-html.pipe';
@Component({
  selector: 'featured-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: fuseAnimations,
  providers: [SanitizeHtmlPipe]
})
export class BannerComponent implements OnInit {
  @Input() homesettings: any;
  public homeSettingsdata: any;
  public DisplayFront_Title: any;
  public Default_URL: any;
  public AppConfig: any;
  public MEDIA_URL: string;
  public Image_URL : string='';
  public bgvisibility:string='hidden';
  Columns: [];  
  displayedColumns: string[];
  length: number = 0;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _commonService: CommonService,
    private settingsservices: SettingsService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.AppConfig = AppConfig.Settings;
    this.MEDIA_URL = this.AppConfig.url.mediaUrl;
  }


  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.homeSettingsdata = this._commonService.getLocalSettingsJson('home_settings');    
    this.homeSettingsdata  = this.homesettings;
    if(this.homeSettingsdata && this.homeSettingsdata.featured_image == "Y"){
      this.DisplayFront_Title = this.homeSettingsdata.front_title;
      this.Image_URL  = this.MEDIA_URL +this.homeSettingsdata.featured_image_url;
    }
  }
  ngOnChanges(){
    if(this.homeSettingsdata && this.homeSettingsdata.featured_image == "Y"){
      this.DisplayFront_Title = this.homeSettingsdata.front_title;
      this.Image_URL          = this.MEDIA_URL +this.homeSettingsdata.featured_image_url;    
    } 
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
