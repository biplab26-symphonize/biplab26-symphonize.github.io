import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers/common.utils';
import { CommonService, MeetingRoomService } from 'app/_services';

@Component({
  selector: 'app-food-drink-list',
  templateUrl: './food-drink-list.component.html',
  styleUrls: ['./food-drink-list.component.scss'],
  animations: fuseAnimations
})
export class FoodDrinkListComponent implements OnInit {
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public Food_Drink: FormGroup;
  public CurrentSelectdData: any;
  public RoomData: any;
  public AllLayout: any;
  public AllEquipment: any = [];
  public FoodDrink: any = [];
  public selectedFood: any = [];
  public ShowHourly = false;
  public HourLastValue: any;
  public HourFirstValue: any;

  constructor(private _fuseConfigService: FuseConfigService,
    private _commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private _meetingroomservices: MeetingRoomService) {
      this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.CurrentSelectdData = this._meetingroomservices.Getroomslistdata();
    if(this.CurrentSelectdData === undefined){
      this.router.navigate(['/meeting-room']);
    }
    if (this.CurrentSelectdData && this.CurrentSelectdData[0].Food_drink !== undefined) {
      for (let i = 0; i < this.CurrentSelectdData[0].Food_drink.length; i++) {
        this.selectedFood.push({
          'id': this.CurrentSelectdData[0].Food_drink[i].id, 'quantity': this.CurrentSelectdData[0].Food_drink[i].quantity
          , 'title': this.CurrentSelectdData[0].Food_drink[i].title
        });
      }
    }

  }

  ngOnInit() {

    this.setControl();
    // get the rooms data 
    let fieldgroup = {}
    if (this.CurrentSelectdData) {
      this._meetingroomservices.getRoomsContent(this.CurrentSelectdData[0].id).subscribe(response => {
        this.RoomData = response.RoomsInfo;
      });

      if (this.CurrentSelectdData[0].duration.length > 1) {
        let index = this.CurrentSelectdData[0].duration.length - 1;
        this.HourFirstValue = this.CurrentSelectdData[0].duration[0].value.split('-')
        this.HourLastValue = this.CurrentSelectdData[0].duration[index].value.split('-')
        this.ShowHourly = true;

      }
    }
    this._meetingroomservices.getDrinkList({ 'column': 'title', 'status': 'A', 'direction': 'asc' }).then(res => {      
      this.FoodDrink = res.data;
      this.FoodDrink.forEach(element => {
        fieldgroup[element.id] = new FormControl('');
      });
      this.Food_Drink = new FormGroup(fieldgroup);
    })

  }

  setControl() {

    this.Food_Drink = this.fb.group({
      step: this.fb.control('step4'),
      quantity: this.fb.control('1'),

    });


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
    }

  }

  isChecked(key) {
    //  Stored  the selected data in array
    if (this.CurrentSelectdData && this.CurrentSelectdData[0].Food_drink !== undefined) {
      return this.CurrentSelectdData[0].Food_drink.some(item => item.id == key);
    }
  }
  onSelctedEquipment(event, Id, title) {
    const checked = event; // stored checked value true or false
    if (checked) {
      this.selectedFood.push({ 'id': Id, 'quantity': 1, 'title': title }); // push the Id in array if checked
    } else {
      const index = this.selectedFood.findIndex(list => list.id == Id);//Find the index of stored id
      this.selectedFood.splice(index, 1); // Then remove
    }    
    //  this.RoomSetup.get('equipment').setValue(this.selectedFood);
  }

  Limit(event, Id, title) {
    let values = event.target.value;
    const index = this.selectedFood.findIndex(list => list.id == Id);
    this.selectedFood.splice(index, 1);    
    if (index > 0 || index == 0) {
      this.selectedFood.splice(index, 0, { 'id': Id, 'quantity': values, 'title': title });
    }    
  }

  OnNext() {    

    let Form_Data = {
      'id': this.CurrentSelectdData ? this.CurrentSelectdData[0].id : '',
      'attendees': this.CurrentSelectdData ? this.CurrentSelectdData[0].attendees : '',
      'date': this.CurrentSelectdData ? this.CurrentSelectdData[0].date : '',
      'layout': this.CurrentSelectdData ? this.CurrentSelectdData[0].layout : '',
      'equipment': this.CurrentSelectdData ? this.CurrentSelectdData[0].equipment : '',
      'duration': this.CurrentSelectdData ? this.CurrentSelectdData[0].duration : '',
      'Food_drink': this.selectedFood
    }
    this.router.navigate(['/loadCheckout']);
    this._meetingroomservices.setMeetinglistdata(Form_Data);
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
    }

  }
  onClickBack() {
    this._meetingroomservices.setMeetinglistdata(this.CurrentSelectdData);
    this.router.navigate(['/room-setup'])
  }

}
