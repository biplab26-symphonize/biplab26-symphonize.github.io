import { Component , ViewEncapsulation, Input } from '@angular/core';
import { MenusService, AppConfig } from 'app/_services';

@Component({
  selector: 'front-quick-panel',
  templateUrl: './front-quick-panel.component.html',
  styleUrls: ['./front-quick-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FrontQuickPanelComponent  {
  Menus: any[]=[];
  menuIds: string = '';
  @Input() homesettings: any;

  /**
   * Constructors
   */
  constructor(
    private _menusService:MenusService,
    private _appConfig: AppConfig
  ){
    
  }

  ngOnInit() {
    setTimeout(() => {
      if(this.homesettings.quicklink_menus.length>0){
        this.menuIds = this.homesettings.quicklink_menus.join();
        this._menusService.getMenusList({'menu_id':this.menuIds,'menu_status':'A'}).subscribe(menulist=>{
          if(menulist && menulist.data){
            this.Menus = menulist.data
            console.log("menulist",this.Menus);
          }
        });
      }
    }, 1000);

  }
  /**Send MenuInfo to breadcumb */
  sendMenuItemInfo(item:any){
      this._appConfig.onMenuLoaded.next(item);
  }
}
