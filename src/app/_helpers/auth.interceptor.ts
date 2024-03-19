import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'app/_services';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { tap,finalize } from 'rxjs/operators';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

@Injectable()

export class LoaderAuthInterceptor implements HttpInterceptor {

   authToken: any;

   constructor(
   	private router: Router,
	private _authService: AuthService,
	private _fuseProgressBarService: FuseProgressBarService) {
   }
  
   	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		//SHOW LOADER
		this._fuseProgressBarService.show();

    	let changedRequest = request;
	    const headerSettings: {[name: string]: string | string[]; } = {};

	    for (const key of request.headers.keys()) {
	      headerSettings[key] = request.headers.getAll(key);
		}	
			this.authToken = this._authService.currentUserValue.tokenstring ? this._authService.currentUserValue.tokenstring : "";
			// this.authToken = token ? token : "";
			if (this.authToken) {
			headerSettings['Authorization'] = 'Bearer ' + this.authToken;
			}
		
		
	    if(changedRequest.url){
		    const newHeader = new HttpHeaders(headerSettings);
		    changedRequest = request.clone({headers: newHeader});
	    }
		//return next.handle(changedRequest);
	    return next.handle(changedRequest).pipe(tap((event: HttpEvent<any>) => { 
	      if (event instanceof HttpResponse) {
	      	if(event.body.errorcode==391 || event.body.errorcode==400)
	      	{
				if(this.authToken){
					this._authService.logout().subscribe(response =>{
						this.router.navigate(['/authentication/login']);        
					});
				}
				else{
					localStorage.removeItem('token');
                    localStorage.removeItem('settings');
                    localStorage.removeItem('themesettings');
                    localStorage.removeItem('userInfo');
                    this.router.navigate(['/authentication/login']);
				}
	      	}
	      }
	    },
	      (err: any) => {
			this.onEnd(err);
	    }),finalize(() => this._fuseProgressBarService.hide())); //HIDE LOADER 
	
}

	private onEnd(err:any): void {
		if(err.status==0){
			localStorage.removeItem('token');
			localStorage.removeItem('settings');
			localStorage.removeItem('themesettings');
			localStorage.removeItem('userInfo');
			localStorage.removeItem('currentUser');
			this.router.navigate(['/authentication/login']); 
			//console.log("err>>>>>>>>>>>>>",err);
		}
	}
}