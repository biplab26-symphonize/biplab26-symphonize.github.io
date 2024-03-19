import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig, AuthService, ChatService, CommonService, GuestRoomService, OptionsList } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
  public bookingCount: any;
  public latestBooking: any;
  public isBookingCount: boolean = false;
  public isLatestBooking: boolean = false;
  public days: any = [];
  public booking: any = [];
  public previousDates: any = [];
  public CustomFormats: any;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public nights: any;
  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        }
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  constructor(private _guestRoomService: GuestRoomService,private _commonService: CommonService,) {
    var currentDate = moment();
    var weekStart = currentDate.clone().startOf('week');
    var weekEnd = currentDate.clone().endOf('week');
    for (var i = 0; i <= 6; i++) {
      this.days.push(moment(weekStart).add(i, 'days').format("DD-MM"));
    }    

    let lastWeek = moment().isoWeek(moment().subtract(2, 'w').week());
    let mondayDifference = lastWeek.dayOfYear() - lastWeek.weekday() + 1;
    let sundayDifference = mondayDifference - 1;

    //let lastMonday = moment().dayOfYear(mondayDifference);
    let lastSunday = moment().dayOfYear(sundayDifference);        
    //var currentDate = moment();
    var previousWeekStart = lastSunday.clone().startOf('week');
    var previousWeekEnd = lastSunday.clone().endOf('week');
    for (var i = 0; i <= 6; i++) {
      this.previousDates.push(moment(previousWeekStart).add(i, 'days').format("DD-MM"));
    }    
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  ngOnInit(): void {
    this._guestRoomService.getBookingCount().subscribe(response => {      
      this.bookingCount = response;
      this.isBookingCount = true;
    });
    this._guestRoomService.getLatesBooking().subscribe(response => {
      this.latestBooking = response;

      this.latestBooking.latestbooking.data.map((element, index) => {
        let currentDate = new Date(element.date_to);
        let dateSent = new Date(element.date_from);
        this.nights = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
        element['nights'] = this.nights;
      });

      this.latestBooking.arrivalbookings.data.map((element, index) => {
        let currentDate = new Date(element.date_to);
        let dateSent = new Date(element.date_from);
        this.nights = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
        element['nights'] = this.nights;
      });

      this.latestBooking.departurebookings.data.map((element, index) => {
        let currentDate = new Date(element.date_to);
        let dateSent = new Date(element.date_from);
        this.nights = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
        element['nights'] = Number(this.nights) + 1;
      });
      this.isLatestBooking = true;      
    });
    this._guestRoomService.getBookingGraph().subscribe(response => {
      this.booking = response;
      this.lineChartData = [];
      let room_data: any = [];
      let room_count: any = [];
      response.pastbooking.map((element, index) => {
        room_data = [];
        room_count = [];        
        element.room_count.map((item, indexs) => {
          room_data[indexs] = { x: indexs + 1, y: item.count };
        });        
        this.lineChartData[index] = {
          label: element.room_name,
          data: room_data, 
          showLine: true,
          fill: false,
          borderColor: 'rgba(0, 200, 0, 1)'
        }
      });      
    });
    this.lineChartLabels = this.previousDates;
    this.CustomFormats = OptionsList.Options.customformats;
  }

  onSequenceChangeEvent(event) {    
    if (event.tab.textLabel == 'Past') {
      this.lineChartData = [];
      let room_data: any = [];
      let room_count: any = [];
      this.booking.pastbooking.map((element, index) => {
        room_data = [];
        room_count = [];        
        element.room_count.map((item, indexs) => {
          room_data[indexs] = { x: indexs + 1, y: item.count };
        });        
        this.lineChartData[index] = {
          label: element.room_name,
          data: room_data,
          showLine: true,
          fill: false,
          borderColor: 'rgba(0, 200, 0, 1)'
        }
      });
      this.lineChartLabels = this.previousDates;
      console.log("lineChartLabelspast",this.lineChartLabels);
    }
    if (event.tab.textLabel == 'Upcoming') {
      this.lineChartData = [];
      let room_data: any = [];
      let room_count: any = [];
      console.log("this.booking.upcomingbooking",this.booking.upcomingbooking);
      this.booking.upcomingbooking.map((element, index) => {
        room_data = [];
        room_count = [];        
        element.room_count.map((item, indexs) => {
          room_data[indexs] = { x: indexs + 1, y: item.count };
        });        
        this.lineChartData[index] = {
          label: element.room_name,
          data: room_data,
          showLine: true,
          fill: false,
          borderColor: 'rgba(0, 200, 0, 1)'
        }
      });
      this.lineChartLabels = this.days;
      console.log("lineChartLabelsup",this.lineChartLabels);
    }
  }

}
