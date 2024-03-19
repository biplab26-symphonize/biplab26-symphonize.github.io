import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CommonService, FormsService } from 'app/_services';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: fuseAnimations
})
export class NotificationsComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public title: string = '';
  public removeButton: boolean = true;
  public trash: boolean = false;
  filterForm: FormGroup;
  PaginationOpt: any = {};
  Columns: [];
  displayedColumns: string[];
  public filterParams: any = {};
  selection = new SelectionModel<any>(true, []);
  public parent: any;
  public generalSettings: any = {};
  public homeSettings: any = {};
  public url_id: any;
  public notificationsetting: any;
  showNotification: boolean;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  private _unsubscribeAll: Subject<any>;
  changeDetector: any;


  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _formsService: FormsService,
    public router: Router) {
    this.title = "All Notifications";
    this._unsubscribeAll = new Subject();
    this.route.params.subscribe(params => {
      this.url_id = params.id;

    });


    this._formsService.getFormContent(this.url_id).subscribe(res => {
      this.notificationsetting = res.forminfo.formnotification;
      this.url_id = res.forminfo.form_id;

      for (let index in res.forminfo.formnotification) {
        this.showNotification = res.forminfo.formnotification[index].isactive == "Y" ? true : false;

      }

    })

  }



  ngOnInit() {

    this.PaginationOpt = OptionsList.Options.tables.pagination.options;
    this.Columns = OptionsList.Options.tables.list.notifications;
    this.displayedColumns = OptionsList.Options.tables.list.notifications.map(col => col.columnDef);
    this.homeSettings = this._commonService.getLocalSettingsJson('home_settings');
    this.generalSettings = this._commonService.getLocalSettingsJson('general_settings');

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });
  }



  deletenotification(value) {
    let formdata: any = {
      'id': [value]
    }
    this._formsService.deleteNotification(formdata).subscribe(Response => {
      this.showSnackBar(Response.message, 'CLOSE');
      this._formsService.getFormContent(this.url_id).subscribe(res => {
        this.notificationsetting = res.forminfo.formnotification;
      })
    },

      error => {
        // Show the error message
        this.showSnackBar(error.message, 'Retry');
      });

  }

  duplicateNotification(id) {
    this._formsService.duplicateNotificationsetting({ 'id': id }).subscribe(Response => {
      this.showSnackBar(Response.message, 'CLOSE');
      this._formsService.getFormContent(this.url_id).subscribe(res => {
        this.notificationsetting = res.forminfo.formnotification;
      })
    },
      error => {
        // Show the error message
        this.showSnackBar(error.message, 'Retry');
      });

  }

  changeStatus(value, id) {
    this._formsService.UpdateNotificationstatus({ 'id': id, 'isactive': value }).subscribe(Response => {

      this.showSnackBar(Response.message, 'CLOSE');
      this._formsService.getFormContent(this.url_id).subscribe(res => {
        this.notificationsetting = res.forminfo.formnotification;
      })
    },
      error => {
        // Show the error message
        this.showSnackBar(error.message, 'Retry');
      });

  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}


