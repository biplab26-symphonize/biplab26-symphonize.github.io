import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend} from '@angular/common/http';

@Injectable({
providedIn: 'root'
})
export class OptionsList {

static Options: any;
private http: HttpClient;
constructor(private httpBackEnd: HttpBackend) {
    this.http = new HttpClient(httpBackEnd);
}
load() {
    const jsonFile = 'assets/options-list.json';
    return new Promise<void>((resolve, reject) => {
    this.http.get(jsonFile).toPromise().then((response) => {
        OptionsList.Options = response;
        resolve();
    }).catch((response: any) => {
       reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
    });
    });
 }
}