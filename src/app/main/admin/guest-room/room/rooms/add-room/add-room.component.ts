import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig, AuthService, ChatService, CommonService, GuestRoomService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
  animations: fuseAnimations
})
export class AddRoomComponent implements OnInit {
  public pusherCounter = 0;
  public userId: any;
  public ann_list: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public roomEditRestriction: any;

  title: string;
  public addRoom: FormGroup;
  public editRoom: boolean = false;
  public isSubmit: boolean = false;
  public url_id: any;
  public ab_value: any;
  public room_count: any = 0;
  public maxOccupancy: any = 0;
  room_number: FormArray;
  public adultsOccupancy = 0;
  public ChildOccupancy = 0;
  public ChildOccupancycurrent;
  public adultsOccupancycurrnt;
  public buildingList: any = [];
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };
  private file: File | null = null;
  filetype: Boolean = false;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  mediaInfo: any = [];
  @Output() designpartData = new EventEmitter();
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  constructor(private _commonService: CommonService, private _dialog: MatDialog, private _chatService: ChatService, private authenticationService: AuthService, private fb: FormBuilder, private _guestRoomService: GuestRoomService, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router,) {
    this.title = 'Room';
    if (this.route.routeConfig.path == 'admin/guest-room/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editRoom = true;
    }
    this.url_id ? this.title = "Update Room" : this.title = "New Room";
  }

  ngOnInit(): void {
    this.setControls();
    this._guestRoomService.getBuildingList({ 'status': 'A', 'direction': 'desc' }).then(Response => {
      this.buildingList = Response.data;
    });
  }
  setControls() {
    this.addRoom = this.fb.group({
      building_id: this.fb.control('', [Validators.required]),
      type: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      max_people: this.fb.control(''),
      adults: this.fb.control(1),
      children: this.fb.control(0),
      room_count: this.fb.control(''),
      admin_email: this.fb.control(''),
      status: this.fb.control(''),
      image: this.fb.control(''),
      room_number: this.fb.array([]),
      id: this.editRoom == true ? this.url_id : '',
    });
    if (this.route.routeConfig.path == 'admin/guest-room/edit/:id') {
      //this.fillRoomsValues();
      this.getFilteredRooms();
    }
  }
  fillRoomsValues(edit:any) {
    this._guestRoomService.getRoomsContent(this.url_id,edit).subscribe(response => {
      let formData = response.roominfo;
      this.maxOccupancy = Number(formData.max_people);
      this.addRoom.patchValue(formData);

      this.room_count = formData.room_count;
      if (formData.image != null && formData.image != '') {
        this.filetype = true;
        this.logourl = formData.image;

      }
      this.room_number = this.addRoom.get('room_number') as FormArray;
      if (formData.roomnumber) {
        formData.roomnumber.map((item, index) => {
          const tempObj = {};
          tempObj['roomNumbers'] = new FormControl(item.number);
          this.room_number.push(this.fb.group(tempObj));

        });
      }
      let value = this.addRoom.get('max_people').value;
      this.ChildOccupancy = Number(value);
      this.adultsOccupancy = Number(value);
    });
  }
  getFilteredRooms() {
    this._guestRoomService.getRoomsContents(this.url_id).subscribe(response => {
      this.roomEditRestriction = response.roominfo;
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
      panelClass: 'guestroom',
      data: { type: 'guestroom', body: '<h2>Recurring Confirmation</h2>' }
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
        panelClass: 'guestroom',
        data: { type: 'guestroom', body: '<h2>Recurring Confirmation</h2>' }
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
    this._guestRoomService.updateForm(this.url_id, 'guestroom').subscribe(response => {
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
      this.confirmDialogRef.componentInstance.type = 'guestroom';
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

  // fillRoomsValues() {
  //   this._guestRoomService.getRoomsContents(this.url_id).subscribe(response => {
  //     let formData = response.roominfo;
  //     this.addRoom.patchValue(formData);

  //     this.room_count = formData.room_count;
  //     if (formData.image != null && formData.image != '') {
  //       this.filetype = true;
  //       this.logourl = formData.image;

  //     }
  //     this.room_number = this.addRoom.get('room_number') as FormArray;
  //     if (formData.roomnumber) {
  //       formData.roomnumber.map((item, index) => {
  //         const tempObj = {};
  //         tempObj['roomNumbers'] = new FormControl(item.number);
  //         this.room_number.push(this.fb.group(tempObj));

  //       });
  //     }
  //     let value = this.addRoom.get('max_people').value;
  //     this.ChildOccupancy = Number(value);
  //     this.adultsOccupancy = Number(value);
  //   });
  // }

  setMaxOccupancy(event) {
    // if (this.maxOccupancy > Number(event.target.value)) {
    //   this.addRoom.get('adults').setValue(1);
    //   this.addRoom.get('children').setValue(0);
    // }
    this.maxOccupancy = Number(event.target.value);
    this.ChildOccupancy = Number(event.target.value);
    this.adultsOccupancy = Number(event.target.value);
  }
  // setthevalues() {
  //   let value = this.addRoom.get('adults').value;
  //   let ChildOccupancycurrent = this.ChildOccupancy - value;
  //   this.addRoom.get('children').setValue(ChildOccupancycurrent);
  // }
  // settheadultvalues() {
  //   let occupancy = Number(this.addRoom.get('max_people').value);
  //   let adults = Number(this.addRoom.get('adults').value);
  //   let children = Number(this.addRoom.get('children').value);

  //   if (occupancy == children) {
  //     this.addRoom.get('adults').setValue(1);
  //     this.addRoom.get('children').setValue(occupancy - 1);
  //   } else {
  //     let value = this.addRoom.get('children').value;
  //     let adultsOccupancycurrnt = this.adultsOccupancy - value;
  //     this.addRoom.get('adults').setValue(adultsOccupancycurrnt);
  //   }
  // }

  setReadonly() {
    return false;
  }
  onSubmit() {
    this.savingEntry = true;
    if (this.addRoom.valid) {
      this.isSubmit = true;
      let room_data = this.addRoom.value;
      let numerArr: any = [];
      room_data.room_number.forEach(item => {
        numerArr.push(item.roomNumbers);
      });
      room_data.room_number = numerArr;
      this._guestRoomService.addRoom(room_data, this.editRoom).subscribe(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(['/admin/guest-room/list']);
      },
        error => {
          //Show the error message
          this.isSubmit = false;
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
        this.mediaInfo.append('type', 'guestroom');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = (uploadResponse.media.image ? AppConfig.Settings.url.mediaUrl + uploadResponse.media.image : "");
            if (uploadResponse.media.image) {
              this.logourl = event.target.result;
              this.filetype = true;
              this.addRoom.controls.image.setValue(this.uploadInfo.avatar.url);
              this.designpartData.emit(this.addRoom.value);
            }
          });

      }
    }

  }
  
  slugifyLocationAbrvn() {
    if (this.addRoom.get('type').value) {
      let type = this.addRoom.get('type').value;
      //this.addRoom.get('abbreviation').setValue(type.split(' ').map(n => n[0]).join('').toUpperCase());
    }
  }
  createItem(index) {
    if (this.addRoom.get('type').value) {
      let type = this.addRoom.get('type').value;
      this.ab_value = type.split(' ').map(n => n[0]).join('').toUpperCase() + index;
    } else {
      this.ab_value = index;
    }
    return this.fb.group({
      roomNumbers: [this.ab_value, Validators.required],
    })
  }
  onAddSelectRow(event) {
    if (event.target.value > this.room_count) {
      this.room_number = this.addRoom.get('room_number') as FormArray;
      this.room_number.push(this.createItem(event.target.value));
    } else {
      this.room_number.removeAt(this.room_count - 1)
    }
    this.room_count = event.target.value;
  }
  removeRoom(index) {
    this.room_number.removeAt(index)
  }
  getControls() {
    return (this.addRoom.get('room_number') as FormArray).controls;
  }
  Cancel() {
    this.router.navigate(['/admin/guest-room/list']);
  }
}
