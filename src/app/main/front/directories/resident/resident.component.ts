import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { UsersService, AppConfig, CommonService, OptionsList, ChatService } from 'app/_services';
import { MatPaginator } from '@angular/material/paginator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { merge, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'app/_models';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.scss'],
  animations: fuseAnimations
})
export class ResidentComponent implements OnInit {

  public localUserInfo: any;
  public directory_view: string = '';
  public front: string = '';
  public homeSettings: any = {};
  public Columns: any[];
  public displayedColumns: string[];
  public ShowNeighbors: boolean = false;
  public localSettings: any = { residentdirectorysearch: {} };
  public directorySettings: any;
  public lettersList: any[];
  public CustomFormats: any;
  public _enableChat: string = 'N';
  public dateFormat;
  public residentList: any = { data: [], total: '' };
  public phonelengthArr: any[] = [7, 10];
  public fieldOptions: any = { corefields: [], metafields: [], alpha_sorting: 'N' };
  public filterOptions: any = { filtercorefields: [], filtermetafields: [] };
  public filterParams: any = { 'front': '', 'page': '0', 'limit': '10' }
  public defaultAvatar: string = '';
  public defaultCover: string = '';
  public coreFields: any;
  public metaFields: any;
  public viewTitle: any;
  public title: string = '';
  public ShowData: boolean;
  public noRecordsFound: boolean = false;
  public newResidents: boolean = false;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  PaginationOpt: { pageSize, pageSizeOptions: [], page: 0, tileviewmeta: [] }; //pagination size,page options  
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;

