import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { MatDialogRef ,MatPaginator, MatSort, MatDialog, MatSnackBar} from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CalendarGeneratorService, AppConfig } from 'app/_services';


@Component({
  selector: 'app-calendar-generator',
  templateUrl: './calendar-generator.component.html',
  styleUrls: ['./calendar-generator.component.scss'],
  animations: fuseAnimations
})


export class CalendarGeneratorComponent implements OnInit {
  public pname: any = '';
  public tempdata: any;
  public formatFormData: any;
  public showbutton: boolean = false;
  public customizationdata: any;
  public calendarCustomizationData: any;
  public template_name: any = '';
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };

  public confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes  
  public title: string = '';
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  public customdata: any;



  public childData; calendarFormatData; calendarDesignData; eventSelectionData;

  constructor(public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private _calendarGeneratorService: CalendarGeneratorService,
    private router: Router,
    private route: ActivatedRoute) {
    this.title = "Calendar Generator"
  }

  ngOnInit() {

  }


  public getFormatData($event) {    
    this.childData = $event;
    setTimeout(() => {    //<<<---    using ()=> syntax
      this.customizationdata = this.childData;
      this.tempdata = this.childData;
    }, 500);
    if (this.childData.template_name != "") {
      this.showbutton = true;
    } else {
      this.showbutton = false;
    }
  }

  public getcustomizationData($event) {
    this.customdata = $event;

  }

  public getCalendarFormatData($event) {

    this.calendarFormatData = { 'format': '{"papersize":"' + $event.papersize + '","fontfamily":"' + $event.font + '","font_sizing":"' + $event.font_sizing + '","special_event_font":"' + $event.special_event_font + '","holiday_font":"' + $event.holiday_font + '","registration_required_font":"' + $event.registration_required_font + '","location_font":"' + $event.location_font + '"}' };
  }

  public getCalendarCustomizationData($event) {
    this.calendarCustomizationData = $event;

  }

  public getCalendarDesignData($event) {
    console.log("getCalendarDesignData",$event);
    this.calendarDesignData = { background_img: $event.background_img, logo_img: $event.logo_img, no_background: $event.no_background, 'design': '{"color_selection":"' + $event.color_selection + '","color_scheme":"' + $event.color_scheme + '","border_color":"' + $event.border_color + '","highlight_color":"' + $event.highlight_color + '","text_color":"' + $event.text_color + '","footer":"' + $event.footer + '"}' };
  }

  public getEventSelectionData($event) {
    this.eventSelectionData = $event;    
  }


  OnSubmit() {
    let generateCalendarFlag = { print: 1 };
    //let value = {format:{"papersize":"A3-L","fontfamily":"Times New Roman,Georgia","font_sizing":"large_size","special_event_font":"font-style: italic;font-weight: bold;","holiday_font":"font-style: italic;font-weight: bold;","registration_required_font":"font-style: italic;font-weight: bold;","location_font":"F"}}
    //console.log("this.eventSelectionData",this.eventSelectionData);
    this.eventSelectionData.event_calendar_category  = this.eventSelectionData && this.eventSelectionData.event_calendar_category && Array.isArray(this.eventSelectionData.event_calendar_category) ? this.eventSelectionData.event_calendar_category.join() : !Array.isArray(this.eventSelectionData.event_calendar_category) && this.eventSelectionData.event_calendar_category!=='' ? this.eventSelectionData.event_calendar_category :  '';
    this.eventSelectionData.common_category = this.eventSelectionData && Array.isArray(this.eventSelectionData.common_category) ? this.eventSelectionData.common_category.join() : !Array.isArray(this.eventSelectionData.common_category) ? this.eventSelectionData.common_category : '';
    let value = Object.assign(generateCalendarFlag, this.childData, this.calendarFormatData, this.calendarDesignData, this.eventSelectionData, this.customdata);

    this._calendarGeneratorService.generateCalendar(value)
      .subscribe(
        data => {
          if (data.status == 200) {
            this.uploadInfo.avatar.url = (data.pdfinfo ? AppConfig.Settings.url.mediaUrl + data.pdfinfo : "");
            window.open(this.uploadInfo.avatar.url);
          } else {
            this.showSnackBar(data.message, 'CLOSE');
          }
        },
        error => {
          // Show the error message          
        });
  }

  OnSaveCalendar() {     
    //console.log("eventSelectionData",this.eventSelectionData);
    // this.eventSelectionData.event_calendar_category  = this.eventSelectionData.event_calendar_category.join();
    // this.eventSelectionData.common_category = this.eventSelectionData.common_category.join();
    this.eventSelectionData.event_calendar_category  = this.eventSelectionData && this.eventSelectionData.event_calendar_category && Array.isArray(this.eventSelectionData.event_calendar_category) ? this.eventSelectionData.event_calendar_category.join() : !Array.isArray(this.eventSelectionData.event_calendar_category) && this.eventSelectionData.event_calendar_category!=='' ? this.eventSelectionData.event_calendar_category :  '';
    this.eventSelectionData.common_category = this.eventSelectionData && Array.isArray(this.eventSelectionData.common_category) ? this.eventSelectionData.common_category.join() : !Array.isArray(this.eventSelectionData.common_category) ? this.eventSelectionData.common_category : '';
    
    let value = Object.assign(this.childData, this.calendarFormatData, this.calendarDesignData, this.eventSelectionData, this.customdata);
    this._calendarGeneratorService.generateCalendar(value)
      .subscribe(
        data => {
          if (data.status == 200) {
            this._matSnackBar.open(data.message, 'CLOSE', {
              verticalPosition: 'top',
              duration: 2000
            });
            this.router.navigate(['/admin/calendar-list']);

          } else {
            this.showSnackBar(data.message, 'CLOSE');
          }

        },
        error => {
          // Show the error message          
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

