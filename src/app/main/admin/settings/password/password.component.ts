import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { AuthService ,SettingsService} from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  	selector: 'app-password',
  	templateUrl: './password.component.html',
  	styleUrls: ['./password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PasswordComponent implements OnInit {

    public ChangePasswordForm:FormGroup;
    public user_id :number = 0;
    public username : string;
    public pwdhide = true;
    public newpwdhide = true;
    public confirmpwdhide = true;
    public isSubmit: boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

  /**
     * Constructor
     * 
     * @param {FormBuilder} _formBuilder
     * @param {AuthService}_authService
    *  @param {_matSnackBar}MatSnackBar
    *  @param {_settingService}SettingsService
     */
    constructor(
         private _authService:AuthService,
         private _matSnackBar: MatSnackBar,
         private _settingService: SettingsService,
         private _formBuilder: FormBuilder ){

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.user_id = this._authService.currentUserValue.token.user.id;
        this.username = this._authService.currentUserValue.token.user.username;
    }

  ngOnInit() { 

      this.ChangePasswordForm = this._formBuilder.group({
          current_password : this._formBuilder.control('',[Validators.required]),
          new_password     : this._formBuilder.control('',[Validators.required]),
          confirm_password : this._formBuilder.control('',[Validators.required,confirmPasswordValidator])
        });

      // Update the validity of the 'passwordConfirm' field
      // when the 'password' field changes
      this.ChangePasswordForm.get('new_password').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
          this.ChangePasswordForm.get('confirm_password').updateValueAndValidity();
      });
  }

  onclickSave(event){
    event.preventDefault();
    event.stopPropagation();
    if (this.ChangePasswordForm.valid)
    {
        this.isSubmit = true;
        let value = this.ChangePasswordForm.value;
        
        let formValue = {
          'id': this.user_id,
          'oldpassword':value.current_password,
          'newpassword':value.new_password,
          'confirmpassword':value.confirm_password
        };

        let checkcurrentPasswordData = {
          'id': this.user_id,
          'username':this.username,
          'password': value.current_password
        }

        this._settingService.checkCurrentPassword(checkcurrentPasswordData)
         .then(response =>{
           if(response.useravailable){
              this._settingService.changePassword(formValue)
              .then(response =>
                { 
                  if(response.status == 200){
                    this.isSubmit = false;
                    // Show the success message
                    this._matSnackBar.open(response.message, 'Success', {
                      verticalPosition: 'top',
                      duration        : 2000
                    });
                    this.ChangePasswordForm.reset();
                  }
                  else{
                    this._matSnackBar.open(response.message.newpassword, 'Error', {
                      verticalPosition: 'top',
                      duration        : 2000
                    });
                  }
                });
           }
           else{
            this._matSnackBar.open("old password is incorrect", 'Error', {
              verticalPosition: 'top',
              duration        : 2000
            });
           }
         })
      }
      else
      {
        CommonUtils.validateAllFormFields(this.ChangePasswordForm)
      }
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

  const password = control.parent.get('new_password');
  const passwordConfirm = control.parent.get('confirm_password');

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
