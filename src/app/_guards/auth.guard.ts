import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from 'app/_services';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { WelcomeComponent } from 'app/main/front/home/welcome/welcome.component';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    confirmDialogRef: MatDialogRef<WelcomeComponent>; //EXTRA Changes 
    
    constructor(
        private router: Router,
        public _matDialog: MatDialog,
        private authenticationService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser.isExpired===false) {
            
            //Open Welcome Popup For first time login user
            if(currentUser.last_login=='' || currentUser.last_login==null){
                this.openWelcomePopup();                       
            }
            
            // authorised so return true
            return true;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('settings');
        localStorage.removeItem('themesettings');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('currentUser');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/authentication/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    openWelcomePopup(){
        this.confirmDialogRef = this._matDialog.open(WelcomeComponent, {
            disableClose: true,
            width:'400px'
        });
        this.confirmDialogRef.afterClosed()
        .subscribe(result => {
        });
    }
}