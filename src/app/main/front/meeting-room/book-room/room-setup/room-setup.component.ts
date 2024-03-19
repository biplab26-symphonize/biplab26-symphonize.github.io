import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { CommonService, MeetingRoomService } from 'app/_services';

@Component({
  selector: 'app-room-setup',
  templateUrl: './room-setup.component.html',
  styleUrls: ['./room-setup.component.scss'],
  animations: fuseAnimations
})
export class RoomSetupComponent implements OnInit {

  public CurrentSelectdData: any
  public RoomData: any
  public AllEquipment: any = [];
  public AllLayout: any = [];
  public RoomSetup: FormGroup;
  public selectedEquipment: any = []
  public ShowHourly = false;
  public Duration: any;
  public HourLastValue: any;
  public HourFirstValue: any;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public isLayout: boolean = false;
  public default_img : any ;
  constructor(private _fuseConfigService: FuseConfigService, private _commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private _meetingroomservices: MeetingRoomService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.CurrentSelectdData = this._meetingroomservices.Getroomslistdata();
    if (this.CurrentSelectdData === undefined) {
      this.router.navigate(['/meeting-room']);
    }
    //  defalut selected value 
    if (this.CurrentSelectdData && this.CurrentSelectdData[0].equipment !== undefined) {
      for (let i = 0; i < this.CurrentSelectdData[0].equipment.length; i++) {
        this.selectedEquipment.push({ 'equipment_id': this.CurrentSelectdData[0].equipment[i].equipment_id })
      }
    }
  }

  ngOnInit() {
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.setControl();
    if (this.CurrentSelectdData !== undefined) {
      this.SetdefaultValue(this.CurrentSelectdData);
    }

    if (this.CurrentSelectdData) {



      // get the rooms data  
      this._meetingroomservices.getRoomsContent(this.CurrentSelectdData[0].id).subscribe(response => {
        this.RoomData = response.RoomsInfo;
        this.AllLayout = this.RoomData.roomslayout;
        this.AllEquipment = this.RoomData.roomsequipments;
      });

      if (this.CurrentSelectdData[0].duration.length > 1) {
        let index = this.CurrentSelectdData[0].duration.length - 1;
        this.HourFirstValue = this.CurrentSelectdData[0].duration[0].value.split('-')
        this.HourLastValue = this.CurrentSelectdData[0].duration[index].value.split('-')
        this.ShowHourly = true;

      }
    }
        this.default_img = '/assets/images/backgrounds/maintenance-request.jpg';
  }

  setControl() {

    this.RoomSetup = this.fb.group({
      layout: this.fb.control('', [Validators.required]),
      equipment: this.fb.control(''),
      step: this.fb.control('step3'),
      quantity: this.fb.control('1'),
      id: this.fb.control(this.CurrentSelectdData ? this.CurrentSelectdData[0].id : ''),
      attendees: this.fb.control(this.CurrentSelectdData ? this.CurrentSelectdData[0].attendees : ''),
      date: this.fb.control(this.CurrentSelectdData ? this.CurrentSelectdData[0].date : ''),
      duration: this.fb.control(this.CurrentSelectdData ? this.CurrentSelectdData[0].duration : '')
    })
  }
  onClickBack() {
    this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
    this.router.navigate(['/book-room/', this.CurrentSelectdData[0].id])
  }

  SetdefaultValue(DefaultValue) {
    this.RoomSetup.patchValue(DefaultValue[0]);
  }

  OnselectStep(event) {
    this.isLayout = true;
    if (event.value == 'step2') {
      this.isLayout = false;
      this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
      this.router.navigate(['/book-room/', this.CurrentSelectdData[0].id])
    }

  }

  isChecked(key) {
    //  Stored  the selected data in array
    if (this.CurrentSelectdData && this.CurrentSelectdData[0].equipment !== undefined && this.CurrentSelectdData[0].equipment.length != 0) {
      return this.CurrentSelectdData[0].equipment.some(item => item.equipment_id == key);
    }
  }


  onSelctedEquipment(Id, event, index) {

    const checked = event; // stored checked value true or false
    if (checked) {
      this.selectedEquipment.push({ equipment_id: Id, unit: 1 }); // push the Id in array if checked
    } else {
      const index = this.selectedEquipment.findIndex(list => list.equipment_id == Id);//Find the index of stored id
      this.selectedEquipment.splice(index, 1); // Then remove
    }
    this.RoomSetup.get('equipment').setValue(this.selectedEquipment);
  }

  OnselectQuantity(event, id) {
    const index = this.selectedEquipment.findIndex(list => list.equipment_id == id);//Find the index of stored id
    if (index > 0 || index == 0) {
      this.selectedEquipment.splice(index, 1);
      this.selectedEquipment.splice(index, 0, { equipment_id: id, unit: event.target.value });
    }

  }

  onNextstep() {
    if (this.RoomSetup.valid) {
      this._meetingroomservices.setMeetinglistdata(this.RoomSetup.value);
      this.router.navigate(['/amenities']);
    }
  }
}
