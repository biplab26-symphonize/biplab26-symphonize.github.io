import { Component, OnInit, Inject } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { AppConfig, CategoryService, StaffService, CommonService } from 'app/_services';
import { merge, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StaffBiographyComponent } from 'app/layout/components/dialogs/staff-biography/staff-biography.component';
//import { MatDialogRef, MatDialog } from '@angular/material';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-staff-directory',
  templateUrl: './staff-directory.component.html',
  styleUrls: ['./staff-directory.component.scss'],
  animations: fuseAnimations
})
export class StaffDirectoryComponent implements OnInit {
  public staffSettings: any;
  public homeSettings: any = {};
  public ShowStaffs: boolean = false;
  public front:string='';
  biographyDialogref: MatDialogRef<StaffBiographyComponent>; //EXTRA Changes  
  _defaultAvatar: string;
  selectedTabIndex:number=0;
  public staffList: any = [];
  public staffData: any = [];
  public designationList: any = [];
  public slug: any = '';
  public FilteredstaffList: any = [];
  public mediaUrl: string;
  public filterParams: any={front:''};
  public displayType: any;
  public deptData: any = [];
  public staffFiletered: any = [];
  public departmentID: any;
  filterForm: FormGroup;
  public isHide: boolean = false;
  public filteredLength: any;
  public getDesignation: any;
  public title: string ='Staff Directory';
  // public staff_name_sorting;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private _staffService: StaffService,
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private _categoryService: CategoryService,
    private _appConfig: AppConfig,
    public _matDialog: MatDialog) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();

    // this.staff_name_sorting     = this._appConfig._localStorage.value.settings.staff_settings.staff_name_sorting || 'LN'; 
    /*** GET DESIGNATION LIST***/
    this._categoryService.getCategorys({ 'category_type': 'DESIGNATION', 'status': 'A', 'column':'category_name', 'direction':'asc' }).then(response => {
      this.designationList = response.data;
    });

    if (this.route.routeConfig.path == 'staffs/:slug') {
      this.slug = this.route.params['value'].slug;
    }
    if(this.route.routeConfig.path=='new-staffs'){
      this.front = '1';
      this.title = 'New staff Announcement';
      this.filterParams.front = this.front;
    }
  }

  ngOnInit() {

    this.staffSettings = this._commonService.getLocalSettingsJson('staff_settings');
    //Show Newest Staff Carousal 
    if(this.staffSettings && this.staffSettings.newest_staff == 'Y'){
      this.ShowStaffs = true;
    }
    let localSettings      = this._appConfig._localStorage.value.settings;
    if(localSettings.home_settings){
      this.homeSettings = CommonUtils.getStringToJson(localSettings.home_settings);
    }

    this.mediaUrl = AppConfig.Settings.url.mediaUrl;
    this._defaultAvatar = AppConfig.Settings.url.mediaUrl + this.staffSettings.defaultprofile || AppConfig.Settings.url.defaultAvatar;
    this.displayType = this.staffSettings.directoryview;

    this.filterForm = this._formBuilder.group({
      name: [''],
      email: [''],
      designation: [''],
      front:[this.front]
    });

    this.getStaffList({ 'print': 0, 'display': 'tabs', 'status': 'A', 'slug': this.slug, 'front':this.front });
    //get StaffList by filters and paigantion
    merge(this.filterForm.valueChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {

        this.filterParams = CommonUtils.getFilterJson('', '', this.filterForm.value);
        if ((res.name !== "" && res.name !== null) || (res.email !== "" && res.email !== null) || (res.designation !== "" && res.designation !== null)) {
          this.staffList = [];
          this.getFilteredStaffList(this.filterParams);
        }
        else if ((res.name == null) && (res.email == null) && (res.designation == null)) {
          this.FilteredstaffList = [];
          this.getStaffList({ 'print': 0, 'display': 'tabs', 'status': 'A', 'slug': this.slug, 'front': this.front });
        }
        else {
          this.FilteredstaffList = [];
          this.getStaffList({ 'print': 0, 'display': 'tabs', 'status': 'A', 'slug': this.slug, 'front': this.front });
        }
      });
  }
  getFilteredStaffList(res) {

    if (res) {

      res['front'] = this.front;
      res['print'] = 0;
      res['display'] = "tabs";
      res['status'] = 'A';
      res['slug'] = this.slug;

    }
    this._staffService.getStaffs(res).then(response => {
      this.FilteredstaffList = response.stafflist;
      if (this.displayType == 'list') {
        this.deptData = response.category;
      }
      if (this.FilteredstaffList.length == 0) {
        this.isHide = true;
      }
    })

  }

  openBiographyDialog(biographyInfo: any = '') {
    const dialogRef = this._matDialog.open(StaffBiographyComponent, {
      width: '400px',
      data: biographyInfo
    });
  }


  getImage(media) {

    let profileImg = this._defaultAvatar;
    let avatar = media.filter(function (item) {
      return (item.media && item.media.type === "avatar");
    });

    if (avatar.length) {
      profileImg = AppConfig.Settings.url.mediaUrl + avatar[0].media.thumb;
    }
    return profileImg;
  }

  //get getStaffList
  getStaffList(res) {
    this.isHide = false;
    this._staffService.getStaffs(res).then(response => {
      this.staffList = response.stafflist;
      if (this.displayType == 'list') {
        this.deptData = response.category;
      }
    })

  }

  changeTabs($event) {
    this.staffFiletered = [];
    let index = $event.index == 0 ? $event.index : $event.index > 1 ? $event.index : $event.index;
    this.selectedTabIndex = index;
    if (this.displayType == 'list') {

      if (index != 0) {
        this.departmentID = this.deptData[index - 1].id;
        for (var i = 0; i < this.staffList.length; i++) {
          let dept = this.staffList[i].subdepartment.split(',').map(Number);
          for (var j = 0; j < dept.length; j++) {
            if (dept[j] == this.departmentID) {
              this.staffFiletered.push(this.staffList[i]);
            }
          }
        }
        this.filteredLength = this.staffFiletered.length;
      } else {
        this.departmentID = '';
      }

    } else {


      if (index != 0) {
        this.departmentID = this.staffList[index - 1].department.id;
      } else {
        this.departmentID = '';
      }
    }

  }

  // GET PRINT OF staff DIRECTORY
  getPrint() {


    let name = this.filterForm.get('name').value;
    let email = this.filterForm.get('email').value;
    let designation = this.filterForm.get('designation').value;
    this.departmentID = this.departmentID != undefined ? this.departmentID : '';
    if (name != "" || email != "" || designation != "") {

      //let printPDFView = (this.staffSettings.directoryview) ? this.staffSettings.directoryview : 'tabs';
      let printPDFView = 'tabs';
      this._staffService.getStaffs({ 'front':this.front, 'print': '1', 'slug': this.slug, 'display': printPDFView, 'name': name, 'email': email, 'designation': designation, 'subdepartment': this.departmentID, 'status': 'A' }).then(response => {
        window.open(AppConfig.Settings.url.mediaUrl + response.pdfinfo);
      });
    }
    else {

      let printPDFView = 'tabs';
      this._staffService.getStaffs({ 'front':this.front, 'print': '1', 'slug': this.slug, 'display': printPDFView, 'subdepartment': this.departmentID, 'status': 'A' }).then(response => {
        window.open(AppConfig.Settings.url.mediaUrl + response.pdfinfo);
      });
    }
  }

  onDesignationChange(event) {

    // this.getDesignation = event.text;
    /*if (this.designationList && event.value) {
     let status = this.designationList.filter(s => s.id == event.value);
     if (status){
      this.getDesignation = status[0].category_name;
     }
     else{
       this.getDesignation = '';
     }
   }*/
  }


  // reset form value
  resetform() {
    this.filterForm.reset();
    this.selectedTabIndex=0;
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {  // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



}
