import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UsersService, AppConfig } from 'app/_services';
import { CommonUtils } from 'app/_helpers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { TermConditionComponent } from 'app/layout/components/footer/term-condition/term-condition.component';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations   : fuseAnimations,
})
export class WelcomeComponent implements OnInit {

  pwdhide = true;
  userInfo: any = {};
  localSettings: any;
  isSubmit: boolean=false;
  welcomeform: FormGroup;
  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _dialog: MatDialog,
    public dialogRef: MatDialogRef<WelcomeComponent>,
    private _authService:AuthService,
    private _usersService:UsersService,
    private _appConfig:AppConfig, 
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar
  ) {
    this.userInfo = this._authService.currentUserValue.token.user && this._authService.currentUserValue.token.user!==undefined ? this._authService.currentUserValue.token.user : {};
    
    if(Object.entries(this._appConfig.LocalSettings).length > 0){
      this.localSettings = CommonUtils.getStringToJson(this._appConfig.LocalSettings.general_settings);
    }
    
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.setWelcomeFormControls();
  }
  /**SET FORM FIELDS */
  setWelcomeFormControls(){
    //Declare For fields
    this.welcomeform = this._formBuilder.group({
      id        : [this.userInfo.id,[Validators.required]],
      email     : [this.userInfo.email,[Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      password  : ['',[Validators.required]],
      terms     : ['',[Validators.required]],
      last_login : [new Date()]
    });
   
  }
  //disable submit of checkbox unchecked
  setFormValidate($event){
    this.isSubmit = $event.checked==true ? false : true;
  }
  /** Update password */
  onSubmitPassword(){
    event.preventDefault();
    event.stopPropagation();
    if(this.welcomeform.valid){
      //this.isSubmit = true;
      //update password 
      this._usersService.updateWelcomePassword(this.welcomeform.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response=>{
        if(response.status==200){
          this.showSnackBar(response.message,'OK');
          this.updateLastLogin();          
        }
        else {
          this.showSnackBar(response.message,'OK');
        }
      },error=>{
        this.showSnackBar(error.message,'OK');
      });
    }
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }
  /** Update Last Login Localstorage */
  updateLastLogin(){
    let localtokenInfo = JSON.parse(localStorage.getItem('token'));
    if(localtokenInfo.last_login=='' || localtokenInfo.last_login==null){
      localtokenInfo.last_login = new Date().toJSON().slice(0, 19).replace('T', ' ');
      //update currentUserValue in auth service
      this._authService.currentUserValue = localtokenInfo;
      //update localstorage
      var localtokenInfoString = JSON.stringify(localtokenInfo);
      localStorage.setItem('token',localtokenInfoString);
    }
    this.dialogRef.close();
  }
  getTermCondition(){
    const dialogRef = this._dialog.open(TermConditionComponent, {
      disableClose: true,
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

}
