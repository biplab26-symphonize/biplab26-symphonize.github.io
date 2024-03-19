import { CommonUtils } from 'app/_helpers';
import { startOfDay, endOfDay } from 'date-fns';
import moment from 'moment';

export class Guestroomcalendar {
   id?: string;
   name: string;
   url: string;
   date_from?: Date;
   date_to?: Date;
   editable: boolean;
   RegColors: any = { regBgColor: '#000000', regBorderColor: '#ffffff' };
   backgroundColor: string = '#000000';
   borderColor: string = '#ffffff';
   textColor: string = '#000000';
   extendedProps: any = {};

   groupId?: string;
   allDay: boolean;
   title: string;
   start: any;
   end: any;

   /**
    * Constructor
    *
    * @param data
    */
   constructor(roomBookingItem: any = {}, regColors: any) {
      console.log("roomBookingItem", roomBookingItem);
      this.RegColors = regColors;

      if (roomBookingItem.date_from == roomBookingItem.date_to) {
         this.start = roomBookingItem.date_from;
         this.end = roomBookingItem.date_to;
      } else {
         let end_date =  new Date(roomBookingItem.date_to);
         end_date.setDate(end_date.getDate() + 1);
         this.start = roomBookingItem.date_from;
         this.end = end_date;
         console.log("end_date",end_date);
      }

      // this.start = moment.utc(roomBookingItem.start_date).toDate().toUTCString();
      // this.end = moment.utc(roomBookingItem.end_date).toDate().toUTCString();
      console.log("start", this.start);
      console.log("end", this.end);
      let room_name: any;
      let building_name: any;
      roomBookingItem.displayroom.map((element, index) => {
         // if(room_name == '' || room_name == null){
         //    room_name = element.roomnumber + '' + element.roomname ;
         // }else{
         //    room_name = element.roomnumber + '' + element.roomname ;
         // }
         room_name = element.roomnumber + ' ' + element.roomname;

      });
      building_name = roomBookingItem.building.name;
      if (room_name != '' && room_name != null && room_name != undefined) {
         this.title = 'Id' + roomBookingItem.id + '\n' + roomBookingItem.name + ' \n' + 'Building:' + building_name + '\n' + 'Room:' + room_name;
      } else {
         this.title = roomBookingItem.id + ' ' + roomBookingItem.name;
      }

      this.name = '';
      roomBookingItem.displayroom.map((element, index) => {

         if (this.name == '') {
            this.name = roomBookingItem.displayroom.length > 0 ? element.roomname + '-' + element.roomnumber || '' : '';
         } else {
            let roomName = roomBookingItem.displayroom.length > 0 ? element.roomname + '-' + element.roomnumber || '' : '';
            this.name = this.name + '\n' + roomName;
         }
      });

      //Modify Dates Support on SAFARI -------
      roomBookingItem.date_from = new Date(roomBookingItem.date_from.replace(/-/g, '\/') + ' ' + roomBookingItem.arrival_time);
      if (roomBookingItem.arrival_time) {
         roomBookingItem.date_to = new Date(roomBookingItem.date_to.replace(/-/g, '\/') + ' ' + roomBookingItem.arrival_time);
      }

      // if(roomBookingItem.arrival_time){

      //     roomBookingItem.arrival_time    = new Date(roomBookingItem.arrival_time.replace(/-/g, '\/'));
      // }
      //  if(roomBookingItem.arrival_time){
      //      roomBookingItem.arrival_time      = new Date(roomBookingItem.arrival_time);
      //  }

      this.extendedProps = roomBookingItem;
      this.getCategoryBgColor([]);
      this.getCategoryFontColor([]);
      this.getRegistrationColor(roomBookingItem);

   }
   //get background color
   getCategoryBgColor(categoryInfo: any[] = []) {
      this.backgroundColor = "transparent";
      this.borderColor = '#66e0ff';
      //  if(categoryInfo.length>0 && categoryInfo[0].categories && categoryInfo[0].categories.bg_color){
      //      // this.backgroundColor = categoryInfo[0].categories.bg_color || "";
      //      this.backgroundColor = "transparent";
      //      this.borderColor     = categoryInfo[0].categories.bg_color;
      //  }
   }
   //get background color
   getCategoryFontColor(categoryInfo: any[] = []) {
      this.textColor = "#000000";
      //  if(categoryInfo.length>0 && categoryInfo[0].categories && categoryInfo[0].categories.font_color){
      //      this.textColor = categoryInfo[0].categories.font_color || "#000000";
      //  }
   }
   //Registration Required Colors            
   getRegistrationColor(eventInfo: any) {
      this.backgroundColor = this.backgroundColor;
      this.borderColor = this.borderColor;
      //  if(eventInfo.req_register=='Y'){
      //      this.backgroundColor = this.RegColors.regBgColor;
      //      this.borderColor     = this.RegColors.regBorderColor;
      //  }
      //  else{
      //      this.backgroundColor = this.backgroundColor;
      //      this.borderColor     = this.borderColor;
      //  }
   }
}
