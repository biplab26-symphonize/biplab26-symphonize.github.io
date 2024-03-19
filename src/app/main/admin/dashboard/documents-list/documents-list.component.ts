import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { OptionsList, AnnouncementService, CommonService } from 'app/_services';
import { FormGroup } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DashboardService } from 'app/_services/dashboard.service';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
  animations: fuseAnimations
})
export class DocumentsListComponent implements OnInit {
  @Input() homesettings: any;
  public green_bg_header: any;
  public button: any;
  public accent: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  public ForumSettings: any;
  public filterForm: FormGroup;
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public documentsList: any = [];
  public filterParams: any = {};

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  PaginationOpt: { 'pageSize': '', pageSizeOptions: [], page: 1 }; //pagination size,page options  

  constructor(
    private _dashboardservice: DashboardService,
    private _commonService: CommonService,
    private router: Router) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    let pageLimit: any = [];
    pageLimit[0] = 5;
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    //Pagination options
    this.PaginationOpt = { ...OptionsList.Options.tables.pagination.options };
    this.ForumSettings = OptionsList.Options.forumsettings;
    //Set Default pagination limit from settings
    setTimeout(() => {
      this.PaginationOpt.pageSize = pageLimit || this.PaginationOpt.pageSize;


      this.getDocumentList(null);
      //get topicslist by filters and paigantion
      merge(this.paginator.page)
        .pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(res => {
          this.getDocumentList(res);
        });

    }, 1000);

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color || '#afbb2a', 'color': themeData.table_font_color || '#f9fafa'};
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });
  }
  //get Topiclist
  getDocumentList(res) {
    //get Topiclist from Api
    this.filterParams['page'] = res == null ? 1 : res.pageIndex + 1;
    this.filterParams['limit'] = res == null ? 5 : res.pageSize;

    this._dashboardservice.getDocumentList(this.filterParams).subscribe(response => {
      this.documentsList = response;
    })
  }
  //Reset PageIndex On Form Changes
  resetPageIndex() {
    this.paginator.pageIndex = 0;
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
