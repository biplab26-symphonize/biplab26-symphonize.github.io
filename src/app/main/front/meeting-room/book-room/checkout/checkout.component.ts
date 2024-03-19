import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, MeetingRoomService, ProfileService, UsersService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  animations: fuseAnimations
})
export class CheckoutComponent implements OnInit {

  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public checkout: FormGroup;
  public CurrentSelectdData: any;
  public RoomData: any;
  public filteredUsers: any[] = [];
  public AllLayout: any;
  public AllEquipment: any = [];
  public ShowHourly = false;
  public HourLastValue: any;
  public HourFirstValue: any;
  public generalSettings: any;
  public Kisko_User: any = []

  constructor(private _fuseConfigService: FuseConfigService,
    private fb: FormBuilder,
    private router: Router,
    private _userService: UsersService,
    private _commonService: CommonService,
    private _profileservices: ProfileService,
    private _meetingroomservices: MeetingRoomService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.CurrentSelectdData = this._meetingroomservices.Getroomslistdata()
    if(this.CurrentSelectdData === undefined){
      this.router.navigate(['/meeting-room']);
    }    
  }

  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    let ignoreIds;
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.Kisko_User = this.generalSettings.kiosk_user ? this.generalSettings.kiosk_user.split(',').map(Number) : '';
    for (let i = 0; i < this.Kisko_User.length; i++) {
      if (this.Kisko_User[i] == JSON.parse(localStorage.getItem('token')).role_id) {
        ignoreIds = JSON.parse(localStorage.getItem('token')).user_id;
      }
    }


    this.setControl();
    this.checkout
      .get('first_name').valueChanges
      .pipe(
        debounceTime(300),
        tap(),
        switchMap(value => this._userService.getUsers({ 'searchKey': value, ignore_ids: ignoreIds, autopopulate:1 }))
      )
      .subscribe(users => this.filteredUsers = users.data);

    if (this.CurrentSelectdData !== undefined) {
      this.SetdefaultValue(this.CurrentSelectdData);
    }
    // get the rooms data 
    if (this.CurrentSelectdData) {
      this._meetingroomservices.getRoomsContent(this.CurrentSelectdData[0].id).subscribe(response => {
        this.RoomData = response.RoomsInfo;
        let layout = this.RoomData.roomslayout;

        for (let i = 0; i < layout.length; i++) {
          if (layout[i].layouts.id == this.CurrentSelectdData[0].layout) {
            this.AllLayout = layout[i].layouts;
          }
        }
        let equipment = this.RoomData.roomsequipments;
        for (let i = 0; i < equipment.length; i++) {
          for (let j = 0; j < this.CurrentSelectdData[0].equipment.length; j++) {
            if (equipment[i].equipments != null) {
              if (equipment[i].equipments.id == this.CurrentSelectdData[0].equipment[j].equipment_id) {
                this.AllEquipment.push({ 'data': equipment[i].equipments, unit: this.CurrentSelectdData[0].equipment[j].unit });
              }
            }
          }
        }
      });
      if (this.CurrentSelectdData[0].duration.length > 1) {
        let index = this.CurrentSelectdData[0].duration.length - 1;
        this.HourFirstValue = this.CurrentSelectdData[0].duration[0].value.split('-')
        this.HourLastValue = this.CurrentSelectdData[0].duration[index].value.split('-')
        this.ShowHourly = true;

      }

    }

  }

  setControl() {

    this.checkout = this.fb.group({
      step: this.fb.control('step5'),
      first_name: this.fb.control(''),
      last_name: this.fb.control(''),
      phone: this.fb.control(''),
      email: this.fb.control(''),
      note: this.fb.control(''),
      user_id: this.fb.control('')


    })
    this._profileservices.getProfileInfo().subscribe(res => {
      this.checkout.patchValue(res.userinfo);
    });
  }

  SetdefaultValue(CurrentSelectdData) {
    this.checkout.patchValue(CurrentSelectdData[0]);
  }
  setFormfields(userInfo: any) {
    if (userInfo.option.value) {
      userInfo.option.value.user_id = userInfo.option.value.id || 0;
      this.checkout.patchValue(userInfo.option.value);
      this.checkout.get('first_name').setValue(userInfo.option.value.first_name);
    }
  }

  OnselectStep(event) {    
    if (event.value == 'step2') {
      this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
      this.router.navigate(['/book-room/', this.CurrentSelectdData[0].id])
    } else {
      if (event.value == 'step3') {
        this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
        this.router.navigate(['/room-setup/']);
      }
      if (event.value == 'step4') {
        this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
        this.router.navigate(['/amenities']);
      }

    }

  }

  onClickBack() {
    this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
    this.router.navigate(['/amenities'])
  }
  onsubmit() {    
    let value = this.checkout.value;
    let Form_Data = {
      'id': this.CurrentSelectdData ? this.CurrentSelectdData[0].id : '',
      'attendees': this.CurrentSelectdData ? this.CurrentSelectdData[0].attendees : '',
      'date': this.CurrentSelectdData ? this.CurrentSelectdData[0].date : '',
      'layout': this.CurrentSelectdData ? this.CurrentSelectdData[0].layout : '',
      'equipment': this.CurrentSelectdData ? this.CurrentSelectdData[0].equipment : '',
      'Food_drink': this.CurrentSelectdData ? this.CurrentSelectdData[0].Food_drink : '',
      'duration': this.CurrentSelectdData ? this.CurrentSelectdData[0].duration : '',
      'first_name': value.first_name,
      'last_name': value.last_name,
      'phone': value.phone,
      'email': value.email,
      'note': value.note,
      'step': value.step,
      'user_id': value.user_id
    }
    this.router.navigate(['/confirmation']);
    this._meetingroomservices.setMeetinglistdata(Form_Data);
  }

}
