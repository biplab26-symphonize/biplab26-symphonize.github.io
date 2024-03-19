import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService,SettingsService } from 'app/_services';
@Injectable()
export class UserSettingsResolver implements Resolve<any> {
  constructor(
      private _commonService: CommonService,
      private _settingService:SettingsService) {

      }

      resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const meta_key      = route.data.meta_key;
        const exportType    = route.data.exportype;
        const apiendPoint   = route.data.apiendpoint;
        console.log(route.data.meta_key,route.data.exportype,route.data.apiendpoint);
        return new Promise((resolve, reject) => {
            Promise.all([
                this._settingService.getSetting({'meta_key':meta_key}),
                this._commonService.getExportFields({'type':exportType},apiendPoint)
            ])
            .then(() => {resolve();},reject);
        });
      }
}