import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { UsersService, AttendeesService, CommonService } from 'app/_services';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

//import { MatSnackBar, MatDialog, MatDialogRef  } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers/common.utils';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-dining-guests',
  templateUrl: './dining-guests.component.html',
  styleUrls: ['./dining-guests.component.scss']
})
export class DiningGuestsComponent implements OnInit {

  @Input() guestcount: number = 0; //get attendees limit
  @Input() groupLimit: any[] = []; //Max Group Limit
  @Input() guest_required: any;

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
  sendGuestInfo: any[] = [];
  enableAddGuest: boolean = false;
  eventSettings: any = [];
  requiredFields: any = [];
  guestIds: any = [];
  ignoreIds: any[] = [];


  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;
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

    window.addEventListener('scroll', this.scrollEvent, true); 
    this.guestForm = this._formBuilder.group({
      guestFields: this._formBuilder.array([])
    });



  }

  scrollEvent = (event: any): void => {
    if (this.autoComplete) {
      if (this.autoComplete.panelOpen)
        // this.autoComplete.closePanel();
        this.autoComplete.updatePosition();
    }
  };
  //Catch the changed values
  ngOnChanges(changedValues: any) {
    //Set User Id to avoid in auto suggest

    if (changedValues.user_id !== undefined) {
      this.user_id = changedValues.user_id.currentValue || '';
      if (this.guestInfoArray) {
        this.patchFieldValues();
      }
    }
    if (changedValues.guestcount !== undefined) {

      this.guestcount = changedValues.guestcount.currentValue;
      if (this.guestcount > 1 && changedValues.guestcount.firstChange == false) {
        //if(this.guestcount>1){  


        this.guestItems = this.guestForm.get('guestFields') as FormArray;

        //If Values Of this.guestItems is not empty
        if (this.guestItems.length == 0) {
          var guestCountArr = Array.from(new Array(this.guestcount - 1 || 0), (val, index) => index);
          while (this.guestItems.length !== 0) {
            this.guestItems.removeAt(0);
          }

          guestCountArr.forEach((count, index) => {
            this.addGuests();
          });
        }
        // this.guestcount > this.guestItems.length
        else if (this.guestItems.length > 0 && this.guestcount > this.guestItems.length) {
          var guestCountArr = Array.from(new Array((this.guestcount - this.guestItems.length) - 1 || 0), (val, index) => index);

          guestCountArr.forEach((count, index) => {
            this.addGuests();
          });
        }
        // this.guestcount < this.guestItems.length
        else if (this.guestItems.length > 0 && this.guestcount < this.guestItems.length) {
          var guestCountArr = Array.from(new Array(this.guestItems.length || 0), (val, index) => index);
          guestCountArr.forEach((count, index) => {
            //this.guestItems.removeAt(this.guestItems.length - 1);
            this.guestItems.removeAt(this.guestcount - 1);
            this.prepareGuestArray();
          });
        }
        // this.guestcount == this.guestItems.length
        else if (this.guestItems.length > 0 && this.guestcount == this.guestItems.length) {
          this.guestItems.removeAt(this.guestItems.length - 1);
          this.prepareGuestArray();
        }
      }
      else if (this.guestcount == 1 && changedValues.guestcount.firstChange == false) {
        this.guestItems = this.guestForm.get('guestFields') as FormArray;
        //Remove If Value is <= 1
        while (this.guestItems.length !== 0) {
          this.guestItems.removeAt(0);
          this.prepareGuestArray();
        }
      }
    }

    //Validate Form and send to parent component
    if (this.guestForm) {
      this.validateForm.emit(this.guestForm.invalid);
    }

  }
  //get Edit Array
  get guestFields(): FormArray {
    return this.guestForm.get('guestFields') as FormArray;
  }
  //AutoPopulate Form Fields
  patchFieldValues(): void {

    if (this.guestInfoArray) {
      this.guestInfoArray.map((item, index) => {
        const tempObj = {};
        tempObj['first_name'] = new FormControl(item.guest_name);
        tempObj['id'] = new FormControl(item.user_id);
        this.guestItems = this.guestForm.get('guestFields') as FormArray;
        this.guestItems.push(this._formBuilder.group(tempObj));
        this.getGuestsAutoList(index);
      });

    }
  }
  //Guest form fields
  createItem(): FormGroup {

    if (this.guest_required == 'Y') {
      return this._formBuilder.group({
        id: [''],
        first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      });
    } else {
      return this._formBuilder.group({
        id: [''],
        first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      });
    }



  }
  //Add Guest More Memebers
  addGuests(): void {

    this.guestItems = this.guestForm.get('guestFields') as FormArray;
    if ((this.guestItems.length + 1 < this.groupLimit.length) || this.guestItems.length == 0) {
      this.guestItems.push(this.createItem());
      this.getGuestsAutoList(this.guestItems.length - 1);
      //Increase attendees dropdown in main compo
      this.resetCount.emit(this.guestItems.length + 1);
      //Prepare json send to parent
      this.prepareGuestArray();
    }
  }

  //Reset Rows and GuestLimit
  resetGuestLimit(index: number) {
    this.guestItems.removeAt(index);
    if (this.guestItems.length <= 0) {
      this.resetCount.emit(this.guestItems.length + 1);
    }
    else {
      this.resetCount.emit(this.guestItems.length + 1);
    }
    this.prepareGuestArray();
  }
  //Auto list of guest exclude currrentUser
  getGuestsAutoList(index: number) {
    let userIds = [];
    var guestFieldControls = this.guestForm.get('guestFields') as FormArray;
    userIds = this.guestItems.value.filter(item => { return item.id > 0 }).map(item => { return item.id });
    //Add Current UserId into ignorecase
    userIds.push(JSON.parse(localStorage.getItem('token')).user_id);
    console.log('userIds', userIds);
    this.setIgnorIds(userIds);
    //Get Users Autocompletelist
    guestFieldControls.at(index).get('first_name').valueChanges.pipe(debounceTime(300),
      switchMap((value) => {
        return this._userService.getUsers({ 'searchKey': value, ignore_ids: this.ignoreIds.join(","), autopopulate:1 })
      }))
      .subscribe(users => this.filteredGuests[index] = users.data);

  }
  //Set guest Fields
  setguestFormfields($event, index) {

    this.guestItems = this.guestForm.get('guestFields') as FormArray;

    if ($event.option.value) {
      var guestFieldControls = this.guestForm.get('guestFields') as FormArray;
      guestFieldControls.at(index).patchValue($event.option.value);
      guestFieldControls.at(index).get('first_name').setValue($event.option.value.first_name + ' ' + $event.option.value.last_name);
      //guestFieldControls.at(index).patchValue($event.option.value.first_name);  
    }
    //Check restirction of add button if length exceeded
    let guestItemsLength = this.guestItems.length;
    if (guestItemsLength + 1 < this.guestcount) {
      this.enableAddGuest = true;
    }
    var UserIds = this.guestItems.value.filter(item => { return item.id > 0 }).map(item => { return item.id });
    this.setIgnorIds(UserIds);
    this.prepareGuestArray();
  }
  //Prepare Data for save and send to parent
  prepareGuestArray() {
    //Pass Values of Form to Parent Compo
    this.sendGuestInfo = this.guestForm.get('guestFields').value.filter(item => { return item.first_name !== '' });
    //Change id to user_id for guestinfo array
    const newArrayOfObj = this.sendGuestInfo.map(({ id: user_id, first_name: guest_name, ...rest }) => ({ user_id, guest_name, ...rest }));
    console.log('newArrayOfObj', newArrayOfObj);
    this.guestIds = this.guestItems.value.filter(item => { return item.id > 0 }).map(item => { return item.id });
    setTimeout(() => {
      this.updateguestInfo.emit(newArrayOfObj);
    });

    this.validateForm.emit(this.guestForm.invalid);
    //  if(this.guestForm.touched == true){
    //   this.validateForm.emit(this.guestForm.touched);
    //  }

  }

  //SetIgnoreIds
  setIgnorIds(userArr: any[] = []) {
    var userIdsIgnore = this.ignoreIds.concat(userArr);
    this.ignoreIds = [...userIdsIgnore];
    this.ignoreIds = [...CommonUtils.removeDuplicates(this.ignoreIds)];
  }
  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.validateForm.emit(false);
  }

}
