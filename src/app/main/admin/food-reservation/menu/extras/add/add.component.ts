import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, ChatService, FoodReservationService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  title: string;
  public addExtras: FormGroup;
  public editExtra: boolean = false;
  public  isSubmit : boolean = false;
  public url_id: any;
  public user_id: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  constructor(private _dialog      : MatDialog,private _chatService: ChatService,private authenticationService: AuthService,private fb: FormBuilder, private foodReservation: FoodReservationService, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.title = 'Food Reservation Extra';
    if (this.route.routeConfig.path == 'admin/food-reservation/extras/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editExtra = true;
    }
    this.url_id ? this.title = "Update Extra" : this.title = "New Extra";
  }

  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.addExtras = this.fb.group({
      extra_name: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      id: this.editExtra == true ? this.url_id : '',
    });
    if (this.route.routeConfig.path == 'admin/food-reservation/extras/edit/:id') {
      //this.fillExtrasValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this.foodReservation.getExtrasList({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              this.fillExtrasValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
            this.fillExtrasValues();
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
        data: { type: 'updateExtras', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/food-reservation/menu/extras/list']);
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
    this.foodReservation.updateForm(this.url_id, 'foodextra').subscribe(response => {      
      this.fillExtrasValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.extras, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;      
      if (this.pusherCounter == 1) {
        this.showPopup();
      }

    });
  }
  showPopup() {
    const dialogRef = this._dialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'updateExtras', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/food-reservation/menu/extras/list']);
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
      this.confirmDialogRef.componentInstance.type = 'foodextra';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillExtrasValues() {
    let edit: boolean = true;
    this.foodReservation.getExtrasContents(this.url_id,edit).subscribe(response => {
      let formData = response.extrainfo;
      this.addExtras.patchValue(formData);
    });
  }
  onSubmit() {
    this.savingEntry = true;
    this.isSubmit =  true;
    let extras_data = this.addExtras.value;
    this.foodReservation.addExtras(extras_data, this.editExtra).subscribe(response => {
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.router.navigate(['/admin/food-reservation/menu/extras/list']);
    },
      error => {
        // Show the error message
        this.isSubmit =  false;
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  Cancel(){
    this.router.navigate(['/admin/food-reservation/menu/extras/list']);
  }

}
