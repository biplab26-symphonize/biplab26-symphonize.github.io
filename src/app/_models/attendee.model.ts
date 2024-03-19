import {Deserializable} from 'app/_models';
import { OptionsList } from 'app/_services';
import { CommonUtils } from 'app/_helpers';

export class Attendee implements Deserializable {
    
    public attendee_id     : number;
    public attendee_name   : string;
    public created_at      : string;
    public guestcount      : number;
    public status          : string;
    public notes           : string;
    public first_name      : string;
    public last_name       : string;
    public email           : string;
    public phone           : number;
    public username        : string;
    public is_waiting      : string;
    public editstatus      : string;
    public displaystatus      : string;
    public reg_status      : string;
    public guestinfo       : GuestInfo[] 
    deserialize(input: any, type:string=''): this {
    // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
    Object.assign(this, input);  
    if(type == ''){
        this.getFullName(input);
        this.getstatus(input.status); 
        this.status       = input.status;
        this.editstatus   = input.status;
        this.reg_status   = this.getRegistrationStatus(input);
        //attendeelimit
        this.guestinfo    = input.guests || [];
        this.created_at   = input.created_at.replace(/-/g, '\/');
    }
    if(type == 'edit'){
      this.first_name   = input.first_name;
      this.last_name    = input.last_name;
      this.getstatus(input.status); 
      this.status       = input.status;
      this.editstatus   = input.status;
      this.reg_status   = this.getRegistrationStatus(input);
      //attendeelimit
      this.guestinfo    = input.guests || [];
      this.created_at   = input.created_at.replace(/-/g, '\/');
    }
    if(type == 'list'){
      //this.getFullName(input);
      this.getstatus(input.status); 
      this.status       = input.status;
      this.editstatus   = input.status;
      this.reg_status   = this.getRegistrationStatus(input);
      //attendeelimit
      this.guestinfo    = input.guests || [];
      this.created_at   = input.created_at.replace(/-/g, '\/');
    }
    
    return this;
    }

    getFullName(input) {
        this.first_name = input.first_name + ' ' + input.last_name;
    }
    //Change Status Text
    getstatus(status: string){
        this.status = OptionsList.Options.tables.status.attendeestatus[status];
        this.displaystatus = OptionsList.Options.tables.status.attendeestatus[status];
    }
    getRegistrationStatus(input){
      return CommonUtils.getRegistrationStatus({is_waiting:input.is_waiting,status:input.status});
    }
    formatElement(ele) {
        let arrAttendee = [];
        let arrGuest = [];
        for(let i=0 ;i<ele.length;i++)
        {
          let objAttendee:any = {};
          if(ele[i].status == 'waitlist')
          {
            objAttendee.name= ele[i].first_name + ' ' + ele[i].last_name + ' ' + '-'+' '+ ele[i].status;
          }
          else{
            objAttendee.name= ele[i].first_name + ' ' + ele[i].last_name ? ele[i].first_name + ' ' + ele[i].last_name : '---';
          }
          objAttendee.notes=ele[i].notes ? ele[i].notes : '---';
          objAttendee.guestcount=ele[i].guestcount ? ele[i].guestcount : '---';
          objAttendee.attendee_type= (ele[i].attendee_type == 'M')? 'Resident': 'Guest';
    
          arrAttendee.push(objAttendee);
    
          let tmpGuest = ele[i].guests;
          for(let j=0; j<tmpGuest.length; j++)
          {
            let objGuest:any = {};
            objGuest.name= tmpGuest[j].first_name + ' ' + tmpGuest[j].last_name +' '+ '-'+' '+'Guest of'+' '+ele[i].first_name + ' ' + ele[i].last_name;
            objGuest.notes=tmpGuest[j].notes ? tmpGuest[j].notes : '---' ;
            objGuest.guestcount=tmpGuest[j].guestcount ? tmpGuest[j].guestcount : '---';
            objGuest.attendee_type= (tmpGuest[j].attendee_type == 'G') ? 'Guest' : ''; 
            arrGuest.push(objGuest);
          }
        }
        let arrayAttendeeList = arrAttendee.concat(arrGuest);
        return arrayAttendeeList;
      }
}
//GuestInfo Data
export class GuestInfo {
    
    public attendee_id     : number;
    public user_id         : number;
    public first_name      : string;
    public last_name       : string;
    public email           : string;
    public phone           : number;
    public username        : string;
    public id?             : number;     
    public attendee_type   : number;     
}