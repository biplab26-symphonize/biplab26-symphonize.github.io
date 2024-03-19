import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CategoryService, RolesService, SettingsService } from 'app/_services';
@Injectable()
export class AddEventResolver implements Resolve<any> {
  constructor(
    private _categoryService:CategoryService,
    private _roleService:RolesService,
    private _settingService : SettingsService) {

  }

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {

    return new Promise((resolve, reject) => {
        Promise.all([
            this._categoryService.getCategorys({'category_type':'EL','status':'A'}),
            this._roleService.getRoles({'type': ''}),
            this._settingService.getSetting({'meta_key':'event-settings'})
        ])
        .then(() => {resolve();},reject);
    });
  }
}