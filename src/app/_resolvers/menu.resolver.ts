import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MenusService } from 'app/_services';
import { Observable } from 'rxjs';
@Injectable()
export class MenuResolver implements Resolve<any> {
    private filterParams: Object={'position':'M'};
    constructor(
      private _menusService: MenusService) {
      }

      resolve(route: ActivatedRouteSnapshot): Observable<any> {  
        this.filterParams = {menu_id:route.params.id}
        return this._menusService.getMenu(this.filterParams);  
      }  
}