import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService, AppConfig, MeetingRoomService, AuthService, ChatService } from 'app/_services';
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
  public addRoomLayout: FormGroup;
  public editRoomLayout: boolean = false;
  public url_id: any;

  public user_id: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  public isImage: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 

  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  mediaInfo: any = [];
  @Output() designpartData = new EventEmitter();
  constructor(
    private _dialog: MatDialog,
    private _chatService: ChatService,
    private authenticationService: AuthService,private _meetingRoomService : MeetingRoomService,private _commonService: CommonService,private fb: FormBuilder, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.title = 'Room Layout';
    if (this.route.routeConfig.path == 'admin/meeting-room/room-layout/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editRoomLayout = true;
    }
    this.url_id ? this.title = "Update Room Layout" : this.title = "New Room Layout";
  }

  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.addRoomLayout = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      image: this.fb.control('', [Validators.required]),
      status: this.fb.control('', [Validators.required]),
      id: this.editRoomLayout == true ? this.url_id : '',
    });
    if (this.route.routeConfig.path == 'admin/meeting-room/room-layout/edit/:id') {
      //this.fillRoomLayoutValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._meetingRoomService.getRoomLayoutList2({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              this.fillRoomLayoutValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
            this.fillRoomLayoutValues();
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
        data: { type: 'updateRoomLayout', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/meeting-room/room-layout/list']);
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
    this._meetingRoomService.updateForm(this.url_id, 'meetlayout').subscribe(response => {      
      this.fillRoomLayoutValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.room_layout, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
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
      data: { type: 'updateRoomLayout', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/meeting-room/room-layout/list']);
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
      this.confirmDialogRef.componentInstance.type = 'meetlayout';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  fillRoomLayoutValues() {
    let edit: boolean = true;
    this._meetingRoomService.getRoomLayoutContents(this.url_id,edit).subscribe(response => {
      let formData = response.roomlayoutInfo;
      this.addRoomLayout.patchValue(formData);
      if (formData.image != null) {
        this.filetype = true;
        this.logourl = formData.image;
      }
    });
  }
  onSubmit() {
    if(this.addRoomLayout.get('image').value == ''){
      this.isImage = true;
    }else{
      this.isImage = false;
    }
    if(this.addRoomLayout.valid){
    this.savingEntry = true;
    let roomlayout_data = this.addRoomLayout.value;
    this._meetingRoomService.addRoomLayout(roomlayout_data, this.editRoomLayout).subscribe(response => {
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.router.navigate(['/admin/meeting-room/room-layout/list']);
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
  onSelectLogoFile(event) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed

        this.mediaInfo = new FormData();
        this.mediaInfo.append('image', this.file);
        this.mediaInfo.append('type', 'meetingroom');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");            
            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.addRoomLayout.controls.image.setValue(this.uploadInfo.avatar.url);
              this.isImage = false;
              this.designpartData.emit(this.addRoomLayout.value);
            }
          });

      }
    }

  }
  Cancel(){
    this.router.navigate(['/admin/meeting-room/room-layout/list']);
  }

}
