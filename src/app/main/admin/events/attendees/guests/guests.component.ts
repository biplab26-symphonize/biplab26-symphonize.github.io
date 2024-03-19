import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { UsersService, AttendeesService, CommonService } from 'app/_services';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers';
@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.scss']
})
export class GuestsComponent implements OnInit {

  eventSpecialFields: FormArray;
  @Input() specialfieldsArray: any[] = [];

  @Input() guestcount: number = 0; //get attendees limit
  @Input() groupLimit: any[] = []; //Max Group Limit
  @Input() showtype: string = "backend";
  @Input() user_id: string = '';
  @Input() event_id: number = 0;
  @Input() guestInfoArray: any[] = []; //edit guest ifno array

  @Output() resetCount = new EventEmitter<number>(); //Send reste count value to parent for attendees value reset to 1
  @Output() updateguestInfo = new EventEmitter<any>(); //Send updated guestinfo
  @Output() validateForm = new EventEmitter<any>(); //send tru or false for form fields
  
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
  guestForm: FormGroup;
  guestItems: FormArray;
  filteredGuests: any[] = [];
  sendGuestInfo: any[]  = [];
  enableAddGuest: boolean = false;
  showActions: boolean = false;
  eventSettings: any  = [];
  requiredFields: any = [];
  ignoreIds: any[]=[];
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private _matSnackBar: MatSnackBar,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _attendeesService: AttendeesService,
    private _commonService: CommonService) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }
  ngOnInit() {
    let eventSettings     = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings    = eventSettings ? eventSettings[0] : {};
    this.requiredFields   = this.eventSettings.event_registration_settings && this.eventSettings.event_registration_settings.required_guest_fields ? this.eventSettings.event_registration_settings.required_guest_fields : []; 
    this.guestForm = this._formBuilder.group({
      guestFields: this._formBuilder.array([])
    });    
    if(this.guestInfoArray){
      this.patchFieldValues();
    }    
  }
  //Catch the changed values
  ngOnChanges(changedValues:any){
    //Set User Id to avoid in auto suggest
    if(changedValues.user_id!==undefined){
      this.user_id = changedValues.user_id.currentValue || '';
    }
    if(changedValues.guestcount!==undefined){
      this.guestcount     = changedValues.guestcount.currentValue;    
      if(this.guestcount>1 && changedValues.guestcount.firstChange==false){
        this.guestItems   = this.guestForm.get('guestFields') as FormArray;
        //If Values Of this.guestItems is not empty
        if(this.guestItems.length==0){
          var guestCountArr   = Array.from(new Array(this.guestcount-1 || 0),(val,index)=>index);
          while (this.guestItems.length !== 0) {
            this.guestItems.removeAt(0);
          }

          guestCountArr.forEach((count,index)=>{
            this.addGuests();
          });
        }
        // this.guestcount > this.guestItems.length
        else if(this.guestItems.length>0 && this.guestcount > this.guestItems.length){
          var guestCountArr   = Array.from(new Array((this.guestcount - this.guestItems.length) - 1 || 0),(val,index)=>index);
          guestCountArr.forEach((count,index)=>{
            this.addGuests();
          });
        }
        // this.guestcount < this.guestItems.length
        else if(this.guestItems.length>0 && this.guestcount < this.guestItems.length){
          var guestCountArr   = Array.from(new Array(this.guestItems.length || 0),(val,index)=>index);
          guestCountArr.forEach((count,index)=>{
            //this.guestItems.removeAt(this.guestItems.length - 1);
            this.guestItems.removeAt(this.guestcount - 1);
          });
        }
        // this.guestcount == this.guestItems.length
        else if(this.guestItems.length>0 && this.guestcount == this.guestItems.length){
          this.guestItems.removeAt(this.guestItems.length - 1);
        }
      }
      else if(this.guestcount==1 && changedValues.guestcount.firstChange==false){
        this.guestItems     = this.guestForm.get('guestFields') as FormArray;
        //Remove If Value is <= 1
        while (this.guestItems.length !== 0) {
          this.guestItems.removeAt(0);
        }
      } 
    }   
    
    //Validate Form and send to parent component
    if(this.guestForm){
      this.validateForm.emit(this.guestForm.invalid);
    }
  }
  //get Edit Array
  get guestFields(): FormArray {
      return this.guestForm.get('guestFields') as FormArray;
  } 
  //AutoPopulate Form Fields
  patchFieldValues(): void {
    if(this.guestInfoArray){
      
      this.guestInfoArray.map((item, index) => {
        const tempObj = {};
        tempObj['username']       = new FormControl(item.username);
        tempObj['first_name']     = new FormControl(item.first_name);
        tempObj['full_name'] = new FormControl(item.first_name+' '+item.last_name);
        tempObj['last_name']      = new FormControl(item.last_name);
        tempObj['email']          = new FormControl(item.email);
        tempObj['phone']          = new FormControl(item.phone);
        tempObj['attendee_type']  = new FormControl(item.attendee_type || 'G');
        tempObj['attendee_id']    = new FormControl(item.attendee_id);
        tempObj['id']             = new FormControl(item.user_id);
        tempObj['is_waiting']     = new FormControl(item.is_waiting || 'N');
        tempObj['event_id']       = new FormControl(item.event_id || this.event_id || 0);
        tempObj['eventattendeespecialfields'] = new FormArray(this.patchSpecialValues(item));
        this.guestItems           = this.guestForm.get('guestFields') as FormArray;

        this.guestItems.push(this._formBuilder.group(tempObj));
        //AutoComplete List
        this.getGuestsAutoList(index);
      });
    }  
  }

  NumberValidations(event) {
  
    this.guestItems     = this.guestForm.get('guestFields') as FormArray;
    if(event.target.value.length == 7){
    let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{4})/)
      event.target.value =  values[1] + '-' + values[2]
      this.guestItems.get('phone').setValue(event.target.value);
    }
    else{

     if(event.target.value.length == 10){
      let values = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
      event.target.value =  values[1] + '-' + values[2] + '-' + values[3];
      this.guestItems.get('phone').setValue(event.target.value);
    }else{
          if((event.target.value[3] == '-' && event.target.value.length == 8) || (event.target.value[7]=='-' &&  event.target.value.length == 12)){
            this.guestItems.get('phone').setValue(event.target.value);
          }else{
            this.guestItems.get('phone').setValue('');
          }
       }
  }
  }
  //Guest form fields
  createItem(): FormGroup {
    let emailrequired = this.requiredFields.includes('email') ? Validators.required : null;
    let phonerequired = this.requiredFields.includes('phone') ? Validators.required : null;

    return this._formBuilder.group({
      attendee_id   : [''],
      id            : [''],
      attendee_type : ['G',Validators.required],
      username      : [''],
      full_name     : [''],
      first_name    : ['',Validators.required],
      last_name     : [''],
      email         : ['',Validators.compose([emailrequired,Validators.email])],
      phone         : ['',Validators.compose([phonerequired])],
      is_waiting    : ['N'],
      event_id      : [this.event_id],
      eventattendeespecialfields: this._formBuilder.array([])
    });
  }
  //Add Guest More Memebers
  addGuests(): void {
    this.guestItems = this.guestForm.get('guestFields') as FormArray;
    if((this.guestItems.length+1 < this.groupLimit.length) || this.guestItems.length==0){
      this.guestItems.push(this.createItem());
      this.getGuestsAutoList(this.guestItems.length-1);
      //Increase attendees dropdown in main compo
      this.resetCount.emit(this.guestItems.length+1);
      //add special fields in to formArray
      if (this.specialfieldsArray && this.specialfieldsArray.length > 0) {
        this.patchSpecialFields(this.guestItems.length - 1);
      }
      //Prepare json send to parent
      this.prepareGuestArray();
    }
  }
  //Remove Guest Dynamic Fields
  removeGuests(item,index):void{
    if(!item.value.attendee_id){
      //Remove Rows and update count 
      this.resetGuestLimit(index);
      if(item.value && item.value.id && this.ignoreIds.length>0){
        const guestIndex = this.ignoreIds.findIndex(ignoreitem=>{return ignoreitem==item.value.id})
        
        if(guestIndex>=0){
          this.ignoreIds.splice(guestIndex,1);
        }
        
      }
    }
    else {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete attendees?';
      this.confirmDialogRef.afterClosed()
      .subscribe(result => {
          if ( result ) {
            //Remove Guest Attendee From Database
            if(item.value.attendee_id!==undefined && item.value.attendee_id>0){
              const deleteInfo = {attendee_id:[item.value.attendee_id],event_id:[item.value.event_id]};
              this._attendeesService.deleteAttendee('delete/attendeespermanentdelete',deleteInfo)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(delresponse=>{
                this.showSnackBar(delresponse.message,'OK');
                //Remove Rows and update count 
                this.resetGuestLimit(index);
              },
              error => {
                  // Show the error message
                  this.showSnackBar(error.message, 'RETRY');
              });
            }
            else{
              //Remove Rows and update count 
              this.resetGuestLimit(index);  
            }
          }
          
          this.confirmDialogRef = null;
      }); 
    }
  }
  //Reset Rows and GuestLimit
  resetGuestLimit(index:number){
    this.guestItems.removeAt(index);               
    if(this.guestItems.length<=0){
      this.resetCount.emit(this.guestItems.length+1);
    }
    else{
      this.resetCount.emit(this.guestItems.length+1);
    }
    this.prepareGuestArray();
  }
  //Auto list of guest exclude currrentUser
  getGuestsAutoList(index:number){
    let userIds = [];
    var guestFieldControls = this.guestForm.get('guestFields') as FormArray;
    userIds = this.guestItems.value.filter(item=>{return item.id>0}).map(item=> {return item.id});
    //Add Current UserId into ignorecase
    userIds.push(this.user_id);
    this.setIgnorIds(userIds);
    //Get Users Autocompletelist
    guestFieldControls.at(index).get('full_name').valueChanges.pipe(debounceTime(300),
    switchMap((value) => {      
      return this._userService.getUsers({'searchKey': value,ignore_ids:this.ignoreIds.join(","), autocomplete: '1'})
    }))
    .subscribe(users => this.filteredGuests[index] = users.data);
  }
  //Set guest Fields
  setguestFormfields($event,index){
    this.guestItems = this.guestForm.get('guestFields') as FormArray;
    if($event.option.value){
      var guestFieldControls = this.guestForm.get('guestFields') as FormArray;
      guestFieldControls.at(index).patchValue($event.option.value);
      guestFieldControls.at(index).get('full_name').setValue($event.option.value.first_name+' '+$event.option.value.last_name);  
      guestFieldControls.at(index).get('first_name').setValue($event.option.value.first_name);  
      guestFieldControls.at(index).get('last_name').setValue($event.option.value.last_name);  
    }
    //Check restirction of add button if length exceeded
    let guestItemsLength = this.guestItems.length;
    if(guestItemsLength+1<this.guestcount){
      this.enableAddGuest = true;
    }
    var UserIds    = this.guestItems.value.filter(item=>{return item.id>0}).map(item=> {return item.id});
    this.setIgnorIds(UserIds);
    this.prepareGuestArray();
  }

  //set First Name value on custom entry of user name
  setFirstNameValue(index) {
    var guestFieldControls = this.guestForm.get('guestFields') as FormArray;
    if (guestFieldControls.at(index).get('first_name').value == '') {
      guestFieldControls.at(index).get('first_name').setValue(guestFieldControls.at(index).get('full_name').value);
    }
    this.prepareGuestArray();
  }
  
  //show special fields with user fields
  patchSpecialFields(count) {
    this.guestItems = this.guestForm.get('guestFields') as FormArray;
    if (this.guestItems && this.guestItems.controls && this.guestItems.controls.length > 0) {

      if (this.specialfieldsArray && this.specialfieldsArray.length > 0) {
          
          this.eventSpecialFields = this.guestItems.at(count).get('eventattendeespecialfields') as FormArray;          
          this.specialfieldsArray.map((item) => {
            const tempObj = {};
            tempObj[item.id] = new FormControl('');
            this.eventSpecialFields.push(this._formBuilder.group(tempObj));
          });
      }

    }
  }
  //Patch saved special values to fields
  patchSpecialValues(guestItem){
    let optionsArray=[];
    if(this.specialfieldsArray && this.specialfieldsArray.length>0){
      this.specialfieldsArray.map((item, index) => {
        let editPatchvalue = {special_field_id:'',special_field_value:''};
        if(guestItem && guestItem.attendeespecialfields && guestItem.attendeespecialfields.length>0){
          editPatchvalue =  guestItem.attendeespecialfields.find(subitem=>{
            return item.id===subitem.special_field_id
          });
        }
        const tempObj = {};
        if(item.field_type=='T'){
          tempObj[item.id]  = new FormControl(editPatchvalue.special_field_value);  
        }
        else{
          tempObj[item.id]  = new FormControl(editPatchvalue.special_field_value); 
        }
        optionsArray.push(this._formBuilder.group(tempObj));
      });  
      return optionsArray;      
    }
    else{
      return optionsArray; 
    }
  }
  //Prepare Data for save and send to parent
  prepareGuestArray() {
    //Pass Values of Form to Parent Compo
    this.sendGuestInfo = this.guestForm.get('guestFields').value.filter(item => { return item.first_name !== '' });


    //Change id to user_id for guestinfo array
    //const newArrayOfObj = this.sendGuestInfo.map(({ id: user_id, ...rest }) => ({ user_id, ...rest }));
    const newArrayOfObj = this.sendGuestInfo.map(({ id: user_id, ...rest }) => ({ user_id, ...rest })).map(item => { delete item.full_name; return item });
    
    let finalGuestArray = newArrayOfObj.map(item=>{
      let specialfieldsArr = [];
      item.eventattendeespecialfields.map(item=>{
        let specialObj = {};
        if(Object.keys(item) && Object.keys(item).length>0 && Object.values(item).length>0){
          specialObj['special_field_id'] = Object.keys(item)[0];
          specialObj['special_field_value'] = Object.values(item)[0];
          specialfieldsArr.push(specialObj);
        }
      });
      item.eventattendeespecialfields = [...specialfieldsArr];
      return item;
    });
    setTimeout(() => {
      this.updateguestInfo.emit(finalGuestArray);
    });

    this.validateForm.emit(this.guestForm.invalid);
  }
  /** SHOW SNACK BAR */
  showSnackBar(message:string,buttonText:string){
    this._matSnackBar.open(message, buttonText, {
        verticalPosition: 'top',
        duration        : 2000
    });
  }
  //SetIgnoreIds
  setIgnorIds(userArr:any[]=[]){
    var userIdsIgnore = this.ignoreIds.concat(userArr);
    this.ignoreIds    = [...userIdsIgnore];
    this.ignoreIds    = [...CommonUtils.removeDuplicates(this.ignoreIds)];
  } 
  /**
   * On destroy
   */
  ngOnDestroy(): void{
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this.validateForm.emit(false);
  }
}