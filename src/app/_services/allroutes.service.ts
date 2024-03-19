import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Router, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AllroutesService implements Resolve<any>{
  public routesList : any = [];
  constructor(
    private router : Router) {}

    resolve(): Observable<any>| Promise<any> | any {  
      return new Promise((resolve, reject) => {
        Promise.all('').then(
          () => {
            let currentPath:any=[];
              let routes = this.router.config;
              
              currentPath= routes.map(ele=>this.format(ele));
              let routesFilterdata= currentPath.filter(ele=>ele.name);
              
              let result = routesFilterdata.reduce(function(r, e) {
                r[e.name] = e.path;
                return r;
              },[]);
              this.routesList = result;
               resolve(result);
          },
        reject);
      });
    }
    format(ele)
    {
     
      let pathname;
      let name1;
      let path1;
   
      if(ele.name!==undefined && ele.name!=='')
      {
        pathname= ele.path
        name1=ele.name;
        path1=pathname
      }
      return{
        name :name1,
        path:path1
      }
    }

    //new added to get route for edit menu
    getRoutes() : Observable<any>| Promise<any> | any
    {
      let currentPath:any=[];
              let routes = this.router.config;
              
              currentPath= routes.map(ele=>this.format(ele));
              let routesFilterdata= currentPath.filter(ele=>ele.name);
              
              let result = routesFilterdata.reduce(function(r, e) {
                r[e.name] = e.path;
                return r;
              },[]);
              this.routesList = result;
             
    }
    //new added to get route for edit menu
}
