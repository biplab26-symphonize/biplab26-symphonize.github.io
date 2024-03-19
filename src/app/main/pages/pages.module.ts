import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar'; //Extra Changes
import { LoginModule } from 'app/main/pages/authentication/login/login.module';
import { ForgotPasswordModule } from 'app/main/pages/authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
import { Error404Module } from 'app/main/pages/errors/404/error-404.module';
import { Error500Module } from 'app/main/pages/errors/500/error-500.module';

@NgModule({
    imports: [
        //snack bar 
        MatSnackBarModule,
        
        // Authentication
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,

        // Errors
        Error404Module,
        Error500Module,
    ]
})
export class AuthenticationModule
{

}
