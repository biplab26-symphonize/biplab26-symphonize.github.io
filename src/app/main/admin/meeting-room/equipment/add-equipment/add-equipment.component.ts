import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
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
  selector: 'app-add-equipment',
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss'],
  animations : fuseAnimations
})
export class AddEquipmentComponent implements OnInit {
  public addEquipmentForm : FormGroup;
  public title : string = '';
  public url_id: any;
  public editEquipmentData : boolean = false;
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
    private authenticationService: AuthService,private fb : FormBuilder,
    private _meetingRoomService : MeetingRoomService,
    private _matSnackBar : MatSnackBar,
    private router       : Router,
    private route        : ActivatedRoute,
    private _dialog      : MatDialog) { 

    if(this.route.routeConfig.path=='admin/meeting-room/services/edit/:id' && this.route.params['value'].id>0){
			this.url_id   = this.route.params['value'].id;
      this.editEquipmentData = true;
    }
    this.url_id ? this.title = "Update Services":this.title = "New Services";
  
  }

  ngOnInit() {
    this.setControls(); 
  }

  setControls(){
    this.addEquipmentForm = this.fb.group({	
        title      : this.fb.control('',[Validators.required]),
        status     : this.fb.control(''),   
        id         : this.editEquipmentData ==true ? this.url_id :'',
    });

    if(this.route.routeConfig.path =='admin/meeting-room/services/edit/:id'){      
      //this.fillEquipmentValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._meetingRoomService.getEquipmentList({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              this.fillEquipmentValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
            this.fillEquipmentValues();
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
        data: { type: 'updateEquipment', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/meeting-room/rooms/list']);
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
    this._meetingRoomService.updateForm(this.url_id, 'meetequipment').subscribe(response => {      
      this.fillEquipmentValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.form_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
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
      data: { type: 'updateEquipment', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/meeting-room/rooms/list']);
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
      this.confirmDialogRef.componentInstance.type = 'meetequipment';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillEquipmentValues(){
    let edit: boolean = true;
    this._meetingRoomService.getEquipmentContents(this.url_id,edit).subscribe(response =>{      
      let formData  = response.equipmentInfo;
      formData.status = formData.status == 'A' ? true : false;
      //console.log("formData",formData);
      this.addEquipmentForm.patchValue(formData);
    });
  }

  
  onSaveFieldClick(){
    let value = this.addEquipmentForm.value;
    let formData = {
      'id'                    : value.id,
      'title'                 : value.title,
      'status'                : value.status==true?'A':'I',
    }
    if(this.addEquipmentForm.valid){
      this._meetingRoomService.addEquipment(formData,this.editEquipmentData)
        .subscribe(response =>{  
          this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration        : 2000
            });
          this.router.navigate(['/admin/meeting-room/services/list']);
          	
      },
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration        : 2000
        });
      });
    }
    
  }

}
