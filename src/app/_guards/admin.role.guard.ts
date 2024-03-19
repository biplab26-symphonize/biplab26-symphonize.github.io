import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService,AppConfig, CommonService } from 'app/_services';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
  public navigation:any;  
  public adminRoleArray: any[]=[];
  public userroleId: number = 0;
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private _commonService: CommonService,
    private _fuseNavigationService: FuseNavigationService
  ) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const accessInfo = state.url;
      let adminRoles = this._commonService.getLocalSettingsJson('general_settings');
      if(adminRoles['adminaccess']!='' && adminRoles['adminaccess']!==undefined){
        this.adminRoleArray = adminRoles['adminaccess'].split(',').map(Number);
        let userStorage     = JSON.parse(localStorage.getItem('token'));
        this.userroleId     = userStorage!==null && userStorage!==undefined ? userStorage['role_id'] : 0 ;
        if(this.userroleId>0 && this.adminRoleArray.includes(this.userroleId)){
          return true;
        }
        this.router.navigate(['']);
        return false;
      }
      return true;
      
  }
  
}
