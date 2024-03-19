import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService,AppConfig } from 'app/_services';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private _appConfig: AppConfig
  ) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const accessInfo = {url:state.url};
      let issetUrl = this.authenticationService.setUrlParam(accessInfo);
      if(issetUrl){
        return this.authenticationService.isAccessible.pipe(map(res => {
          if (!res.menuinfo){
            this.router.navigate(['/errors/error-404']);
          }
          return !!res.menuinfo || true;
        }));
      }
  }
  
}
