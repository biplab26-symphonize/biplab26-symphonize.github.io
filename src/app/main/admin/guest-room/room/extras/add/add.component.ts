import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService, OptionsList, GuestRoomService, CommonService, AuthService, ChatService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
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
  public pusherCounter = 0;
  public userId: any;
  public ann_list: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public roomEditRestriction: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public addExtrasForm: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editExtrasData: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  constructor(
     private _chatService: ChatService,
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _guestroomService: GuestRoomService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService) {

    this.title = "Add Extra";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/room/extras/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editExtrasData = true;
    }
  }

  ngOnInit(): void {
    this.extra_prices = OptionsList.Options.guest_room_extra_price;
    this.setControls();
  }


  setControls() {
    this.addExtrasForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      per_price: this.fb.control('day',[Validators.required])
    });
    if (this.route.routeConfig.path == 'admin/guest-room/room/extras/edit/:id') {
      //this.fillRoomsValues();
      this.getFilteredExtras();
    }
  }
  getFilteredExtras() {
    this._guestroomService.getExtraContents(this.url_id).subscribe(response => {
      this.roomEditRestriction = response.extrainfo;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      if (this.url_id == this.roomEditRestriction.id) {
        if (this.roomEditRestriction.editrestriction != null) {
          if (this.roomEditRestriction.editrestriction.user.id == this.userId) {
            let edit: boolean = true;
            this.fillRoomsValues(edit);
          }
          if (this.roomEditRestriction.editrestriction.user.id != this.userId) {
            this.editRestrict = true;
            this.userName = this.roomEditRestriction.editrestriction.user.username;
            localStorage.setItem("first_user", this.userName);
            this.firstUserId = this.roomEditRestriction.editrestriction.user.id;
          }
        } else {
          let edit: boolean = true;
          this.fillRoomsValues(edit);
        }
      }
      this.showDialog();
    });
  }


  showPopup() {
    const dialogRef = this._dialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'guestextra',
      data: { type: 'guestextra', body: '<h2>Recurring Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/events/all']);
      }
    });
  }


  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._dialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'guestextra',
        data: { type: 'guestextra', body: '<h2>Recurring Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/events/all']);
        }
        if (result == 'takeover') {
          this.editRestrictForm();
        }
      });
    }
  }

  editRestrictForm() {
    this._guestroomService.updateForm(this.url_id, 'guestextra').subscribe(response => {
      let edit: boolean = true;
      this.fillRoomsValues(edit);
    });
  }

  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.ann_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter == 1) {
        this.showPopup();
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
      this.confirmDialogRef.componentInstance.userId = this.userId;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'guestextra';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  canDeactivate() {

    alert('I am navigating away');
    let user = "x";
    if (user == "x") {
      return window.confirm('Discard changes?');
    }
    return true;
  }
  fillRoomsValues(edit:any) {
    this._guestroomService.getExtraContent(this.url_id,edit).subscribe(response => {      
      let formData = response.extrainfo;
      this.addExtrasForm.patchValue(formData);
    });
  }


  onSaveFieldClick() {
    this.savingEntry = true;
    if (this.addExtrasForm.valid) {
      this.isSubmit = true;
      let value = this.addExtrasForm.value;
      let formData = {
        'name': value.name,
        'price': value.price,
        'per_price': value.per_price,
        'status': 'A',
        'id': this.editExtrasData == true ? this.url_id : '',
      }
      if (this.addExtrasForm.valid) {
        this._guestroomService.addExtras(formData, this.editExtrasData)
          .subscribe(response => {
            this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration: 2000
            });
            this.router.navigate(['/admin/guest-room/room/extras/lists']);

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

}
