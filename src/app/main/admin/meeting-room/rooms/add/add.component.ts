import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodReservationService, CommonService, AppConfig, MeetingRoomService, ChatService, AuthService } from 'app/_services';
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
  public addRooms: FormGroup;
  public editRooms: boolean = false;
  public url_id: any;
  equipmentEditData: any = [];
  layoutEditData: any = [];
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  private file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  public categoryFilter: object = {};
  public roomLayoutData: any;
  public equipmentData: any;
  public selectall: boolean;
  public selectallEquipments: boolean;
  public user_id: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  mediaInfo: any = [];
  @Output() designpartData = new EventEmitter();
  constructor(
    private _dialog: MatDialog,
    private _chatService: ChatService,
    private authenticationService: AuthService,private fb: FormBuilder, private foodReservation: FoodReservationService, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router, private _commonService: CommonService,private _meetingRoomService : MeetingRoomService) {
    this.title = 'Rooms';
    if (this.route.routeConfig.path == 'admin/meeting-room/rooms/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editRooms = true;
    }
    this.url_id ? this.title = "Update Rooms" : this.title = "New Rooms";
  }

  ngOnInit() {
    this.setControls();
  }
  setControls() {
    this.addRooms = this.fb.group({
      title: this.fb.control('', [Validators.required]),     
      image: this.fb.control(''),
      capacity: this.fb.control(''),
      description: this.fb.control(''),
      book_by_halfday: this.fb.control(''),
      book_by_hour: this.fb.control(''),
      book_by_nine_to_two: this.fb.control(''),
      layouts: this.fb.control(''),
      equipments: this.fb.control(''),
      status: this.fb.control(''),
      admin_email: this.fb.control(''),
      id: this.editRooms == true ? this.url_id : '',
    });
    if (this.route.routeConfig.path == 'admin/meeting-room/rooms/edit/:id') {
      //this.fillRoomsValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
    this.categoryFilter['status'] = 'A';
    this.getFilteredRoomLayout();
    this.getFilteredEquipment();
  }
  getFilteredServices() {
    return this._meetingRoomService.getRoomsList({ 'direction': 'desc' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              this.fillRoomsValues();
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
            this.fillRoomsValues();
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
        data: { type: 'updateRooms', body: '<h2>Edit Confirmation</h2>' }
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
    this._meetingRoomService.updateForm(this.url_id, 'rooms').subscribe(response => {      
      this.fillRoomsValues();
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.rooms, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
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
      data: { type: 'updateRooms', body: '<h2>Edit Confirmation</h2>' }
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
      this.confirmDialogRef.componentInstance.type = 'rooms';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
   fillRoomsValues() {
     let edit: boolean = true;
     this._meetingRoomService.getRoomsContents(this.url_id,edit).subscribe(response => {
       let formData = response.RoomsInfo;
       formData.book_by_halfday = formData.book_by_halfday == 'Y' ? true : false;
       formData.book_by_hour = formData.book_by_hour == 'Y' ? true : false;
       formData.book_by_nine_to_two = formData.book_by_nine_to_two == 'Y' ? true : false;
       this.addRooms.patchValue(formData);
       let i = 0;
       formData.roomsequipments.forEach(item => {
        this.equipmentEditData[i] = item.equipment_id;
        i = i + 1;
      });      
      this.addRooms.patchValue({ equipments: this.equipmentEditData });
      i = 0;
      formData.roomslayout.forEach(item => {
        this.layoutEditData[i] = item.layout_id;
        i = i + 1;
      });      
      this.addRooms.patchValue({ layouts: this.layoutEditData });
      if (formData.image != null) {
        this.filetype = true;
        this.logourl = formData.image;

      }
     });
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
              this.addRooms.controls.image.setValue(this.uploadInfo.avatar.url);
              this.designpartData.emit(this.addRooms.value);
            }
          });

      }
    }

  }
  getFilteredRoomLayout() {
    return this._meetingRoomService.getRoomLayoutList().then(Response => {
      this.roomLayoutData = Response.data;
    });
  }
  getFilteredEquipment() {
    return this._meetingRoomService.getEquipmentData().then(Response => {
      this.equipmentData = Response.data;
    });
  }
  selectalllLayout(){
    let data
      if  (this.selectall === false) {
        this.addRooms.controls.layouts .patchValue([]);
        return;
      }else if (this.selectall === true) {
        
		this.addRooms.controls.layouts.patchValue([...this.roomLayoutData.map(item => item.id)]);
		 
      }
  }
  selectedLayoutData(){  
    let data = this.addRooms.get('layouts').value;
    if(data.length == this.roomLayoutData.length ){
      this.selectallEquipments =true;
        }else{
        this.selectallEquipments =false;
      }
   }
   selectalllEquipment(){
    let data
      if  (this.selectallEquipments === false) {
        this.addRooms.controls.equipments .patchValue([]);
        return;
      }else if (this.selectallEquipments === true) {
        
		this.addRooms.controls.equipments.patchValue([...this.roomLayoutData.map(item => item.id)]);
		 
      }
  }
  selectedEquipmentData(){  
    let data = this.addRooms.get('equipments').value;
    if(data.length == this.roomLayoutData.length ){
      this.selectallEquipments =true;
        }else{
        this.selectallEquipments =false;
      }
   }
  onSubmit(){
    this.savingEntry = true;
    let extras_data = this.addRooms.value;
    console.log("extras_data",extras_data);
    extras_data.equipments = JSON.stringify(extras_data.equipments);
    extras_data.layouts = JSON.stringify(extras_data.layouts);
    extras_data.book_by_halfday = extras_data.book_by_halfday == true ? 'Y' : 'N';
    extras_data.book_by_hour = extras_data.book_by_hour == true ? 'Y' : 'N';
    extras_data.book_by_nine_to_two = extras_data.book_by_nine_to_two == true ? 'Y' : 'N';
    
    this._meetingRoomService.addRooms(extras_data, this.editRooms).subscribe(response => {
      this._matSnackBar.open(response.message, 'CLOSE', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.router.navigate(['/admin/meeting-room/rooms/list']);
    },
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }
  Cancel(){
    return false;
  }

}
