import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AnnouncementService } from 'app/_services';
@Injectable()
export class ReplyResolver implements Resolve<any> {
  constructor(
    private _contentService:AnnouncementService) {

  }

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {

    return new Promise((resolve, reject) => {
        Promise.all([
            this._contentService.getLists({'content_type': 'forum'})
        ])
        .then(() => {resolve();},reject);
    });
  }
}