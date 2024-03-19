import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MenusService, AuthService, SettingsService, AppConfig, CommonService } from 'app/_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'front-footer',
  templateUrl: './front-footer.component.html',
  styleUrls: ['./front-footer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FrontFooterComponent implements OnInit {
  @Input() homesettings: any;
  @Input() generalsettings: any;
  private roles: any
  public footerMenu: any = [];
  public plainText;
  public homeSettingsdata: any;
  ShowFooter: boolean = false;
  //  private 
  private _unsubscribeAll = new Subject();

  constructor(
    private _commonService: CommonService,
    private _menusService: MenusService,
    private settingsservices: SettingsService,
    private _authService: AuthService,
    private _appConfig: AppConfig) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  ngOnInit() {
    // this.settingsservices.getSetting({'meta_type': 'S', 'meta_key': 'home_settings'}).then(response =>{
    //   if(response.settingsinfo && response.settingsinfo.meta_value){
    //     this.homeSettingsdata  = JSON.parse(response.settingsinfo.meta_value);
    //     if(  this.homeSettingsdata.footer_set  == 'Y')
    //     this.ShowFooter = true;
    //   }
    // })
    this.homeSettingsdata = this._commonService.getLocalSettingsJson('home_settings');
    if (this.homeSettingsdata.footer_set == 'Y') {
      this.ShowFooter = true;
    }
    this._menusService.getMenusList({ position: 'M', menu_status: 'A', menu_parent_id: 0, front: 1 })
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(menuresponse => {
        this.footerMenu = menuresponse.data;
      });

  }
  ngOnChanges() {
    this.plainText = this.generalsettings && this.generalsettings.copyright_content ? this.generalsettings.copyright_content : '';
  }
  /**Send MenuInfo to breadcumb */
  sendMenuItemInfo(item: any) {
    this._appConfig.onMenuLoaded.next(item);
  }

}
