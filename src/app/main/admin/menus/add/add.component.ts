import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SlugifyPipe } from '@fuse/pipes/slugify.pipe';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, RolesService, FormsService, CategoryService, MenusService, AuthService, AppConfig, PagebuilderService, CommonService } from 'app/_services';
import { Menus } from 'app/_models';
//UI Icons List
import { IconsComponent } from 'app/layout/components/icons/icons.component';
import { AllroutesService } from 'app/_services/allroutes.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  userInfo: any;
  iconsDialogref: MatDialogRef<IconsComponent>; //EXTRA Changes  
  isSubmit: boolean = false;
  editMenuForm: boolean = false;
  menuform: FormGroup;
  ShowMenusList: any = [];
  FilteredMenus: any = [];
  RoleList: any = {};
  StatusList: any;
  mediaUrl: string;
  PositionList: any = {};
  showtypeList: any = {};
  showtypeListformain: any = {};
  MenuTypeList: any = {};
  MenuSourceList: any = [];
  MenuSourceTypes: any;
  DynamicSourceTypes: any = [];
  dynamicSelectText: string = 'Select Department';
  MenuTargetList: any = {};
  formFilters: any = {};
  dynamic_source_label: string = 'Menu source type';
  formRouteUrl: string = "";
  pageRouteUrl: string = "";
  staffRouteUrl: string = "";
  quickLinkRouteUrl: string = "";
  archiveRouteUrl: string = "";
  residentRouteUrl: string = "";
  rotatingmenu: string = "";
  
  Eventcalendar: string = "";
  allCalendarUrl: string ="";
  
  allEventsUrl: string ="";
  calEventsUrl: string ="";
  
  myEventsUrl: string ="";
  mycalEventsUrl: string ="";

  allRoutes: any = [];
  calendarArray: any[] = ['ECL','MYE','ERG'];
  uploadInfo: any = { 'type': 'pageimage', 'media_id': 0, 'formControlName': 'media_id', 'url': "", 'apimediaUrl': 'media/upload' };
  //Forums Links
  allForumsUrl: string = '';
  singleForum: string = '';
  selectall: boolean;
  @ViewChild('allSelected', { static: true }) private allSelected: MatOption;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private slugifyPipe: SlugifyPipe,
    private _authService: AuthService,
    private _formsService: FormsService,
    private _categoryService: CategoryService,
    private _rolesService: RolesService,
    private _menusService: MenusService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _routeservice: AllroutesService,
    private _pagebuilderService: PagebuilderService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    if (this.route.routeConfig.path == 'admin/menus/edit/:id' && this.route.params['value'].id > 0) {
      this.editMenuForm = true;
    }

  }

  ngOnInit() {

    //Get logged in userInfo
    this.userInfo = this._authService.currentUserValue.token ? this._authService.currentUserValue.token.user : {};
    this.mediaUrl = AppConfig.Settings.url.mediaUrl;

    //Roles List
    this.ShowMenusList = this.route.snapshot.data.menusList.data || [];
    this.FilteredMenus = this.route.snapshot.data.menusList.data || [];
    this.RoleList = this._rolesService.roles.data;
    this.StatusList = OptionsList.Options.menus.status;
    this.PositionList = OptionsList.Options.menus.positions;
    this.showtypeList = OptionsList.Options.menus.showtypes;
    this.showtypeListformain = OptionsList.Options.menus.mainshowtypes;
    this.MenuTargetList = OptionsList.Options.menus.targets;
    this.MenuTypeList = OptionsList.Options.menus.menutypes;
    this.MenuSourceList = OptionsList.Options.menus.menusources;
    this.MenuSourceTypes = OptionsList.Options.menus.menusourcestypes;
    this.formRouteUrl = OptionsList.Options.menus.frontend_formurl;
    this.pageRouteUrl = OptionsList.Options.menus.frontend_pageurl;
    this.staffRouteUrl = OptionsList.Options.menus.frontend_staffurl;
    this.archiveRouteUrl = OptionsList.Options.menus.frontend_archiveurl;
    // this.urlRouteUrl   = OptionsList.Options.menus.frontend_Urlurl;
    this.quickLinkRouteUrl = OptionsList.Options.menus.frontend_quickLinkurl;
    this.residentRouteUrl = OptionsList.Options.menus.frontend_residenturl;
    // this.rotatingmenu  = OptionsList.Options.menus.frontend_rotatingmenu;
    //Forums Urls
    this.allForumsUrl = OptionsList.Options.menus.frontend_allforums;
    this.singleForum = OptionsList.Options.menus.frontend_singleforum;

    this.allCalendarUrl = OptionsList.Options.menus.frontend_allcalendar;
    this.Eventcalendar = OptionsList.Options.menus.frontend_calendar;
    //event registration
    this.allEventsUrl = OptionsList.Options.menus.frontend_allevents;
    this.calEventsUrl = OptionsList.Options.menus.frontend_calevents;
    //my events page
    this.myEventsUrl = OptionsList.Options.menus.frontend_myevents;
    this.mycalEventsUrl = OptionsList.Options.menus.frontend_mycalevents;

    this.allRoutes = this._routeservice.routesList;
    //Form Group
    this.setFormControls();
    // this.desableCollapse();

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }
  /** define form group controls */
  setFormControls() {

    //Declare For fields
    this.menuform = this._formBuilder.group({
      menu_id: [null],
      position: ['', [Validators.required]],
      menu_title: ['', [Validators.required]],
      page_title: [''],
      show_page_title: [''],
      menu_alias: ['', [Validators.required]],
      // menu_url          : ['',[Validators.required]],
      menu_url: [''],
      menu_target: ['_self', [Validators.required]],
      menu_class: ['',],
      menu_icon: [''],
      media_id: [''],
      menu_desc: [''],
      menu_type: ['M', [Validators.required]],
      menu_source: ['N', [Validators.required]],
      menu_source_type: [''],
      menu_show_type: [''],
      menu_parent_id: [''],
      menu_role: [[], [Validators.required]],
      menu_status: ['A', [Validators.required]],
      quicklink: ['Y', [Validators.required]],
    });


    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/menus/edit/:id') {
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {

    var menuData = new Menus().deserialize(this.route.snapshot.data.menu.menuinfo, 'single');
    this.menuform.patchValue(menuData);


    // new add for quicklink update 
    if (menuData.menu_source === "Q") {
      this.menuform.controls.menu_source_type.setValue(menuData.menu_source_type);
      this._routeservice.getRoutes();
      this.DynamicSourceTypes = this._routeservice.routesList;
    }
    this.getFormsList()
    //send file urls and mediaId to file-upload component
    if (menuData.media !== null) {
      this.uploadInfo.media_id = menuData ? menuData.media.media_id : 0;
      //file urls
      this.uploadInfo.url = menuData.media ? this.mediaUrl + menuData.media.image : '';

    }
    let data = this.menuform.get('menu_role').value;
    if (data.length == this.RoleList.length) {
      this.selectall = true;
    }
  }
  /** SELECT MENU ICONS APPEAR WITH TITLE */
  selectMenuIcon() {
    this.iconsDialogref = this._matDialog.open(IconsComponent, {
      disableClose: false,
      data: { type: 'material' }
    });
    this.iconsDialogref.afterClosed()
      .subscribe(result => {
        if (result) {
          this.menuform.get('menu_icon').setValue(result);
        }
      });
  }
  /**Toggle ParentMenu and reset values to null if type = M*/
  toggleParentMenu() {
    if (this.menuform.get('menu_type').value == 'M') {
      this.menuform.get('menu_parent_id').setValue(0);
    }

  }

  selectalllang() {
    console.log('call', [this.selectall, this.menuform.controls.menu_role]);
    if (this.selectall === false) {
      this.menuform.controls.menu_role.patchValue([]);
      return;
    } else if (this.selectall === true) {

      this.menuform.controls.menu_role.patchValue([...this.RoleList.map(item => item.id)]);
    }
  }

  selecteddata() {
    let data = this.menuform.get('menu_role').value;
    if (data.length == this.RoleList.length) {
      this.selectall = true;
    } else {
      this.selectall = false;
    }
  }

  /**Create Slug of Role name To save in role_key */
  slugifyMenuAlias() {
    // this.menuform.get('page_title').setValue(this.menuform.get('menu_title').value || "");
    this.menuform.get('menu_alias').setValue(this.slugifyPipe.transform(this.menuform.get('menu_title').value) || "");
    this.setMenuURL();
  }
  /** SET MEDIA FIELD VALUE FROM EXTERNAL CPMNT */
  setMediaFieldValue($event: any) {
    if ($event.uploadResponse) {
      this.menuform.get($event.formControlName).setValue($event.uploadResponse.media.id || 0);
    }else{
      this.menuform.get($event.formControlName).setValue('');
    }
  }
  /** Get Forms List If Menu source is F  */
  getFormsList(onchange: boolean = false) {

    if (this.menuform.get('menu_source').value == 'F' || this.menuform.get('menu_source').value == 'S' || this.menuform.get('menu_source').value == 'RD' || this.menuform.get('menu_source').value == 'FRM' || this.menuform.get('menu_source').value == 'P' || this.calendarArray.includes(this.menuform.get('menu_source').value)) {
      this.DynamicSourceTypes = [];
      this.dynamic_source_label = 'Please wait...';
      if (this.menuform.get('menu_source').value == 'F') {
        this.formFilters = { column: 'form_title', direction: 'asc' }
        this._formsService.getForms(this.formFilters)
          .then(response => {
            this.dynamic_source_label = 'Select form';
            if (response.status == 200) {
              this.DynamicSourceTypes = response.data;
            }
            else {
              this.showSnackBar(response.message, 'Retry');
            }
          });
      }
      //Staff Categories
      if (this.menuform.get('menu_source').value == 'S' || this.menuform.get('menu_source').value == 'FRM' || this.calendarArray.includes(this.menuform.get('menu_source').value)) {
        let dynamicLabel = 'Select category';
        
        if (this.menuform.get('menu_source').value == 'S') {
          this.dynamicSelectText = 'All Departments';
          this.formFilters = { category_type: 'DEPT', dept: 'Y', 'status': 'A', column: 'category_name', direction: 'asc' };
        }
        else if (this.calendarArray.includes(this.menuform.get('menu_source').value)) {
          dynamicLabel = 'Select Calendar';
          this.dynamicSelectText = 'All Calendars';
          this.formFilters = { category_type: 'ECL', 'status': 'A', column: 'category_name', direction: 'asc' };
        }
        else {
          dynamicLabel = 'Select Forums'
          this.dynamicSelectText = 'All Forums'
          this.formFilters = { category_type: 'FC', 'status': 'A', column: 'category_name', direction: 'asc' }
        }

        this._categoryService.getCategorys(this.formFilters)
          .then(response => {
            if (response.status == 200) {
              this.dynamic_source_label = dynamicLabel;
              this.DynamicSourceTypes = response.data;
            }
            else {
              this.showSnackBar(response.message, 'Retry');
            }
          });
      }
      //Pages
      if (this.menuform.get('menu_source').value == 'P') {
        this.dynamic_source_label = 'Loading Pages...';
        this.formFilters = { column: 'title', status: 'A', direction: 'asc' }
        this._pagebuilderService.getPages(this.formFilters)
          .then(response => {
            this.dynamic_source_label = 'Select Page';
            if (response.status == 200) {
              this.DynamicSourceTypes = response.data;
            }
            else {
              this.showSnackBar(response.message, 'Retry');
            }
          });
      }

      //resident categorySSS
      if (this.menuform.get('menu_source').value == 'RD') {
        this.menuform.get('menu_url').setValue(this.residentRouteUrl);
      }

      // if(this.menuform.get('menu_source').value=='RDM'){
      //   this.menuform.get('menu_url').setValue(this.rotatingmenu);
      // }

    }
    //All Routes new code
    else if (this.menuform.get('menu_source').value == 'Q') {
      this._routeservice.getRoutes()
      this.dynamic_source_label = 'Select Routes';
      this.DynamicSourceTypes = this._routeservice.routesList;
    }
    else {
      if (onchange == true && this.menuform.get('menu_source').value == 'N') {
        this.menuform.get('menu_url').setValue('');
        this.menuform.get('menu_url').setValidators([Validators.required]);
      }
      this.dynamic_source_label = 'Menu source type';
    }
  }
  /** Set Menu Url If menu_source_type is Form/Staff */
  setMenuURL() {
    //FormAlias as URL
    if (this.menuform.get('menu_source').value == 'F') {
      const selectedForm = this.DynamicSourceTypes.find(item => { return item.form_id == this.menuform.get('menu_source_type').value });
      this.menuform.get('menu_url').setValue(this.formRouteUrl + selectedForm.form_alias);
    }
    //Staff Category
    if (this.menuform.get('menu_source').value == 'S') {
      if (this.menuform.get('menu_source_type').value == 'all') {
        this.menuform.get('menu_url').setValue(this.staffRouteUrl + this.menuform.get('menu_source_type').value);
      }
      else {
        const selectedCat = this.DynamicSourceTypes.find(item => { return item.id == this.menuform.get('menu_source_type').value });
        this.menuform.get('menu_url').setValue(this.staffRouteUrl + selectedCat.category_alias);
      }
    }
    //Forum Menu
    if (this.menuform.get('menu_source').value == 'FRM') {

      if (this.menuform.get('menu_source_type').value == 'all') {
        this.menuform.get('menu_url').setValue(this.allForumsUrl);
      }
      else {
        const selectedCat = this.DynamicSourceTypes.find(item => { return item.id == this.menuform.get('menu_source_type').value });
        this.menuform.get('menu_url').setValue(this.singleForum + selectedCat.category_alias);
      }
    }

    //  rotating menu
    if (this.menuform.get('menu_source').value == 'RDM') {
      this.menuform.get('menu_url').setValue('');
    }
    //Document Archive
    if (this.menuform.get('menu_source').value == 'D' && this.menuform.get('menu_source_type').value == 'page') {
      this.menuform.get('menu_url').setValue(this.archiveRouteUrl + this.menuform.get('menu_alias').value);
    }
    //Document URL
    if (this.menuform.get('menu_source').value == 'D' && this.menuform.get('menu_source_type').value == 'url') {
      if (this.menuform.get('menu_url').value && this.editMenuForm == true) {
        this.menuform.get('menu_url').setValue(this.menuform.get('menu_url').value);
      }
      else {
        this.menuform.get('menu_url').setValue('');
      }
    }
    //Quicklink URL
    if (this.menuform.get('menu_source').value == 'Q' && this.menuform.get('menu_source_type').value) {
      this.menuform.get('menu_url').setValue(this.quickLinkRouteUrl + this.menuform.get('menu_source_type').value);
    }
    if (this.menuform.get('menu_source').value == 'P') {
      const selectedPage = this.DynamicSourceTypes.find(item => { return item.id == this.menuform.get('menu_source_type').value });
      this.menuform.get('menu_url').setValue(this.pageRouteUrl + selectedPage.page_alias);
    }
    //Resident Category
    if (this.menuform.get('menu_source').value == 'RD') {
      this.menuform.get('menu_url').setValue(this.residentRouteUrl);
    }
    //event Calendar
    if (this.menuform.get('menu_source').value == 'ECL') {
      if (this.menuform.get('menu_source_type').value == 'all') {
        this.menuform.get('menu_url').setValue(this.allCalendarUrl);
      }
      else{
        const selectedCat = this.DynamicSourceTypes.find(item => { return item.id == this.menuform.get('menu_source_type').value });
        this.menuform.get('menu_url').setValue(this.Eventcalendar + selectedCat.category_alias);
      }
    }
    //event list
    if (this.menuform.get('menu_source').value == 'ERG') {
      if (this.menuform.get('menu_source_type').value == 'all') {
        this.menuform.get('menu_url').setValue(this.allEventsUrl);
      }
      else{
        const selectedCat = this.DynamicSourceTypes.find(item => { return item.id == this.menuform.get('menu_source_type').value });
        this.menuform.get('menu_url').setValue(this.calEventsUrl + selectedCat.category_alias);
      }
    }
    //myevents list
    if (this.menuform.get('menu_source').value == 'MYE') {
      if (this.menuform.get('menu_source_type').value == 'all') {
        this.menuform.get('menu_url').setValue(this.myEventsUrl);
      }
      else{
        const selectedCat = this.DynamicSourceTypes.find(item => { return item.id == this.menuform.get('menu_source_type').value });
        this.menuform.get('menu_url').setValue(this.mycalEventsUrl + selectedCat.category_alias);
      }
    }

  }
  // setAllDeptMenuUrl()
  // {
  //   if(this.menuform.get('menu_source').value=='S'){
  //      this.menuform.get('menu_url').setValue(this.staffRouteUrl+this.menuform.get('menu_source_type').value);
  //   }
  // }
  /**SAVE FORM DATA */
  onSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.menuform.valid) {
      this.isSubmit = true;
      //Save Menu Api
      let MenuData = this.menuform.value;
      MenuData['roles'] = this.menuform.get('menu_role').value.toString();
      MenuData['created_by'] = this.userInfo.id;

      console.log(" save menudata", MenuData);

      this._menusService.saveMenus(MenuData, this.editMenuForm)
        .subscribe(response => {
          if (response.status == 200) {
            this.showSnackBar(response.message, 'OK');
            this.isSubmit = false;
            this.router.navigate(['/admin/menus/list']);
          }
          else {
            this.showSnackBar(response.message, 'Retry');
            this.isSubmit = false;
          }
        })
    }
  }
  //Filter menus list by selected position
  filterSubmenus() {
    if (this.ShowMenusList.length > 0) {
      this.FilteredMenus = this.ShowMenusList.filter(menuitem => {
        return menuitem.position === this.menuform.get('position').value
      });
    }
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
  }

}
