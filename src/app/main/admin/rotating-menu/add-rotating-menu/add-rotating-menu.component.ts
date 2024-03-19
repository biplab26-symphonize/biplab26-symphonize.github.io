import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MenusService, OptionsList, RotatingMenuService, SettingsService, AppConfig, CommonService } from "app/_services";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import moment from "moment";
import { UploadfileComponent } from "./uploadfile/uploadfile.component";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ExportComponent } from 'app/layout/components/export/export.component';

@Component({
  selector: "app-add-routating-menu",
  templateUrl: "./add-rotating-menu.component.html",
  styleUrls: ["./add-rotating-menu.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class AddRotatingMenuComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  exportDialogref: MatDialogRef<ExportComponent>; //EXTRA Changes  
  public green_bg_header: any;
  public button: any;
  public accent: any;
  public url_id: any;
  public length: number = 0;
  _appConfig: any = AppConfig.Settings;
  public MenuName: any;
  public currentMenuUrl: any;
  public currentWeekno: any;
  public currentweekid: any;
  public editFormData: boolean = false;
  public currentlyselcetd: any = [];
  public currentlyselcetddaily: any = [];
  public Currentweek = "";
  public currentday = "";
  public Currentweekweekly = "";
  public currentdayweekly = "";
  public CurrentArraylength: any;

  public currentlyWeekArray: any[] = [];
  public currentlyDayArray: any[] = [];

  public title: string = "";
  displaymenutype: any;
  displaytheweek: any = [];
  fileUploaderSettings: any = {};
  public newrotatingmenu: FormGroup;

  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  uploadInfo: any = {
    avatar: {
      type: "defaultprofile",
      media_id: 0,
      url: "",
      apimediaUrl: "media/upload",
    },
  };

  constructor(
    private _commonService: CommonService,
    private fb: FormBuilder,
    private _menuservice: MenusService,
    private rotatingservices: RotatingMenuService,
    private _fileSettings: SettingsService,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
    private route: ActivatedRoute,
    public _matDialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.url_id = params.id;
    });
  }

  ngOnInit() {


    // get the saetting of rotating menu
    this._fileSettings.getSetting({ 'meta_key': 'rotating_menu_settings' }).then(filesettings => {
      if (filesettings.status == 200) {
        const UploaderSettings = JSON.parse(filesettings.settingsinfo.meta_value) || [];
        this.fileUploaderSettings = UploaderSettings.length > 0 ? UploaderSettings[0] : {};

      }

    })

    //  tite name 
    this.title = "Rotating Menu";

    //  access the menu data
    this._menuservice.getMenu({ menu_id: this.url_id }).subscribe((res) => {
      this.MenuName = res.menuinfo.menu_title;
      this.currentMenuUrl = res.menuinfo.menu_url;
    });

    this.newrotatingmenu = this.fb.group(
      {
        nav_menu_id: this.fb.control(this.url_id),
        start_day: this.fb.control(""),
        rotation: this.fb.control(""),
        start_date: this.fb.control(""),
        menu_type: this.fb.control(""),
      });

    this.getRotatingMenus(this.url_id);

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    
  }


  // uplaod the menu typ daily file 

  uploaddailyfile(week, id, menuname) {

    let dialogRef = this._matDialog.open(UploadfileComponent, {
      width: "1000px",
      data: { week: week, urlid: this.url_id, index: id, menuname: menuname },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRotatingMenus(this.url_id);
    });
  }

  // save the data or pdf selected 
  getRotatingMenus(url_id: string = '') {
    this.rotatingservices
      .viewRotatingmenu({ id: url_id })
      .subscribe((res) => {

        if (res.rotatingmenuinfo.menu_type !== undefined && res.rotatingmenuinfo.menu_type == "daily") {
          this.currentlyselcetddaily = res.rotatingmenuinfo.rotatingmenupdf;

        } else {
          this.currentlyselcetd = res.rotatingmenuinfo.rotatingmenupdf;
        }

        this.currentweekid = res.rotatingmenuinfo.id;
        this.currentWeekno = res.rotatingmenuinfo.curr_week_no;
        this.newrotatingmenu.patchValue(res.rotatingmenuinfo);
        this.newrotatingmenu.get('start_date').setValue(new Date(res.rotatingmenuinfo.start_date));
        this.displaytheweek = [];
        this.displaymenutype = res.rotatingmenuinfo.menu_type;
        let displayweek = res.rotatingmenuinfo.rotation;

        for (let i = 1; i <= displayweek; i++) {
          if (res.rotatingmenuinfo.menu_type == "daily") {
            this.displaytheweek.push(i);

            let weeklyPdfs = this.currentlyselcetddaily.filter(
              (item) => {
                return item.week_no == i;
              }
            );
            this.currentlyWeekArray[i] = weeklyPdfs.map((pdfitem) => {
              return pdfitem.week_day;
            });
            this.currentlyWeekArray[i] = weeklyPdfs.map((pdfitem) => {
              return pdfitem.week_day;
            });

          } else {
            this.displaytheweek.push(i);
            let weeklyPdfs = this.currentlyselcetd.filter(
              (item) => {
                return item.week_no == i;
              }
            );
            this.currentlyWeekArray[i] = weeklyPdfs.map((pdfitem) => {
              return pdfitem.week_no;
            });
          }

        }


      });
  }


  // view the current Pdf  
  viewcurrentmenupdf(pdfurl) {
    window.open(pdfurl);
  }

  // upload the weekly file
  uploadweeklyfile(week, menuname) {
    let dialogRef = this._matDialog.open(UploadfileComponent, {
      width: "1000px",
      data: { week: week, urlid: this.url_id, menuname: menuname },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.Currentweekweekly = result.week_no;
      this.uploadInfo.avatar.url = result.rotation_pdf
        ? AppConfig.Settings.url.mediaUrl + result.rotation_pdf
        : "";
      this.Currentweek = result.week_no;
      this.getRotatingMenus(this.url_id);
    });
  }

  // replace the weekly file

  uploadweeklyreplacefile(week, menuname) {
    let pdfurl;
    let id;
    for (let i = 0; i < this.currentlyselcetd.length; i++) {
      if (this.currentlyselcetd[i].week_no == week) {
        pdfurl = this.currentlyselcetd[i].pdf_title;
        id = this.currentlyselcetd[i].id;
      }
    }


    let dialogRef = this._matDialog.open(UploadfileComponent, {
      width: "1000px",
      data: { week: week, id: id, currentpdfurl: pdfurl, urlid: this.url_id, menuname: menuname },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRotatingMenus(this.url_id);
    });

  }

  // replace the daily files
  replacdailyfile(week, idx, menuname) {
    let pdfurl;
    let id;
    for (let i = 0; i < this.currentlyselcetddaily.length; i++) {
      if (this.currentlyselcetddaily[i].week_no == week && this.currentlyselcetddaily[i].week_day == idx) {
        pdfurl = this.currentlyselcetddaily[i].pdf_title;
        id = this.currentlyselcetddaily[i].id;
      }
    }

    let dialogRef = this._matDialog.open(UploadfileComponent, {
      width: "1000px",
      data: { week: week, id: id, urlid: this.url_id, index: idx, currentpdfurl: pdfurl, menuname: menuname },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRotatingMenus(this.url_id);
    });

  }

  //  view the Pdf Defoult or current pdf
  viewdailyPdf(week, id) {
    for (let i = 0; i < this.currentlyselcetddaily.length; i++) {
      if (this.currentlyselcetddaily[i].week_no == week && this.currentlyselcetddaily[i].week_day == id) {
        window.open(this._appConfig.url.mediaUrl + 'api' + '/' + 'download' + '/' + 'rotatingmenupdf' + '/' + this.currentlyselcetddaily[i].id + '/' + this.currentlyselcetddaily[i].pdf_title)
      }
    }

  }

  // view the uploaded pdf weekly

  viewWeekPdf(week) {
    for (let i = 0; i < this.currentlyselcetd.length; i++) {
      if (this.currentlyselcetd[i].week_no == week) {
        window.open(this._appConfig.url.mediaUrl + 'api' + '/' + 'download' + '/' + 'rotatingmenupdf' + '/' + this.currentlyselcetd[i].id + '/' + this.currentlyselcetd[i].pdf_title)
      }
    }
  }

  // view the default pdf 
  viewdefaultpdf() {

    window.open(this._appConfig.url.mediaUrl + 'api' + '/' + 'download' + '/' + 'rotatingmenupdf' + '/' + 0 + '/' + 'defaultpdf');

  }


  //  delete the pdf uploded daily 
  DeleteRotatingpdfdaily(week, id) {

    for (let i = 0; i < this.currentlyselcetddaily.length; i++) {
      if (this.currentlyselcetddaily[i].week_no == week && this.currentlyselcetddaily[i].week_day == id) {
        this.Deletepdf(this.currentlyselcetddaily[i].id);

      }
    }

  }


  //  delete the pdf uploded weekly

  DeleteRotatingpdfweekly(week) {
    for (let i = 0; i < this.currentlyselcetd.length; i++) {
      if (this.currentlyselcetd[i].week_no == week) {
        this.Deletepdf(this.currentlyselcetd[i].id);
      }
    }

  }


  Deletepdf(id) {

    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected pdf ?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.rotatingservices.Deletethepdf({ id: id }).subscribe(
            (Response) => {
              this.showSnackBar(Response.message, "CLOSE");
              this.rotatingservices
                .viewRotatingmenu({ id: this.url_id })
                .subscribe((res) => {
                  this.getRotatingMenus(this.url_id);
                });
            },
            (error) => {
              // Show the error message
              this.showSnackBar(error.message, "Retry");
            }
          );
        }
      });
  }


  // save the data 
  saverotatingmenu() {
    if (this.newrotatingmenu.valid) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      if (this.currentlyselcetddaily.length > 0) {
        this.confirmDialogRef.componentInstance.confirmMessage = ' Are you sure you want to delete previous data ?';
      } else {
        if (this.currentlyselcetd.length > 0) {
          this.confirmDialogRef.componentInstance.confirmMessage = ' Are you sure you want to delete previous data ?';
        } else {
          this.confirmDialogRef.componentInstance.confirmMessage = ' Are you sure you want to save the data ?';
        }
      }

      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            let newformData = this.newrotatingmenu.value;
            let currentdata = {
              nav_menu_id: newformData.nav_menu_id,
              start_day: newformData.start_day,
              rotation: newformData.rotation,
              start_date: moment(newformData.start_date).format("YYYY-MMM-DD"),
              menu_type: newformData.menu_type,
            };
            this.displaytheweek = [];
            this.rotatingservices.saverotatingmenuData(currentdata).subscribe(
              (response) => {
                this.showSnackBar(response.message, "CLOSE");

                this.displaymenutype = newformData.menu_type;
                let displayweek = newformData.rotation;
                for (let i = 1; i <= displayweek; i++) {
                  this.displaytheweek.push(i);
                }
                this.rotatingservices
                  .viewRotatingmenu({ id: this.url_id })
                  .subscribe((res) => {
                    if (res.rotatingmenuinfo.menu_type == "daily") {
                      this.currentlyselcetddaily =
                        res.rotatingmenuinfo.rotatingmenupdf;
                    } else {
                      this.currentlyselcetd =
                        res.rotatingmenuinfo.rotatingmenupdf;
                    }
                    this.getRotatingMenus(this.url_id);
                  });

                let data = this.rotatingservices.rotatingmenu.data;

                this._menuservice.getMenu({ menu_id: this.url_id }).subscribe((res) => {

                  this.MenuName = res.menuinfo.menu_title;
                  this.currentMenuUrl = res.menuinfo.menu_url;
                });

              },

              (error) => {
                // Show the error message
                this.showSnackBar(error.message, "Retry");
              });
          }


          this.confirmDialogRef = null;
        });
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: "top",
      duration: 2000,
    });
  }
}
