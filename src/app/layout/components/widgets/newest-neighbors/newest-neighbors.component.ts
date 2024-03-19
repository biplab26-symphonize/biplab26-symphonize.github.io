import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { User } from 'app/_models';
import { UsersService, AppConfig, CommonService, SettingsService } from 'app/_services';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'widget-newest-neighbors',
  templateUrl: './newest-neighbors.component.html',
  styleUrls: ['./newest-neighbors.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewestNeighborsComponent implements OnInit {

  @Input() homesettings: any;
  @ViewChild('carousel') carousel: any;
  public ShowField = [];
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  _localUserSettings: any;
  private _unsubscribeAll: Subject<any>;
  public CoreField = [];
  public metafield = [];
  _defaultAvatar: string;
  public neighborList: any = [];

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['prev', 'next'],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 3
      }
    }
  }

  constructor(
    private _userService: UsersService,
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private settingsservices: SettingsService,
    private _appConfig: AppConfig) {
      this._unsubscribeAll = new Subject();
     }

  ngOnInit() {
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
      this.setTheDefaultValue();
   });
  }

   ngOnChanges(){
      this.setTheDefaultValue();
    }

    setTheDefaultValue(){
      this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
      //Load Users Settings From Localstorage
      this._localUserSettings = this._appConfig._localStorage.value.settings;
      this._defaultAvatar = AppConfig.Settings.url.mediaUrl + this._localUserSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar;
      this.settingsservices.getSetting({ 'meta_type': 'U', 'meta_key': 'residentdirectorysearch' }).then(response => {
        this.ShowField = JSON.parse(response.settingsinfo.meta_value);
        this.CoreField = this.ShowField[0].neighbourcorefields.split(',')
        this.metafield = this.ShowField[0].neighbourmetafields;
  
       });
      this._userService.getResident({'limit':this.homesettings.neighbors_limit,'status':'A','direction':'desc','front':'1'}).subscribe(response=>{
        let residentData = response.data.map(c => new User().deserialize(c,'resident'));
        this.neighborList = residentData;
       });
    }
  ngAfterViewInit() {
    this.customOptions = {
      loop: false,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['prev', 'next'],
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 3
        }
      }
    }
  }

}
