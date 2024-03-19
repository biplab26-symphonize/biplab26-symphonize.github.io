import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CategoryService, SettingsService } from 'app/_services';
@Injectable()
export class AddStaffResolver implements Resolve<any> {
  constructor(
    private _categoryService:CategoryService,
    private _settingService:SettingsService) {

  }

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {

    return new Promise((resolve, reject) => {
        Promise.all([
            this._categoryService.getDeptCategory({'category_type': 'DEPT,SUBDEPT'  ,'dept':'Y','status':'A','direction':'asc','column':'category_name'}),
            this._categoryService.getCategorys({'category_type':'DESIGNATION','status':'A','direction':'asc','column':'category_name'}),
            this._settingService.getSetting({'meta_key': 'staff_settings'})
        ])
        .then(() => {resolve();},reject);
    });
  }
}