import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PageOptionsList {
  static Options: any;
  private http: HttpClient;
  constructor(private httpBackEnd: HttpBackend) {
      this.http = new HttpClient(httpBackEnd);
  }
  getPageOptions():Observable<any> {
      const jsonFile = 'assets/page-editor.json';
      return this.http.get(jsonFile);
  }
}
