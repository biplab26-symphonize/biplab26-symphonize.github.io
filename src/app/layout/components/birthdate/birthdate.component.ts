import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as moment from "moment";
import { CommonService } from 'app/_services';

@Component({
  selector: 'select-birthdate',
  templateUrl: './birthdate.component.html',
  styleUrls: ['./birthdate.component.scss']
})
export class BirthdateComponent implements OnInit {

  @Input() type: string='user';
  @Input() restrictFormInfo: boolean=false;
  @Input() UserInformation: any;
  public monthsArray      : any[]  = moment.monthsShort();
  public daysArray        : any[]  = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]; 
  public birth_year       : string = "1970";
  public birth_day        : string = "01";
  public birth_month      : string = "Jan";
  public birthdate        : string = "";
  @Output() setBirthdate  = new EventEmitter<string>();
  constructor(
    private _commonService:CommonService
  ) { }

  ngOnInit() {
    if(this.UserInformation && this.UserInformation.birthdate){
      console.log("UserInformation",this.UserInformation);
      this.birthdate   = this.UserInformation.birthdate;
      this.birth_day   = moment(this.birthdate).format('DD');
      this.birth_month = moment(this.birthdate).format('MMM');
    }
    //Reset Categories On Form Reset of Event Filters
    this._commonService.resetMataFieldsObservable.subscribe(data =>{
      if(data==1 || this.type=='directory'){
        this.birth_day = '';
        this.birth_month = '';
      }
    })
  }
  //Send Birthdate Value To Form
  setFieldValue(){
    if(this.type=='user'){
      this.birthdate = this.birth_year + '-' + moment().month(this.birth_month).format("MM") + '-' + this.birth_day;
      this.setBirthdate.emit(this.birthdate);
    }
    else{
      this.birth_month =  this.birth_month=='' ? this.monthsArray[0] : this.birth_month;
      this.birthdate = this.birth_year + '-' + moment().month(this.birth_month).format("MM") + '-' + this.birth_day;
      this.setBirthdate.emit(this.birthdate);  
    }
  }
}
