import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProfileService } from 'app/_services';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<any> {

  constructor(private _profile: ProfileService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._profile.getProfileInfo().pipe(
      catchError((error) => {
        return empty();
      })
    );
  }
}