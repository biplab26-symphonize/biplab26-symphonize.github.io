import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService, ChatService, MeetingRoomService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingRoommodel } from 'app/_models';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  public addDrinkForm: FormGroup;
  public title: string = '';
  public url_id: any;
  public editDrinkData: boolean = false;

  public user_id: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 

  constructor(
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _meetingRoomService: MeetingRoomService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
  ) {
    if (this.route.routeConfig.path == 'admin/meeting-room/amenities/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editDrinkData = true;
    }
    this.url_id ? this.title = "Update Amenities" : this.title = "New Amenities";


  }

  ngOnInit() {
    this.setControls();
  }

  setControls() {
    this.addDrinkForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      id: this.editDrinkData == true ? this.url_id : '',
    });

    if (this.route.routeConfig.path == 'admin/meeting-room/amenities/edit/:id') {
      //this.fillDrinkValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  
  getFilteredServices() {
    return this._meetingRoomService.getDrinkList({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              this.fillDrinkValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
            this.fillDrinkValues();
          }
        }
      });
      this.showDialog();
    });

  }
  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._dialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'updateFoodDrinks', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/meeting-room/amenities/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictStaff();
        }
      });
    }
  }
  editRestrictStaff() {
    this._meetingRoomService.updateForm(this.url_id, 'meetfooddrinks').subscribe(response => {      
      this.fillDrinkValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.food_drink, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;      
      if (this.pusherCounter != 2) {
        this.showPopup();
      }

    });
  }
  showPopup() {
    const dialogRef = this._dialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'updateFoodDrinks', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/meeting-room/amenities/list']);
      }
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.user_id;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'meetfooddrinks';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillDrinkValues() {
    let edit: boolean = true;
    this._meetingRoomService.getDrinkContents(this.url_id,edit).subscribe(response => {
      let formData = response.fooddrinksInfo;
      this.addDrinkForm.patchValue(formData);
    });
  }

  onSaveFieldClick() {
    this.savingEntry = true;
    let value = this.addDrinkForm.value;

    if (this.addDrinkForm.valid) {
      this._meetingRoomService.addDrink(value, this.editDrinkData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/meeting-room/amenities/list']);

        },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }

  }

}
