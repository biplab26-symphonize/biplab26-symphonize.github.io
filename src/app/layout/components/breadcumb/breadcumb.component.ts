import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig, CommonService } from 'app/_services';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss'],
  animations : fuseAnimations
})
export class BreadcumbComponent implements OnInit {

  @Input() directoryTitle: string='';
  @Input() captialize: boolean=false;
  fuseConfig: any;
  defaultbgimage: string = environment.defaultheader;
  menuTitle: string = '';
  menubgimage: string = '';
  public _defaultBreadSettings: any; 
  dateTemp : any = Math.random();
  public display: number=0;
  private _unsubscribeAll: Subject<any>;
  menuInfo: any = {};
  mediaUrl: string = AppConfig.Settings.url.mediaUrl;
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _sanitizer: DomSanitizer,
    private _appConfig:AppConfig,
    private _commonService:CommonService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Load fuseConfig to show breadcumb menuwise
    this._fuseConfigService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(
        (config) => {
            this.fuseConfig = config;
        });

    
    //Get Navigation List
    this._appConfig.onMenuLoad
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((menusresponse) => {
        if(menusresponse!==null){
          this.menuInfo = menusresponse;
          this.menuTitle = this.menuInfo.menu_title;
          if(this.menuInfo && this.menuInfo.page_title){
            this.menuTitle = this.menuInfo.page_title;
          }
          if(this.menuInfo && this.menuInfo.media && this.menuInfo.media.image){
            this.menubgimage = this.menuInfo.media.image;
          }
        }
    });

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
      this.setRoutermenuInfo();
    });
  }
  setRoutermenuInfo(){
    //Get Navigation List
    this._appConfig.onMenuLoad
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((menusresponse) => {
        if(menusresponse!==null){
          this.menuInfo = menusresponse;
          this.menuTitle = this.menuInfo.menu_title;
          if(this.menuInfo && this.menuInfo.page_title){
            this.menuTitle = this.menuInfo.page_title;
          }
          if(this.menuInfo && this.menuInfo.media && this.menuInfo.media.image){
            this.menubgimage = this.menuInfo.media.image;
          }
        }
    });
  }
  ngOnChanges(){
    this.directoryTitle = this.directoryTitle;
    this.captialize     = this.captialize || false;
  }
  //Set Background Image SafeUrl
  getBackground(image) {
    if(image!==''){
      return this._sanitizer.bypassSecurityTrustStyle(`url(${this.mediaUrl+image+'?'+this.dateTemp})`);
    }
    else{
      return this._sanitizer.bypassSecurityTrustStyle(`url(${this.defaultbgimage})`);
    };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      // this._appConfig.onMenuLoaded.next(null);
  }

}
