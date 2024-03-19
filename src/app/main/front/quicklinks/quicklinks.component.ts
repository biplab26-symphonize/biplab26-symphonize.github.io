import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { fuseAnimations } from '@fuse/animations';
import { AppConfig, MenusService } from 'app/_services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute,Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.scss'],
  animations: fuseAnimations
})
export class QuicklinksComponent implements OnInit {
  menuInfo: any = {};
  isSubMenu = false;
  isLoading:boolean=false;
  pageName: string = '';
  directoryTitle: string = '';
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private _appConfig: AppConfig,
    private route: ActivatedRoute,
    private _menusService: MenusService
  ) {
    this._unsubscribeAll = new Subject();
    this.pageName = this.route.params['value'].name;
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
         this.setEmptyMsg();
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this._appConfig.onMenuLoad
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((menusresponse) => {
        this.isLoading = false;
        if (menusresponse !== null) {
        
          this.isSubMenu = false;
          this.menuInfo = menusresponse;
          this.pageName = this.menuInfo.menu_title ? this.menuInfo.menu_title : this.pageName;
          this.directoryTitle = this.pageName;
          if (this.menuInfo.children && this.menuInfo.children.length>0){
            this.menuInfo.children.forEach(element => {
              element.isquicklink = false;
              if(element.menu_url.includes("quicklinks/")){
                element.isquicklink = true;
              }
            });
          }
          else if(this.menuInfo && this.menuInfo.menu_url!==''){
            let currentUrl = this.router.url.replace(/^\/+/, '');
            let menuUrl    = this.menuInfo.menu_url; 
            this._menusService.getMenu({menu_url:currentUrl}).subscribe(response=>{
              if(response && response.menuinfo && response.menuinfo.children.length>0){
                this.menuInfo = response.menuinfo;
                this.pageName = this.menuInfo.menu_title ? this.menuInfo.menu_title : this.pageName;
                this.directoryTitle = this.pageName;
                if (this.menuInfo.children && this.menuInfo.children.length>0){
                  this.menuInfo.children.forEach(element => {
                    element.isquicklink = false;
                    if(element.menu_url.includes("quicklinks/")){
                      element.isquicklink = true;
                    }
                  });
                }
              }
            });
          }
        }
        else{
          this.isSubMenu = true;
        }
      });
  }
  setEmptyMsg(){
    if (this.menuInfo && this.menuInfo.children && this.menuInfo.children.length==0){
      this.isSubMenu = true;
    }
  }
  /**Send MenuInfo to breadcumb */
  sendMenuItemInfo(item: any) {
    this._appConfig.onMenuLoaded.next(item);    
  }
  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
