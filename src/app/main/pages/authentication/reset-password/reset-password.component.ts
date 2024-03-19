import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; //EXTRA Changes

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/_services';

@Component({
    selector     : 'reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{
    resetPasswordForm: FormGroup;
    resettoken: string='';
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            colorTheme   : 'theme-viibrant',
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        //Get token from url
        this.route.params.subscribe( params => {
            this.resettoken = params.token;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.resetPasswordForm = this._formBuilder.group({
            token           : [this.resettoken, Validators.required],
            newpassword     : ['', Validators.required],
            passwordConfirm : ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'newpassword' field changes
        this.resetPasswordForm.get('newpassword').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // convenience getter for easy access to form fields
    /**
     * RESET PASSWORD
     */
    onResetPassword():void {
        
        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }
        console.log(this.resetPasswordForm.value);
        this.authenticationService.reset(this.resetPasswordForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    // Show the success message
                    this._matSnackBar.open(data.message, 'CLOSE', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });
                    this.router.navigate(['/authentication/login']);
                },
                error => {
                    // Show the success message
                    this._matSnackBar.open(error.message, 'Retry', {
                        verticalPosition: 'top',
                        duration        : 2000
                    });
                });
    }

}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('newpassword');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
