import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-grid-event',
  templateUrl: './grid-event.component.html',
  styleUrls: ['./grid-event.component.scss']
})
export class GridEventComponent implements OnInit {

  eventSettings: any  ={};
  eventInfo: any      ={};
  backgroundColor: string = "";
  eventTitle: string="";
  borderColor: string = "";
  textColor: string = "";
  DisplayView: boolean = true;

  constructor() { }

  ngOnInit() {
    this.eventTitle = this.eventInfo.event.title.trim();
    this.DisplayView = (this.eventInfo.view.type == 'timeGridWeek' || this.eventInfo.view.type == 'timeGridDay') ? false : true;
  }
  ngAfterViewInit(){
    this.setEventColors();
  }
  //SET Colors for event content bg,text,border
  setEventColors(){
    if(this.eventSettings.calender_settings && this.eventSettings.calender_settings.registration_require_bgcolor!='' && this.eventInfo.event.extendedProps.req_register=='Y'){
      //this.backgroundColor = this.eventSettings.calender_settings.registration_require_bgcolor;
      this.backgroundColor = 'transparent'
      this.borderColor     = this.eventInfo.event.borderColor;
      this.textColor       = this.eventSettings.calender_settings.registration_require_textcolor;
    }
    else if(this.eventInfo.event.backgroundColor!==''){
      //this.backgroundColor = this.eventInfo.event.backgroundColor;
      this.backgroundColor = 'transparent'
      this.borderColor     = this.eventInfo.event.borderColor;
      this.textColor       = this.eventInfo.event.textColor;
    }
  }
  
  

}
