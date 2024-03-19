import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonService, GuestRoomService } from 'app/_services';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fuseAnimations } from '@fuse/animations';
import moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Guestroomcalendar } from './guestroomcalendar.model';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { GridEventComponent } from 'app/layout/components/events/grid-event/grid-event.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalEventComponent } from 'app/layout/components/events/modal-event/modal-event.component';
import { RoomCalenderMadalComponent } from '../room-calender-madal/room-calender-madal.component';

@Component({
  selector: 'app-guest-room-calendar',
  templateUrl: './guest-room-calendar.component.html',
  styleUrls: ['./guest-room-calendar.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GuestRoomCalendarComponent implements OnInit {

  options: CalendarOptions;
  public defaultDateTimeFormat: any = { date_format: 'YYYY-MM-DD', time_format: "h:mm a" };
  public displayView: string = '';
  public Startdate: string = '';
  public defaultView: string = 'dayGridWeek';
  public eventstype: string = 'all';
  events: any[] = [];
  public EventSettings: any = {};
  private calendarApi;
  public filterForm: FormGroup;
  startdate = new Date();
  public RegbackgroundColor: string = '#000';
  public RegborderColor: string = '#fff';
  allrooms: any = [];
  public rooms: any;
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  showCalendar: boolean = false;
  eventDetails: MatDialogRef<RoomCalenderMadalComponent>; //EXTRA Changes  
  constructor(
    private _commonService: CommonService,
    private _guestroom: GuestRoomService,
    private _formBuilder: FormBuilder,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected appRef: ApplicationRef,
    protected injector: Injector,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.filterForm = this._formBuilder.group({
      room_id: [''],
      jump_to: ['']

    })
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    // FullCalendar Settings
    this.options = {
      initialView: this.defaultView,
      initialEvents: this.events,
      editable: false,
      events: this.events,
      defaultAllDay: false,
      showNonCurrentDates: true,
      fixedWeekCount: false,
      displayEventTime: false,
      eventDisplay: 'block',
      eventTimeFormat: '',
      contentHeight: "auto",
      height: '100%',
      themeSystem: 'standard',
      //dayMaxEvents:5,
      noEventsContent: "",
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      
      eventDidMount: this.showEventToolTip.bind(this),
      eventClick: this.showEventDetails.bind(this),
      datesSet: this.handleDatesRender.bind(this)
    };
    this._guestroom.getRoomList({ 'status': 'A', 'direction': '' }).then(response => {
      this.rooms = response.data;      
    });
    let currentDate = new Date();
    this.filterForm.get('jump_to').setValue(currentDate);
    
  }
  getBookings() {
    let date = moment(this.filterForm.get('jump_to').value).format('YYYY-MM-DD');    
    let data = {
      'date': date,
      'room_id': this.filterForm.get('room_id').value,
      'print': ''
    }
    this.calendarApi = this.fullcalendar.getApi();
    this.calendarApi.gotoDate(date);
    this._guestroom.getAllCelendarEvent(data).then(res => {      
      this.allrooms = res.roominfo.data;
      console.log("response",res.bookinginfo.data);
      this.events = res.bookinginfo.data.map(item => {
        let regColors = { regBgColor: this.RegbackgroundColor, regBorderColor: this.RegborderColor };
        return new Guestroomcalendar(item, regColors);
      });      
      this.setEventsArray(this.events)
    })
  }
  print() {
    let params = [];
    let data = this.filterForm.value;
    let date_from = moment(data.jump_to).format('YYYY-MM-DD');
    this.calendarApi = this.fullcalendar.getApi();
    this.Startdate = moment(this.calendarApi.view.currentStart).format('YYYY-MM-DD');    
    let print = 1;
    params.push(
      {
        'print': '1'
      },
      {
        'date': this.Startdate
      },
      {
        'room_id': data.room_id
      }
    );    
    this._guestroom.getCalenderPrint('guestroom/actions/bookingcalendar', params)
  }
  handleDatesRender($event) {    
    this.calendarApi = this.fullcalendar.getApi();
    this.Startdate = moment(this.calendarApi.view.currentStart).format('YYYY-MM-DD');    
    let data = {
      'date': this.Startdate,
      'room_id': this.filterForm.get('room_id').value,
      'print': ''
    }

    this._guestroom.getAllCelendarEvent(data).then(res => {      
      this.allrooms = res.roominfo.data;
      console.log("res",res.bookinginfo.data);
      this.events = res.bookinginfo.data.map(item => {
        item['start_date'] = moment(item.date_from).format('YYYY-MM-DD');  
        item['end_date'] = moment(item.date_from).format('YYYY-MM-DD');  
        item.date_from = moment(item.date_from).format('YYYY-MM-DD');   
        item.date_to = moment(item.date_to).format('YYYY-MM-DD');   
        console.log("date_from",item.date_from);
        console.log("date_to",item.date_to);
        let regColors = { regBgColor: this.RegbackgroundColor, regBorderColor: this.RegborderColor };
        return new Guestroomcalendar(item, regColors);
      });      
      this.setEventsArray(this.events)
    })
  }

  setEventsArray(eventArray: any[] = []) {
    let calendarOptions = Object.assign({}, this.options);    
    calendarOptions.events = [...eventArray];
    this.options = Object.assign({}, calendarOptions);
    this.showCalendar = true;    
  }
  //EVENT SHOW ON MODAL POPUP
  showEventToolTip($event: any) {
    if ($event.view.type == 'listMonth') {
      $event.el.querySelector('.fc-list-event-graphic span.fc-list-event-dot').remove();
      let eventTitle = $event.el.querySelector('.fc-list-event-title');
      
      //prpend event time
      // if ($event.event.extendedProps.arrival_time) {
      //   const eventTime = moment($event.event.extendedProps.date_from).format(this.defaultDateTimeFormat.time_format) + ' - ';
      //   eventTitle.prepend(eventTime.toUpperCase());
      // }
      //append event location
      // if($event.event.extendedProps.eventlocation && $event.event.extendedProps.eventlocation.category_name){
      //     const location = '('+$event.event.extendedProps.eventlocation.category_name+')';
      //     eventTitle.append(location);
      // }
    }
    //If View Is List Return false
    //if($event.view.type=='listMonthDisabled'){
    if ($event.view.type !== 'listMonth') {
      $event.el.querySelector('.fc-event-title-container').remove();
      let myElementContainer = new DomPortalHost(
        $event.el.querySelector('.fc-event-main-frame'),
        this.componentFactoryResolver,
        this.appRef,
        this.injector);
      const componentRef = myElementContainer.attach(new ComponentPortal(GridEventComponent));
      componentRef.instance.eventInfo = $event;
      componentRef.instance.eventSettings = this.EventSettings;
      componentRef.changeDetectorRef.detectChanges();
    }
  }
  //SHOW EVENT MODAL WINDOW    
  showEventDetails($event: any) {
    this.eventDetails = this._matDialog.open(RoomCalenderMadalComponent, {
      disableClose: false,
      panelClass: 'event-details-dialog'
    });
    this.eventDetails.componentInstance.eventInfo = $event;
    this.eventDetails.componentInstance.eventSettings = this.EventSettings;
    this.eventDetails.afterClosed()
      .subscribe(result => {
        if (result) {
        }
      });
  }

}
