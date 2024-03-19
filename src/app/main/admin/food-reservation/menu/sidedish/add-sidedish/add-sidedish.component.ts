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
  selector: 'app-add-sidedish',
  templateUrl: './add-sidedish.component.html',
  styleUrls: ['./add-sidedish.component.scss'],
  animations: fuseAnimations
})
export class AddSidedishComponent implements OnInit {
  title: string;
  public addSideDish: FormGroup;
  public editSideDish: boolean = false;
  public isSubmit : boolean = false;
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
    this.title = 'Food Reservation Side Dish';
    if (this.route.routeConfig.path == 'admin/food-reservation/sidedish/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editSideDish = true;
    }
    this.url_id ? this.title = "Update Side Dish" : this.title = "New Side Dishes";
  }

  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.addSideDish = this.fb.group({
      side_dish_name: this.fb.control('', [Validators.required]),
      id: this.editSideDish == true ? this.url_id : '',
    });
    if (this.route.routeConfig.path == 'admin/food-reservation/sidedish/edit/:id') {
      //this.fillSideDishValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this.foodReservation.getSideDishList({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              this.fillSideDishValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
            this.fillSideDishValues();
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
        data: { type: 'updateSideDish', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/food-reservation/menu/sidedish/list']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictSideDish();
        }
      });
    }
  }
  editRestrictSideDish() {
    this.foodReservation.updateForm(this.url_id, 'foodsidedish').subscribe(response => {      
      this.fillSideDishValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.side_dish, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
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
      data: { type: 'updateSideDish', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/food-reservation/menu/sidedish/list']);
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
      this.confirmDialogRef.componentInstance.type = 'foodsidedish';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillSideDishValues() {
    let edit: boolean = true;
    this.foodReservation.getSideDishContents(this.url_id,edit).subscribe(response => {
      let formData = response.sidedishinfo;
      this.addSideDish.patchValue(formData);
    });
  }
  onSubmit() {
    this.savingEntry = true;
    let sideDishData = this.addSideDish.value;
    this.isSubmit = true;
    console.log("side dish",sideDishData);
    this.foodReservation.addSideDish(sideDishData, this.editSideDish).subscribe(response => {
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.router.navigate(['/admin/food-reservation/menu/sidedish/list']);
    },
      error => {
        // Show the error message
        this.isSubmit = false;
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }
// on click cancel button
  Cancel(){
    this.router.navigate(['/admin/food-reservation/menu/sidedish/list']);
  }

}