  //FormGroup
  private _unsubscribeAll: Subject<any>;
  filterForm: FormGroup;
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _chatService: ChatService,
    private _commonService: CommonService,
    private _appConfig: AppConfig
  ) {
    

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.setDirectorySettings();
      });
    //get Local User Info
    this.localUserInfo = JSON.parse(localStorage.getItem('token'));
    if (this.route.routeConfig.path == 'new-residents') {
      this.front = '1';
      this.newResidents = true;
      this.filterParams.front = this.front;
      this.title = "New Resident Announcement";
    }
    else {
      this.title = 'Resident Directory';
      this.newResidents = false;
    }
  }

  ngOnInit() {

    this.Columns = OptionsList.Options.tables.list.residents;
    this.displayedColumns = OptionsList.Options.tables.list.residents.map(col => col.columnDef);
    //Set Settings Options for pagination,dateFormat,etc...
    this.setDirectorySettings();
    //Get Phone n datePicker Format 
    this.CustomFormats = OptionsList.Options.customformats;
    //Get MetaFields Array For Filtering
    this._commonService.getExportFieldsForDirectory().subscribe(data => {
      if (data['directoryfields']) {
        this.filterOptions = data['directoryfields']['filteroptions'] ? data['directoryfields']['filteroptions'] : this.filterOptions;
        this.fieldOptions = data['directoryfields'];
      }
    });
    //Declare Form
    this.filterForm = this._formBuilder.group({
      searchKey: [''],
      username: [''],
      preffix: [''],
      first_name: [''],
      last_name: [''],
      middle_name: [''],
      email: [''],
      phone: [''],
      birthdate: [''],
      metafields: [[]],
      letters: [''],
      directory_view: ['traditional_view'],
      front: [this.front]
    });
    //Detect Form Change Event and paignation change event n call api
    merge(this.paginator.page, this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        this.filterParams = CommonUtils.getFilterJson('', this.paginator, this.filterForm.value);        
        this.getResidentList();
        window.scrollTo(0, 0)
      });
    //Show Letters Sorting
    this.lettersList = (() => {
      let caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
      return caps;
    })();
    
  }
  handlePage(e: any) {
    var element = document.getElementById("top");
    element.scrollIntoView(true);
  }
  onAllUserPaginateChange(event: any) {
    const matTable= document.getElementById('matTable');
    matTable.scrollTop = 0;
  }
  ngOnChanges() {
    this.setDirectorySettings();
  }
  //GET EVENTS LIST FROM SERVER
  getResidentList() {
    //Change Date Format to Mysql
    if (this.filterParams['birthdate'] != null && this.filterParams['birthdate'] != '') {
      this.filterParams['birthdate'] = this._commonService.getMySqlDate(this.filterParams['birthdate']);
    }
    this.noRecordsFound = false;
    this._userService.getResident(this.filterParams).subscribe(response => {
      this.residentList.data = response.data.map(c => new User().deserialize(c, 'resident'));
      //Hide Testing Emails If Settings Filled At Backend
      if (this.residentList.data && this.localSettings && this.localSettings.users_settings.domain_emails !== '') {
        this.hideDomainMails();
      }
      this.residentList.total = response.total || '';
      if (this.residentList.data.length == 0) {
        this.noRecordsFound = true;
      }      
    });
  }

  //CHANGE Birthdate Format For Filter param
  onBirthdateChange() {
    if (this.filterForm.get('birthdate').value !== null) {
      this.filterForm.get('birthdate').setValue(this._commonService.getMySqlDate(this.filterForm.get('birthdate').value));
    }
  }

  onLetterChange(i) {
    this.filterForm.get('letters').setValue(i);
  }


  SwitchView() {
    this.directory_view = this.filterForm.get('directory_view').value;
    this.directorySettings.directory_view = this.directory_view;
    if (this.newResidents == false) {
      if (this.directory_view == 'tile_view') {
        this.ShowData = true;
        this.title = "Resident Directory Tile View";
      } else if (this.directory_view == 'list_view') {
        this.ShowData = false;
        this.title = "Resident Directory List View";
      } else {
        this.ShowData = false;
        this.title = "Resident Directory";
      }
    }
    else {
      if (this.directory_view == 'tile_view') {
        this.ShowData = true;
        this.title = "New Resident Announcement Tile View";
      } else if (this.directory_view == 'list_view') {
        this.ShowData = false;
        this.title = "New Resident Announcement List View";
      } else {
        this.ShowData = false;
        this.title = "New Resident Announcement";
      }
    }
  }

  //Reset PageIndex On Form Changes
  resetPageIndex() {
    this.filterForm.valueChanges.subscribe(data => {
      this.paginator.pageIndex = 0;
    });
  }
  // GET PRINT OF RESIDENT DIRECTORY
  getPrint() {
    //FormValues
    let formValues = { ...this.filterForm.value };
    formValues['print'] = 1;
    formValues['status'] = 'A';
    formValues['display'] = this.directorySettings.directory_view;

    this._userService.getResident(formValues).subscribe(response => {
      window.open(AppConfig.Settings.url.mediaUrl + response.pdfinfo);
    });
  }

  // reset form value
  resetform() {
    this.filterForm.reset();
    this._commonService.clearMetaFields(1);
  }


  setUserMetaFilter($event) {
    if ($event == "") {
      this.filterForm.get('metafields').setValue("");
    }
    else {
      this.filterForm.get('metafields').setValue(JSON.stringify($event));
    }
  }
  setDirectorySettings() {    
    //Load Users Settings From Localstorage
    this.localSettings = this._appConfig._localStorage.value.settings;
    //newest neighbours settings
    if (this.localSettings.home_settings) {
      this.homeSettings = CommonUtils.getStringToJson(this.localSettings.home_settings);
    }

    this.directorySettings = CommonUtils.getStringToJson(this.localSettings.residentdirectorysearch);
    this.directorySettings = this.directorySettings.length > 0 ? this.directorySettings[0] : {};
    //newest neighbours
    if (this.directorySettings && this.directorySettings.newest_neighbours == 'Y') {
      this.ShowNeighbors = true;
    }
    if (this.newResidents == false) {
      if (this.directorySettings && this.directorySettings.directory_view == 'traditional_view') {
        this.ShowData = false;
        this.title = "Resident Directory";
      } else {
        this.ShowData = true;
        this.title = "Resident Directory Tile View";
      }
    }
    else {
      if (this.directorySettings && this.directorySettings.directory_view == 'traditional_view') {
        this.ShowData = false;
        this.title = "New Resident Announcement";
      } else {
        this.ShowData = true;
        this.title = "New Resident Announcement Tile View";
      }
    }
    this.directory_view = this.directorySettings ? this.directorySettings.directory_view : 'traditional_view';
    // this.directorySettings.directory_view == 'traditional_view' ? this.ShowData = true : this.ShowData = false;


    let CommonSettings = this._commonService.getLocalSettingsJson('general_settings');
    this.dateFormat = CommonSettings['date_format'] || 'DD M';

    //DEFAULT PGINATION OTPIONS FROM OPTIONSLIST JSON
    this.PaginationOpt = OptionsList.Options.tables.pagination.directoryoptions;
    //SET LIMIT TO PAGINATION
    if (this.directorySettings.user_limit) {
      this.PaginationOpt.pageSize = this.directorySettings.user_limit;
    }
    //Default Avatars Images
    this.defaultAvatar = AppConfig.Settings.url.mediaUrl + this.localSettings.users_settings.defaultprofile || AppConfig.Settings.url.defaultAvatar;
    this.defaultCover = AppConfig.Settings.url.mediaUrl + this.localSettings.users_settings.defaultcover || AppConfig.Settings.url.defaultCover;
    //ENABLE OR DISABLE CHAT MODULE
    if (this.localSettings && this.localSettings.users_settings) {
      this._enableChat = this.localSettings.users_settings.allow_chat || 'N';
    }
  }
  //SET BIRTHDATE FROM CHILD COMPONENET
  setBirthdate($event) {
    this.filterForm.get('birthdate').setValue($event);
  }
  /** ADD to Contact */
  addContact(residentId: number) {
    if (residentId) {
      this._chatService.createContact({ user_id: this.localUserInfo.user_id, contact_id: residentId, status: 'A' })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          if (response.status == 200) {
            this.localUserInfo.user_contacts.push(residentId);
            //Update localStorage Contacts
            localStorage.setItem('token', JSON.stringify(this.localUserInfo));
          }
        })
    }
  }
  /**OPEN CHAT WINDOW */
  openChatWindow(contactId) {
    this._chatService.onResidentSelected.next(contactId);
    this.router.navigate(['/chat']);
  }
  hideDomainMails() {
    let domainMails = this.localSettings.users_settings.domain_emails.split(',');
    this.residentList.data.map(item => {
      let emailDomain = item.email.split("@").pop();
      const result = domainMails.includes(emailDomain);
      if (result == true) {
        item.email = '';
      }
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
