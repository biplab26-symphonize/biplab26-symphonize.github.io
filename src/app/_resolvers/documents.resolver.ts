import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FilesService } from 'app/_services';
import { Observable } from 'rxjs';
@Injectable()
export class DocumentsResolver implements Resolve<any> {
    private filterParams: Object={'menu_type':'page','trash':'','column':'order','direction':'asc','limit':10};
    constructor(
      private _filesService: FilesService) {
      }

      resolve(route: ActivatedRouteSnapshot): Observable<any> {  
        this.filterParams['trash']              = route.data.trash ? route.data.trash : '';
        this.filterParams['type']               = route.data.type ? route.data.type : '';
        this.filterParams['menu_type']          = route.data.menu_type ? route.data.menu_type : '';
        this.filterParams['status']             = route.data.status ? route.data.status : '';
        this.filterParams['menu_id']            = route.params.id ? route.params.id : '';
        
        return this._filesService.getDocuments(this.filterParams);  
      }  
}