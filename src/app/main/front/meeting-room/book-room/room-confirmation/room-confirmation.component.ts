import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, MeetingRoomService, OptionsList, UsersService } from 'app/_services';

@Component({
  selector: 'app-room-confirmation',
  templateUrl: './room-confirmation.component.html',
  styleUrls: ['./room-confirmation.component.scss'],
  animations: fuseAnimations
})
export class RoomConfirmationComponent implements OnInit {



  public confirmation: FormGroup;
  public CurrentSelectdData: any;
  public RoomData: any;
  public filteredUsers: any[] = [];
  public AllLayout: any;
  public AllEquipment: any = [];
  public ShowHourly = false;
  public HourLastValue: any;
  public HourFirstValue: any;
  public editBookingData = false;
  public CustomFormats        : any;

  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  constructor(private _fuseConfigService: FuseConfigService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _commonService: CommonService,
    private router: Router,
    private _matSnackBar: MatSnackBar,
    private _meetingroomservices: MeetingRoomService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.CurrentSelectdData = this._meetingroomservices.Getroomslistdata()
    if(this.CurrentSelectdData === undefined){
      this.router.navigate(['/meeting-room']);
    }

  }

  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.setControl();
    this.CustomFormats = OptionsList.Options.customformats;
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
    this.confirmation = this.fb.group({
      step: this.fb.control('step6'),
    })
  }

  onClickBack() {
    this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
    this.router.navigate(['/loadCheckout'])
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
      if (event.value == 'step5') {
        this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
        this.router.navigate(['/check_out/']);
      }
    }
  }
  onsubmit() {
    if (this.CurrentSelectdData) {
      let from_to = [];
      let food_drinks = [];
      let equipments = [];
      if (this.ShowHourly == true) {
        for (let i = 0; i < this.CurrentSelectdData[0].duration.length; i++) {
          from_to.push({ 'time': this.CurrentSelectdData[0].duration[i].id });
        }
      }
      for (let i = 0; i < this.CurrentSelectdData[0].Food_drink.length; i++) {
        food_drinks.push({
          'food_drink_id': this.CurrentSelectdData[0].Food_drink[i].id,
          'quantity': this.CurrentSelectdData[0].Food_drink[i].quantity
        });
      }
      for (let i = 0; i < this.CurrentSelectdData[0].equipment.length; i++) {
        equipments.push({
          'equipment_id': this.CurrentSelectdData[0].equipment[i].equipment_id,
          'unit': 1
        });
      }
      let AllData = {
        "start_date": this.CurrentSelectdData[0].date,
        "attendees": this.CurrentSelectdData[0].attendees,
        "room_id": this.CurrentSelectdData[0].id,
        "layout_id": this.CurrentSelectdData[0].layout,
        "book_by": this.ShowHourly == true ? this.CurrentSelectdData[0].duration[0].duration : this.CurrentSelectdData[0].duration.duration,
        "status": "pending",
        "notes": this.CurrentSelectdData[0].note,
        "client_name": this.CurrentSelectdData[0].first_name,
        "client_email": this.CurrentSelectdData[0].email,
        "client_phone": this.CurrentSelectdData[0].phone,
        "is_recurring": "N",
        "equipments": equipments,
        "food_drinks": food_drinks,
        'from_to': from_to,
        'user_id': JSON.parse(localStorage.getItem('token')).user_id
      }
      
      this._meetingroomservices.AddRoomBooking(AllData, this.editBookingData)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000

          });
          this.router.navigate(['/meeting-room']);
          this._meetingroomservices.setMeetinglistdata('');

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
