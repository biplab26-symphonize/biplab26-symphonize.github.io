import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { AuthService ,SettingsService} from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PrivacyComponent implements OnInit {

  public privacyForm:FormGroup;
  public user_id :number = 0;
  public isSubmit: boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _authService:AuthService,
    private _matSnackBar: MatSnackBar,
    private _settingService: SettingsService,
    private _formBuilder: FormBuilder
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this.user_id = this._authService.currentUserValue.token.user.id;
    console.log(this._authService.currentUserValue.token.user);
  }

  ngOnInit() {
    this.privacyForm = this._formBuilder.group({
      user_id                             : this.user_id || 0,
      show_profile_res_dir                : this._formBuilder.control('Y',[Validators.required]),
      hide_email_res_dir                  : this._formBuilder.control('N',[Validators.required]),
      hide_phone_res_dir                  : this._formBuilder.control('N',[Validators.required]),
      recive_all_resident_email_notify    : this._formBuilder.control('N',[Validators.required],),
      message_notification_privacy        : this._formBuilder.control('everyone',[Validators.required],)
    });
    //Patch Updated Values To FormFields
    this.getUserInfo();
  }
  getUserInfo() {
    this._settingService.getUserInfo(this.user_id)
      .then(response =>{ 
              if(response.status == 200){
                let userInfo = response.userinfo;
                this.fillFormValues(userInfo);
              }
            },
      error => error);
  }
  fillFormValues(userInfo){
    if(userInfo){
      this.privacyForm.patchValue(userInfo);
    }    
  }
  //Save Privacy Settings
  onSubmit(event){
    event.preventDefault();
    event.stopPropagation();
    if (this.privacyForm.valid){
        this.isSubmit = true;        
        this._settingService.updatePrivacy(this.privacyForm.value)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if(data.status==200){
              this.showSnackBar(data.message,'CLOSE');
            }
            else{
              this.showSnackBar(data.message,'CLOSE');
            }
          },
          error => {
            // Show the error message
            this.showSnackBar(error.message,'CLOSE');
          });
    }
    else{
      CommonUtils.validateAllFormFields(this.privacyForm)
    }
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }
}
