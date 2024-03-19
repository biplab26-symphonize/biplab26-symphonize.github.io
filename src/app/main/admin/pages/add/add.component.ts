import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Event, GuardsCheckStart, RoutesRecognized, NavigationStart } from "@angular/router";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';  //EXTRA Changes
import { Observable, Subject, of } from 'rxjs';
import { RolesService, OptionsList, PagebuilderService, CommonService } from 'app/_services';
import { MediaComponent } from 'app/layout/components/page-editor/media/media.component';
import { CommonUtils } from 'app/_helpers';
import { Page } from 'app/_models/page.model';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  previewDialogRef: MatDialogRef<PreviewComponent>; //EXTRA Changes  
  mediaDialogref: MatDialogRef<MediaComponent>;
  public green_bg_header: any;
  public button: any;
  public accent: any;
  pageForm: FormGroup;
  RoleList: any = [];
  StatusList: any;
  editEntry: any = false;
  savingEntry: any = false;
  pageInfo: any = {};
  pagecontent: any;
  layoutList: any;
  bgrepeatList: any;
  widgetsList: any;
  alignList: any;
  showRoleSelect: boolean = false;
  changesSaved: boolean = false;
  userId: any;
  editPageId: number;
  // Private
  private _unsubscribeAll: Subject<any>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  

  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _rolesService: RolesService,
    private _pageBuilder: PagebuilderService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private el: ElementRef,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.userId = JSON.parse(localStorage.getItem('token')).user_id;
    //Edit PageEntry
    if (this.route.routeConfig.path == 'admin/pages/edit/:id' && this.route.params['value'].id > 0) {
      this.editPageId = this.route.params['value'].id;
      this.editEntry = true;
    }
  }

  ngOnInit() {
    this.RoleList = this._rolesService.roles.data;
    this.StatusList = OptionsList.Options.tables.status.users;
    this.layoutList = OptionsList.Options.pagebuilder.layouts;
    this.bgrepeatList = OptionsList.Options.pagebuilder.bgrepeats;
    this.widgetsList = OptionsList.Options.pagebuilder.widgets;
    this.alignList = OptionsList.Options.pagebuilder.textalign;
    // Reactive Form
    this.pageForm = this._formBuilder.group({
      id: [null],
      title: ['', Validators.required],
      publicaccess: ['Y', Validators.required],
      access: [[]],
      status: ['A', Validators.required],
      created_by: [this.userId, Validators.required],
      updated_by: [this.userId, Validators.required],
      pagecontent: [''],
      pagesettings: this._formBuilder.group({
        featureimage: [''],
        contentpadding: [''],
        fullwidthpadding: [''],
        disablefeatureimg: ['Y'],
        pagelayout: ['wide'],
        bgcolor: [''],
        bgimage: [''],
        contentbgcolor: [''],
        contentbgimage: ['']
      }),
      headersettings: this._formBuilder.group({
        displayheader: ['N'],
        fullwidth: ['Y'],
        bgcolor: [''],
        bgimage: [''],
        fullbgimage: ['Y'],
        bgrepeat: ['no-repeat']
      }),
      titlebarsettings: this._formBuilder.group({
        showtitlebar: ['N'],
        widget: ['none'],
        showtext: ['Y'],
        text: [''],
        textalign: ['center'],
        textsize: [''],
        lineheight: [''],
        subtext: [''],
        subtextsize: [''],
        sublineheight: [''],
        textcolor: [''],
        subtextcolor: [''],
        textfullwidth: ['Y'],
        subtextfullwidth: ['Y'],
        titlebarheight: [''],
        titlebarbgcolor: [''],
        titlebarbordercolor: [''],
        titlebarbgimg: ['']
      })

    });

    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/pages/edit/:id') {
      this.fillFormValues();
    }

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
  fillFormValues() {
    if (this.editPageId > 0) {
      this._pageBuilder.getPageInfo({ id: this.editPageId, edit: this.editEntry }).subscribe(pageInfo => {
        var pageData = new Page().deserialize(pageInfo.pageinfo, 'single');
        this.pageInfo = pageData;
        this.pagecontent = pageData.pagecontent; //Json Elements Data
        this.pageForm.patchValue(this.pageInfo);
        this.pageForm.get('pagesettings').patchValue(this.pageInfo.settings.pagesettings);
        this.pageForm.get('headersettings').patchValue(this.pageInfo.settings.headersettings);
        this.pageForm.get('titlebarsettings').patchValue(this.pageInfo.settings.titlebarsettings);
        if (this.pageInfo.publicaccess == 'N') {
          this.showRoleSelect = true;
        }
      });
    }
  }
  validateNumber(event: any) {
    event = (event) ? event : window.event;
    let charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      event.preventDefault();
    } else {
      return true;
    }
  }
  //Enable role selection if public access == Y
  showRoleSelection($event: any) {
    if ($event.value == 'N') {
      this.showRoleSelect = true;
      this.pageForm.get('access').setValidators([Validators.required]);
      this.pageForm.get('access').updateValueAndValidity();
    }
    else {
      this.showRoleSelect = false;
      this.pageForm.get('access').reset();
      this.pageForm.get('access').setValidators(null);
      this.pageForm.get('access').updateValueAndValidity();
    }
  }
  /** OPEN CROPPPER DIALOG HERE */
  OpenMediaDialog(mediaInfo: any) {
    this.mediaDialogref = this._matDialog.open(MediaComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data: mediaInfo
    });
    this.mediaDialogref.afterClosed()
      .subscribe(result => {
        if (result) {
          this.setMediaFieldValues(result);
        }
        this.mediaDialogref = null;
      });
  }

  //Set Media Field Value After Popup Closed
  setMediaFieldValues(fieldInfo: any) {
    let groupName = this.pageForm.get(fieldInfo.group) as FormGroup;
    groupName.get(fieldInfo.type).setValue(fieldInfo.url);
  }
  ResetField(fieldInfo: any) {
    let groupName = this.pageForm.get(fieldInfo.group) as FormGroup;
    groupName.get(fieldInfo.type).reset();
  }

  //GET PAGE CONTAINER JSON INFO AND SAVE TO pagecontent field
  setPageContent($event: any = null) {
    if ($event !== null) {
      let Pagecontent = JSON.stringify($event);
      setTimeout(() => {
        this.pageForm.get('pagecontent').setValue(Pagecontent);
      }, 0);
    }
  }
  //Save Page Info
  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.pageForm.valid) {
      this.savingEntry = true;
      let PreparedFormData = this.prepareRequestJson(this.pageForm.value);
      this._pageBuilder.savePage(PreparedFormData, this.editEntry).subscribe(pageresponse => {
        // Show the success message
        this.showSnackBar(pageresponse.message, 'OK', 2000);
        this.router.navigate(['/admin/pages/list']);
      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'RETRY', 2000);
        });
    }
    else {
      CommonUtils.validateAllFormFields(this.pageForm);
      CommonUtils.scrollToFirstInvalidControl(this.el);
    }
  }
  //DESIGN FORM DATA STRUCTURE AS PER REQUIRED FOR API
  prepareRequestJson(formData: any) {
    let formJsonRequest = { ...formData };
    if (formJsonRequest.access && formJsonRequest.access.length > 0) {
      formJsonRequest.access = formJsonRequest.access.join(',');
    }
    else {
      formJsonRequest.access = '';
    }
    formJsonRequest.settings = JSON.stringify({ pagesettings: formData.pagesettings, headersettings: formData.headersettings, titlebarsettings: formData.titlebarsettings });
    delete formJsonRequest.pagesettings;
    delete formJsonRequest.headersettings;
    delete formJsonRequest.titlebarsettings;
    return formJsonRequest;
  }

  /**PREVIEW PAGE */
  previewPage() {
    const pageContent = this.prepareRequestJson(this.pageForm.value);
    this.previewDialogRef = this._matDialog.open(PreviewComponent, {
      data: pageContent,
      disableClose: false
    });
  }
  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string, duration: number = 2000) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: duration
    });
  }
  canDeactivate() {

    alert('I am navigating away');
    let user = "x";
    if (user == "x") {
      return window.confirm('Discard changes?');
    }
    return true;
  }
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.userId;
      this.confirmDialogRef.componentInstance.itemId = this.editPageId;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'page';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
}
