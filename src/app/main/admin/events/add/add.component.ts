import { Component, OnInit, ViewChild, ɵConsole, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonUtils } from 'app/_helpers';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionsList, CategoryService, RolesService, CommonService, EventcategoryService, EventsService, AuthService, ChatService } from 'app/_services';
import { RecurringComponent } from '../recurring/recurring.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterdataComponent } from '../registerdata/registerdata.component';
import { Event } from 'app/_models/events.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventmetaComponent } from '../eventmeta/eventmeta.component';
import { AddLocationComponent } from '../locations/add/add.component';
import { EventbehavioursubService } from 'app/_services/eventbehavioursub.service';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { User } from 'app/_models';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {
  locationDialogRef: MatDialogRef<AddLocationComponent>; //EXTRA Changes
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public title: string = '';
  public defaultRoleId: any[] = [];
  public defaultcatId: any[] = [];
  public eventform: FormGroup;
  public isSubmit: boolean = false;
  public editEvent: boolean = false;
  public locations: any = [];
  public roles: any = [];
  public categories: any = [];
  public eventMeta: any = [];
  public recDates: any = [];
  public eventRecurrences: any = [];
  public recurring_everyList: any = [];
  public week_days: any = [];
  public fieldConfig: any = [];
  public tinyMceSettings = {};
  public recurring_meta: any = '';
  public recurringData: any;
  public registerData: any;
  public eventMetaData: any;
  public event_id: number;
  public userid: any;
  public userInfo: any;
  public organizerInfo: Object = { org_name: '', org_email: '' };
  public MetaUploadInfo: any;
  public recentlocation: any;
  public locationid: any;
  public recRule: string;
  public generalSettings: any;
  public eventSettings: any = {};
  public isRecurring: any;
  public recUpdateType: any;
  public enablePopup: boolean = false;
  public update: any;
  public disableSubmit: boolean = false;
  public recurringtype: any;
  public eventRegData;
  public eventSpecialFields: any[]=[];
  public recEventUpdateTypeValue: any;
  private _unsubscribeAll: Subject<any>;

  public pusherCounter = 0;
  public userId: any;
  public ann_list: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public url_id: any;
  public calendarSlug: string='';
  public Category_Calendar_list ;
  public selectedCalendar: any='';
  public allistRoute    : any = '';    
  public displaySlug    : string = '';     
  public commonCategories: any[]=[];
  // Private
  @ViewChild(RegisterdataComponent, { static: true }) private registermeta: RegisterdataComponent;
  @ViewChild(RecurringComponent,{static:true}) private recurringComponentMeta: RecurringComponent;
  @ViewChild(EventmetaComponent, { static: true }) private eventmeta: EventmetaComponent;

  constructor(
    private _chatService: ChatService,
    private fb: FormBuilder,
    private el: ElementRef,
    private _authService: AuthService,
    private _categoryService: CategoryService,
    private _roleService: RolesService,
    private _commonService: CommonService,
    private _eventService: EventsService,
    private _eventCategoryService: EventcategoryService,
    private route: ActivatedRoute,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private _matDialog: MatDialog,
    private eventbehavioursub: EventbehavioursubService,
    private _commonUtils: CommonUtils,
    private _dialog: MatDialog
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.tinyMceSettings = CommonUtils.getTinymceSetting('eventdesc');
    this.calendarSlug    = this.route.params && this.route.params['value'].slug ? this.route.params['value'].slug : '';

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        this.calendarSlug  = params && params['slug'] ? params['slug'] : '';
        if(this.calendarSlug!==''){
          this.displaySlug    = this.calendarSlug.replace('-',' ');
          this.allistRoute    =  ['/admin/event/',this.calendarSlug];  
        }
        else{
          this.allistRoute        =  ['/admin/events/all'];
        }
        this.setSelectedCalendar();
    });
    

    if (this.route.routeConfig.path == 'admin/events/edit/:id' && this.route.params['value'].id > 0) {
      this.event_id = this.route.params['value'].id;
      this.url_id = this.route.params['value'].id;
      this.editEvent = true;
    }
    this.userid = JSON.parse(localStorage.getItem('token')).user_id;
    this.editEvent == true ? this.title = "Update Event" : this.title = "Add New Event";
    //GET IS RECURRING TYPE
    this.eventbehavioursub.isRecurringChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(type => {
      this.isRecurring = type ? type : 'N';
    });
  }

  ngOnInit() {
    //Event Settings Fromn LocalStorage
    let eventSettings = this._commonService.getLocalSettingsJson('event-settings');
    this.eventSettings = eventSettings ? eventSettings[0] : {};
    if (this.eventSettings.event_list_display_settings) {
      this.defaultRoleId = this.eventSettings.event_list_display_settings.add_event_default_role || [];
      this.defaultcatId = this.eventSettings.event_list_display_settings.add_event_default_category || [];
    }
    //get commoncategories
    this._eventCategoryService.getCommonCategory({'category_type':'C','column':'category_name','status':'A','direction':'asc','front':1}).then(commoncatlist=>{
      this.commonCategories = commoncatlist.data;
    })
    //Create Form Controls
    this.createFormGroup();
    this.recurring_everyList = OptionsList.Options.recurring_everyList;
    this.fieldConfig = this._commonService.metaFields;

    this.MetaUploadInfo = { 'event': { 'type': 'field', 'fieldConfig': this.fieldConfig } }
    // this.locations = this._categoryService.Categorys.data;
    // this.categories = this._eventCategoryService.eventcategory.data;
    this.roles = this._roleService.roles.data;

    //On Any Recurring Changes 
    this.eventbehavioursub.EnableRecurringModal
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(modalChange => {
        this.enablePopup = modalChange || false;
      });
    //On Any Registration Changes
    this.eventbehavioursub.RunTimeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(regChange => {
        this.enablePopup = regChange || false;
      });
    //On Event Meta Fields Change
    this._commonService.filterMetaFields
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(metaChange => {
        if (metaChange !== null && metaChange !== '' && metaChange !== undefined) {
          this.enablePopup = true;
        }
      });
    //On Manaul Recurring End date blank
    this.eventbehavioursub.manualRecValidate
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        this.disableSubmit = result;
      });
  }

  //Declare Form Group
  createFormGroup() {
    this.eventform = this.fb.group({
      event_title: this.fb.control('', [Validators.required]),
      event_description: this.fb.control(''),
      display_description: this.fb.control('Y', [Validators.required]),
      event_location: this.fb.control([]),
      categories: this.fb.control(this.defaultcatId),
      subcategories: this.fb.control([]),
      mail_notification: this.fb.control(''),
      roles: this.fb.control(this.defaultRoleId),
      parent_event_id: this.fb.control(''),
      status: this.fb.control('A'),
      calendar_id : this.fb.control('',[Validators.required]),
      organizer_name: this.fb.control(this.organizerInfo['org_name']),
      organizer_email: this.fb.control(this.organizerInfo['org_email'], [Validators.email, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      is_recurring: this.fb.control(this.isRecurring, [Validators.required]),

      created_by: this.fb.control(this.userid ? this.userid : ''),
      updated_by: this.fb.control(this.userid ? this.userid : ''),
      special_event: this.fb.control(false),
      is_signage: this.fb.control('N', [Validators.required]),
      schedule: this.fb.control(''),
      eventspecialfields  : this.fb.control('')
    });

    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/events/edit/:id') {
      this.userid = JSON.parse(localStorage.getItem('token')).user_id;

      this.eventValues(true);
      //this.getFilteredEvent();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }

  // set the value to the location and categoary accoding the category calendar 
  setvalue(){
    let value = this.eventform.get('calendar_id').value;
    this._eventCategoryService.getCategory({'category_type':'C','column':'category_name','status':'A','direction':'asc','calendar_id':value}).then(categories=>{
      this.categories = categories.data;
    })
    this._eventCategoryService.getCategory({'category_type':'EL','column':'category_name','status':'A','direction':'asc','calendar_id':value}).then(locations=>{
      this.locations = locations.data;
    })
  }
  setSelectedCalendar(){
    this._eventCategoryService.getCategory({'category_type':'ECL','column':'category_name','status':'A','direction':'asc'}).then(res=>{
      this.Category_Calendar_list = res.data;
      if(this.calendarSlug!=='' && this.Category_Calendar_list && this.Category_Calendar_list.length>0){
        let selCalendar = this.Category_Calendar_list.find(item=>{
          return item.category_alias==this.calendarSlug;
        });
        this.selectedCalendar = selCalendar && selCalendar.id>0 ? selCalendar.id : '';
        if(this.selectedCalendar!==''){
          this.eventform.get('calendar_id').setValue(this.selectedCalendar);
          this.setvalue();
        }
      }
    }); 
  }
  getFilteredEvent() {
    return this._eventService.getEvents({ 'column': 'event_id', 'direction': 'desc', 'disp_req_register': 'N' }).then(Response => {
      this.ann_list = Response.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      this.ann_list.forEach(item => {
        if (this.event_id == item.event_id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.userId) {
              let edit: boolean = true;
              this.eventValues(edit);
            }
            if (item.editrestriction.user.id != this.userId) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
              this.firstUserId = item.editrestriction.user.id;
            }
          } else {
            let edit: boolean = true;
            this.eventValues(edit);
          }
        }
      });
      this.showDialog();
    });
  }


  showPopup() {
    const dialogRef = this._matDialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'UpdateEvent', body: '<h2>Recurring Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/events/all']);
      }
    });
  }


  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._matDialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'UpdateEvent', body: '<h2>Recurring Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/events/all']);
        }
        if (result == 'takeover') {
          this.editRestrictForm();
        }
      });
    }
  }

  editRestrictForm() {
    this._eventService.updateForm(this.event_id, 'event').subscribe(response => {
      let edit: boolean = true;
      this.eventValues(edit);
    });
  }

  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.ann_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter == 1) {
        this.showPopup();
      }
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._dialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.userId;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'event';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  // eventValues(edit: any) {
  //   this._eventService.viewEvents(this.event_id, edit).then(response => {     
  //     console.log("response event", response); 
  //     let formData = new Event().deserialize(response.eventinfo);      
  //     let categories = formData.eventcategories.map(function (category) {
  //       return category.category_id;
  //     });
  //     let roles = formData.eventaccess.map(function (role) {
  //       return role.role_id;
  //     });

  //     this.recUpdateType = formData.is_recurring;

  //     this.eventform.get('event_location').setValue(formData.event_location);
  //     this.eventform.get('categories').setValue(categories);
  //     this.eventform.get('roles').setValue(roles);

  //     // this.eventform.get('special_event').setValue(formData.special_event == 'N' ? false : true); 
  //     if (formData.special_event == 'N') {
  //       formData.special_event = "";
  //     }

  //     this.eventform.patchValue(formData);
  //     // recurring_rule 
  //     this.recRule = formData.recurring_rule;
  //     this.isRecurring = formData.is_recurring;
  //     //recurring data
  //     this.recurringData = formData;

  //     //isRegister data
  //     this.registerData = formData;

  //     //isEventMeta data
  //     this.eventMetaData = formData.eventmeta;
  //   });
  // }
  /** FILL FORM FROM EDIT ROUTE */
  eventValues(edit: any) {
    this._eventService.viewEvent(this.event_id).then(response => {
      let formData = new Event().deserialize(response.eventinfo,'editevent');
      let categories = formData.eventcategories.map(function (category) {
        return category.category_id;
      });
      //eventlocations
      let eventlocations = formData.eventlocations.map(function (location) {
        return location.location_id;
      });
      formData.event_location = eventlocations || [];
      //subcategories
      let subcategories = formData.eventsubcategories.map(function (category) {
        return category.subcategory_id;
      });
      let roles = formData.eventaccess.map(function (role) {
        return role.role_id;
      });
      this.eventform.get('calendar_id').setValue(response.eventinfo.eventcalendar.id); //pathc the value of the category calendar 
      
      this.recUpdateType = formData.is_recurring;    
      this.eventform.get('categories').setValue(categories);
      this.eventform.get('subcategories').setValue(subcategories);
      this.eventform.get('event_location').setValue(eventlocations);
      this.eventform.get('roles').setValue(roles);
      
      //   // this.eventform.get('special_event').setValue(formData.special_event == 'N' ? false : true); 
      if (formData.special_event == 'N') {
        formData.special_event = "";
      }

      this.eventform.patchValue(formData);
      //   // recurring_rule 
      this.recRule = formData.recurring_rule;
      this.isRecurring = formData.is_recurring;
      //   //recurring data
      this.recurringData = formData;

      //   //isRegister data
      this.registerData = formData;

      //   //isEventMeta data
      this.eventMetaData = formData.eventmeta;

      if(this.editEvent==true && response.eventinfo && response.eventinfo.eventcalendar && response.eventinfo.eventcalendar.category_alias ){
        this.calendarSlug = response.eventinfo.eventcalendar.category_alias;
        this.allistRoute  = ['/admin/event/',this.calendarSlug];  
      }
    });
  }


  //CANCEL EDITEVENT
  onClickCancel() {
    if (this.recUpdateType == 'Y') {
      const dialogRef = this._dialog.open(FormFieldsComponent, {
        disableClose: true,
        width: '40%',
        data: { type: 'eventStatusUpdate', body: '<h2>Are you sure you want to cancel this event?</h2>' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != 'N') {
          this.eventStatusUpdate(result);
        }
      });
    }
    if (this.recUpdateType == 'N') {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to cancel this event??';
      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            let cancelflag: string = 'C';
            this.eventStatusUpdate(cancelflag);
          }
        })
    }
  }

  eventStatusUpdate(flag) {
    let statusData = {
      'event_id': this.event_id,
      'status': 'C',
      'flag': flag
    }
    this._eventService.eventStatusChange(statusData)
      .subscribe(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(this.allistRoute);
      },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });
  }

  //RESTORE EDITEVENT
  onClickRestore() {
    if (this.recUpdateType == 'Y') {
      const dialogRef = this._dialog.open(FormFieldsComponent, {
        disableClose: true,
        width: '50%',
        data: { type: 'eventRestore', body: '<h2>Are you sure you want to restore this event?</h2>' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != 'N') {
          this.restoreEvent(result);
        }
      });
    }
    else {
      let result: string = 'C';
      this.restoreEvent(result);
    }
  }

  restoreEvent(flag) {
    let statusData = {
      'event_id': this.event_id,
      'status': 'A',
      'flag': flag
    }
    this._eventService.eventStatusChange(statusData)
      .subscribe(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(this.allistRoute);
      },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });
  }

  //DELETE EDITEVENT
  onClickDelete() {
    if (this.recUpdateType == 'Y') {
      const dialogRef = this._dialog.open(FormFieldsComponent, {
        disableClose: true,
        width: '50%',
        data: { type: 'eventDelete', body: '<h2>Are you sure you want to delete this event?</h2>' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 'Y') {
          this.deleteEvent(result);
        }
        else {

        }
      });
    }

    if (this.recUpdateType == 'N') {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected event?';
      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            let deleteData = {
              'event_id': this.event_id.toString().split(','),
              'remove_recurrence': 'N'
            };
            //let deleteUrl =  this.trash==true ? 'delete/forcedeleteevents' : 'delete/events';
            this._eventService.deleteEvent('delete/events', deleteData)
              .subscribe(deleteResponse => {
                this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
                  verticalPosition: 'top',
                  duration: 2000
                });
                this.router.navigate(this.allistRoute);
              },
                error => {
                  // Show the error message
                  this._matSnackBar.open(error.message, 'Retry', {
                    verticalPosition: 'top',
                    duration: 2000
                  });
                });
          }
          this.confirmDialogRef = null;
        });
    }
  }

  deleteEvent(result) {
    let deleteData = {
      'event_id': this.event_id.toString().split(','),
      'remove_recurrence': result
    };
    this._eventService.deleteEvent('delete/events', deleteData)
      .subscribe(deleteResponse => {
        this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(this.allistRoute);
      },
        error => {
          // Show the error message
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });
  }
  /** ENABLE POPUP OF EDIT IF ANY CHANGE IN FORM  */
  enableEditPopup($event) {
    this.enablePopup = true;
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setRecurringValue($event: any) {
    this.eventRecurrences = $event.recurrences;
    this.recurring_meta = $event.recurring_meta;
    this.recurringtype = $event.recurring_meta.recurring_type;
    this.recRule = $event.recRule ? $event.recRule : '';
    this.enablePopup = true;
  }

  setRegisterValue($event: any) {
    this.eventRegData = $event;
    this.enablePopup = true;
  }

  setMetaFieldValue($event: any) {
    if ($event) {
      this.eventMeta = $event.eventmeta;
      this.enablePopup = true;
    }
  }
  //SET SPECIAL FIELDS VALUE
  setSpecialInfoFields($event: any){
    if($event.length>0){
      this.eventSpecialFields = $event;
      this.enablePopup  = true;
    }
  }
  //ADD NEW LOCATION
  openLocationModal() {
    let newlocationArr = [];
    this.locationDialogRef = this._matDialog.open(AddLocationComponent,
      {
        disableClose: false,
        data: { openmodal: true },
        panelClass: 'custom-modalbox'
      });
    this.locationDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.locations.push(result.categoryinfo);
          newlocationArr.push(result.categoryinfo.id);
          if(newlocationArr && newlocationArr.length>0){
            this.eventform.get('event_location').setValue(newlocationArr);
          }          
        }
        this.locationDialogRef = null;
      });
  }

  recEventUpdateType(type) {
    let eventAttendees = this.recurringData && this.recurringData.eventattendees ? this.recurringData.eventattendees : [];
    if (type == 'Y' && this.enablePopup == true) {
      const dialogRef = this._dialog.open(FormFieldsComponent, {
        disableClose: true,
        width: '50%',
        data: { eventAttendees: eventAttendees, type: 'recurringUpdate', body: '<h2>Recurring Confirmation</h2>' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != 'N') {
          // this.recEventUpdateTypeValue = result;
          this.onSubmit(result);
        }
      });
    }
    else {
      let result: string = 'C';
      // this.recEventUpdateTypeValue= result;
      this.onSubmit(result);
    }
  }
  onSubmit(result: any) {
    let eventvalue: any = { ...this.eventform.value };

    let recurringValid  = this.recurringComponentMeta.validateUserMetaForm(true);
    let registerValid   = this.registermeta.validateRegisterForm(true);
    let eventmetaValid  = this.eventmeta.validateEventMetaForm(true);   

    eventvalue = this.eventRegData ? Object.assign(eventvalue, this.eventRegData) : '';
    if (eventvalue) {
      eventvalue.recurring_meta = this.recurring_meta ? JSON.stringify(this.recurring_meta) : '';
      eventvalue.recurrences = this.eventRecurrences ? JSON.stringify(this.eventRecurrences) : '';
      if (this.isRecurring == 'Y') {
        eventvalue.recurring_type = this.recurringtype ? this.recurringtype : 'A';
        eventvalue.recurring_rule = this.recRule ? this.recRule.replace(/(\r\n|\n|\r)/gm, ";") : null;
      }
      //DS Info Set
      eventvalue.schedule = eventvalue.schedule ? JSON.stringify(eventvalue.schedule) : null;
      //special fields array
      eventvalue.eventspecialfields = this.eventSpecialFields && this.eventSpecialFields.length>0 ? JSON.stringify(this.eventSpecialFields) : '';
      eventvalue.eventmeta = this.eventMeta ? this.eventMeta : '';
      eventvalue.update = result ? result : 'C';
      eventvalue.roles = this._commonUtils.getArrayToString(eventvalue.roles);
      eventvalue.categories = this._commonUtils.getArrayToString(eventvalue.categories);
      eventvalue.subcategories = this._commonUtils.getArrayToString(eventvalue.subcategories);
      eventvalue.event_location = this._commonUtils.getArrayToString(eventvalue.event_location);
      eventvalue.is_recurring = this.isRecurring;
      eventvalue.special_event = eventvalue.special_event == true ? 'Y' : 'N';

      if (!eventvalue.group_register) {
        eventvalue.group_register = 'N';
      }

      if (!eventvalue.is_waitlist) {
        eventvalue.is_waitlist = 'N';
      }

      if (this.editEvent) {
        eventvalue.event_id = this.event_id; //on edit form
      }

      if (eventvalue.eventmeta == "[]") {
        delete eventvalue.eventmeta; //event meta is empty
      }
    }
    if(this.eventform.valid && registerValid==true && recurringValid==true){
      // console.log("eventvalue>>>",eventvalue);
      // return false;
      this._eventService.saveEvent(eventvalue, this.editEvent)
        .subscribe(response => {
          this.savingEntry = true;
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(this.allistRoute);
        },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }
    else {
      this.validateAllFormFields(this.eventform);
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    this.scrollToFirstInvalidControl();
  }
  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector("form .ng-invalid");
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView(); //without smooth behavior
    }
  }
  //set editor media
  setEditorMedia($event:any){
    let existingValue = this.eventform.get($event.controlName).value;
    if(existingValue){
      $event.element = existingValue + $event.element
    }
    this.eventform.get($event.controlName).setValue($event.element);
  }
  //Signage Fields Required
  setSignageRequired(isRequired: string = 'N') {
    if (isRequired == 'N') {
      this.eventform.get('schedule').setValidators(null);
      this.eventform.get('schedule').updateValueAndValidity();
    }
    else {
      this.eventform.get('schedule').setValidators(Validators.required);
      this.eventform.get('schedule').updateValueAndValidity();
    }
  }
}

/**
 * This is reletaed with organizer name and email field display by
this.organizerInfo['org_name']  = this.eventSettings && this.eventSettings.contact_information ? this.eventSettings.contact_information.community_name : '';
this.organizerInfo['org_email'] = this.eventSettings && this.eventSettings.contact_information ? this.eventSettings.contact_information.organizer_email : '';
//User Info Set As Organizer Info
this.userInfo                   = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : {};
this.organizerInfo['org_name']  = this.userInfo.username ? this.userInfo.username : this.organizerInfo['org_name'];
this.organizerInfo['org_email'] = this.userInfo.email ? this.userInfo.email : this.organizerInfo['org_email'];

 */