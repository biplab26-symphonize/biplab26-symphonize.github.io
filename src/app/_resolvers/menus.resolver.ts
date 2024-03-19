import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MenusService } from 'app/_services';
import { Observable } from 'rxjs';
@Injectable()
export class MenusResolver implements Resolve<any> {
    private filterParams: Object={'position':'','trash':''};
    constructor(
      private _menusService: MenusService) {
      }

      resolve(route: ActivatedRouteSnapshot): Observable<any> {  
        this.filterParams['trash']              = route.data.trash ? route.data.trash : '';
        this.filterParams['menu_source']        = route.data.menu_source ? route.data.menu_source : '';
        this.filterParams['menu_source_type']   = route.data.menu_source_type ? route.data.menu_source_type : '';
        this.filterParams['type']               = route.data.type ? route.data.type : '';
        this.filterParams['status']             = route.data.status ? route.data.status : '';
        this.filterParams['page']             = 0;
        this.filterParams['limit']             = 10;
        
        return this._menusService.getMenusList(this.filterParams);  
      }  
}