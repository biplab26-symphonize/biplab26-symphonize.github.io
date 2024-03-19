
import { Component, OnInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CalendarGeneratorService, CommonService } from 'app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-calendar-customization',
  templateUrl: './calendar-customization.component.html',
  styleUrls: ['./calendar-customization.component.scss']
})
export class CalendarCustomizationComponent implements OnInit {
  @Output() customizationData = new EventEmitter();
  @Input('customizationdata') customizationdata;


  @Input('tempdata') tempdata;

  public defoultdata: any;
  counter;
  mediaInfo: any = [];
  public calendarcustomizationform: FormGroup;
  public custom_holidays: FormArray;
  public currentMonth: any;
  public today: Date = new Date();
  public currentYear: any;
  public cell: any;
  public cellText: any;
  public blank_cell: any = [];
  public month: any;
  public years: any
  public lastMonthAndYear: any;
  public days: any = []
  public startcountcells: any = []
  public startdays: any = [];
  public customTextCells: any = [];
  public customImageCells: any = [];
  public textvalue: "";
  public holidaysarray: any = [];
  public currentblankcount
  flag; flag_end; week_number;
  public year: any;
  public custom_index: any;
  public custom_value: any;
  public month_number: any;
  public currentstartweek: any
  public currentendweek: any
  public blackcellstartcount: any = [];
  public selectedDate: any;
  public blackcellendcount: any = [];
  public selected: any = [];
  public displayholidaydata: any = [];
  public deleteholiday: any = [];
  public Checkeditems: any = [];
  public savetemepletdata: any = [];
  public gettempletdata: any = [];
  public holidayfinalarray: any = [];
  public startday: any
  public minDate: any;
  public maxDate: any;
  public unique: any;
  public displayinfiverow: any;
  public cutmotextdata = ''
  public displaythefield: any;
  public file: File | null = null;
  filetype: Boolean = true;
  url: string = '';
  logourl: string = '';
  public inputAccpets: string = ".jpeg, .jpg, .png";
  public getYear: any;
  public dispArray: any = [];
  public imageCell: any = [];
  public textCell: any = [];
  public concatArray: any = [];
  public concatAllArray: any = [];
  public urlID: any;
  public displayImage: Boolean = false;
  public monthName: any;
  uploadInfo: any = {
    'avatar': { 'type': 'defaultprofile', 'media_id': 0, 'url': "", 'apimediaUrl': 'media/upload' },
  };

  constructor(
    private fb: FormBuilder,
    private _matSnackBar: MatSnackBar,
    public _matDialog: MatDialog,
    private render: Renderer2,
    private calendarService: CalendarGeneratorService,
    private _commonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.urlID = params.id;
    });
  }

  ngOnInit() {

    this.calendarcustomizationform = this.fb.group({

      selectedtempletname: this.fb.control(''),
      custom_holidays: this.fb.array([this.createItem()]),
      custom_holiday: this.fb.control(''),
      custom_template: this.fb.control(''),
      blank_cells: this.fb.control(''),
      customphoto: this.fb.control(''),
      image: this.fb.control(''),
      customtext: this.fb.control(''),
      //datetime            : this.fb.control(moment())
    });
    this.calendarService.displayholiday(JSON.parse(localStorage.getItem('token')).user_id).subscribe(res => {
      this.displayholidaydata = res.data;
    })

    if (this.route.routeConfig.path == 'admin/calendar-generator/:id') {
      this.calendarService.getCalendarData(this.urlID)
        .then(Response => {
          this.calendarService.setdynamicdata(Response.data);
          this.getEditData(Response.data);
        },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }

  }

  getEditData(getData) {
    console.log("getData>>>>", getData);
    let date_val = new Date(getData[0].date);
    this.year = date_val.getFullYear();
    this.month_number = date_val.getMonth() + 1;
    this.currentstartweek = getData[0].start_week;
    this.currentendweek = getData[0].end_week;

    let blankCellArr = getData[0] && getData[0].blank_cells ? JSON.parse(getData[0].blank_cells) : [];
    this.calenadarcoustomization(this.year, this.month_number, this.currentstartweek, this.currentendweek);
    //set hoililday on selection of template
    let existshoildayArr = getData[0] && getData[0].calendarholiday ? getData[0].calendarholiday : []; 
    if (this.displayholidaydata && this.displayholidaydata.length > 0 && existshoildayArr && existshoildayArr.length > 0) {
      let hoildayIds = existshoildayArr.map(item => { return item.holiday_id });
      let updateddisplayholidaydata = this.displayholidaydata.map(item => {
        item['checked'] = hoildayIds.includes(item.id) ? true : false;
        return item;
      });
      this.displayholidaydata = [...updateddisplayholidaydata];
    }
  }

  ngOnChanges() {
    if (this.customizationdata != undefined) {
      let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      //this.calendarcustomizationform.reset();
      this.calendarcustomizationform.controls['blank_cells'].reset();
      this.defoultdata = this.customizationdata;

      let date_val = new Date(this.defoultdata.date);
      this.monthName = monthNames[date_val.getMonth()];
      this.year = date_val.getFullYear();
      this.month_number = date_val.getMonth() + 1;
      this.currentstartweek = this.defoultdata.start_week;
      this.currentendweek = this.defoultdata.end_week;
      this.startday = this.defoultdata.start_day;
      this.startday = this.defoultdata.start_day;
      this.displayinfiverow = this.defoultdata.disp_five_rows;
      this.minDate = new Date(this.year, date_val.getMonth(), 1);
      this.maxDate = new Date(this.year, date_val.getMonth() + 1, 0);
      console.log("this.displayholidaydata>", this.displayholidaydata);
      console.log("this.customizationdata>", this.customizationdata);
      //this.concatAllArray = [];
      this.calenadarcoustomization(this.year, this.month_number, this.currentstartweek, this.currentendweek);
      //set hoililday on selection of template
      if (this.displayholidaydata && this.displayholidaydata.length > 0 && this.defoultdata.calendarholiday && this.defoultdata.calendarholiday.length > 0) {
        let hoildayIds = this.defoultdata.calendarholiday.map(item => { return item.holiday_id });
        let updateddisplayholidaydata = this.displayholidaydata.map(item => {
          item['checked'] = hoildayIds.includes(item.id) ? true : false;
          return item;
        });
        this.displayholidaydata = [...updateddisplayholidaydata];
      }

    }

    /*if(this.tempdata !== undefined)
    {
     
        let data =  JSON.parse(this.tempdata.blank_cells)
        for(let inx of data)
        {
      
          this.calendarcustomizationform.patchValue({ blank_cells: inx.value});
        }
    }*/

  }



  createItem() {
    return this.fb.group({
      holiday_name: ['', Validators.required],
      holiday_date: ['', Validators.required]
    })
  }


  onAddSelectRow(index) {

    this.custom_holidays = this.calendarcustomizationform.get('custom_holidays') as FormArray;
    this.custom_holidays.push(this.createItem());
  }

  onRemoveRow(index) {

    this.custom_holidays.removeAt(index)
  }


  getControls() {

    return (this.calendarcustomizationform.get('custom_holidays') as FormArray).controls;
  }


  calenadarcoustomization(year, month_number, startweek, endweek) {

    this.startdays = [];
    let firstOfMonth = new Date(year, month_number - 1, 1);
    let lastOfMonth = new Date(year, month_number, 0);
    let used = firstOfMonth.getDay() + lastOfMonth.getDate();
    this.week_number = Math.ceil(used / 7);
    this.selectedDate = new Date(year, month_number - 1, firstOfMonth.getDay());
    // this.monthAndYear      = new Date(year,month_number-1,0);
    let endOfLastMonth = (new Date(year, month_number - 1, 0)).getDate();
    this.currentstartweek = startweek == 'last' ? this.week_number : startweek;
    this.currentendweek = endweek == 'last' ? this.week_number : endweek;
    let firstDay = new Date(year, month_number - 1, 1);
    let daycount = firstDay.getDay();
    let blankcell = endOfLastMonth - daycount + 1;

    // this.calendarcustomizationform.patchValue({blank_cells :''});

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    if (month_number == 1) {
      let lastYear = year - 1
      this.years = lastYear;
      this.month = "11"
    } else {
      // this. monthAndYear = month_number-1+"-"+year;
      this.years = year;
      this.month = month_number - 1;
    }

    if (month_number == 12) {
      let nextYear = year + 1;
      this.lastMonthAndYear = "1-" + nextYear;
    } else {
      this.lastMonthAndYear = month_number + 1 + "-" + year;
    }

    // creating all cells
    let date = 1;
    let enddate = 1;


    if (this.displayinfiverow == true) {
      //let arr1 = [];


      let endWeekCount = this.currentendweek == 6 ? 5 : this.currentendweek;
      for (let i = 1; i <= endWeekCount; i++) {
        // creates a table row
        let row = document.createElement("tr");
        //creating individual cells, filing them up with data.
        if ((month_number == 8 && year == 2020) || (month_number == 1 && year == 2021) || (month_number == 5 && year == 2021)) {
          for (let j = 0; j < 7; j++) {
            if (i === 1 && j == 0) {
              for (let k = 30; k <= this.daysInMonth(month_number, year); k++) {
                this.cell = document.createElement("td");
                //this.render.addClass(this.cell,'other_month');
                //this.cellText = document.createTextNode(""+this.daysInMonth(month_number,year));
                this.cellText = document.createTextNode("" + k);
                this.cell.appendChild(this.cellText);
                row.appendChild(this.cell);
                blankcell++
              }

            }
            else if ((i === 1 && j < daycount) && blankcell <= 31) {

              this.startdays.push(this.month + '-' + blankcell + "-" + this.year);
              this.cell = document.createElement("td");
              this.render.addClass(this.cell, 'other_month');
              this.cellText = document.createTextNode("" + blankcell);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              blankcell++;
              this.unique = Array.from(new Set(this.startdays))
              this.unique = this.startdays.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
              })

            } else if (i == 1 && j == 6) {
              //break;
              this.cell = document.createElement("td");
              this.cellText = document.createTextNode("" + date);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              date++;
            }
            else {
              if (i != 1) {

                if (date >= this.daysInMonth(month_number, year)) {

                  break;
                }
                this.cell = document.createElement("td");
                this.cellText = document.createTextNode("" + date);
                if (date === this.today.getDate() && year === this.today.getFullYear() && month_number === this.today.getMonth()) {
                  this.render.addClass(this.cell, "bg-info");
                } // color today's date
                this.cell.appendChild(this.cellText);
                row.appendChild(this.cell);
                date++;
              }
            }
          }
        } else {
          for (let j = 0; j < 7; j++) {
            if (i === 1 && j == 0 && lastOfMonth.getDate() == this.daysInMonth(month_number, year)) {

              this.cell = document.createElement("td");
              //this.render.addClass(this.cell,'other_month');
              this.cellText = document.createTextNode("" + this.daysInMonth(month_number, year));
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              blankcell++
            }
            else if (i === 1 && j < daycount) {

              this.startdays.push(this.month + '-' + blankcell + "-" + this.year);
              this.cell = document.createElement("td");
              this.render.addClass(this.cell, 'other_month');
              this.cellText = document.createTextNode("" + blankcell);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              blankcell++;
              this.unique = Array.from(new Set(this.startdays))
              this.unique = this.startdays.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
              })

            } else if (date > this.daysInMonth(month_number, year)) {
              break;

            } else {

              if (date >= this.daysInMonth(month_number, year)) {

                break;
              }
              this.cell = document.createElement("td");
              this.cellText = document.createTextNode("" + date);
              if (date === this.today.getDate() && year === this.today.getFullYear() && month_number === this.today.getMonth()) {
                this.render.addClass(this.cell, "bg-info");
              } // color today's date
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              date++;

            }
          }
        }
        for (let k = this.currentstartweek; k <= i; k++) {
          if (k == i) {
            tbl.appendChild(row); // appending each row into calendar body.
          }
        }

        //  display the blank cells code here 
        let classcount = document.getElementsByClassName("other_month").length;
        if (classcount === this.startcountcells.length) {
          this.startcountcells = [];
        } else {
          this.startcountcells = [];
        }

        for (let k = 0; k < classcount; k++) {
          this.startcountcells.push({ 'index': k, 'value': this.unique[k] });
        }
      }      //  blank cell code is end here 
    }
    // display five row
    else {
      for (let i = 1; i <= this.currentendweek; i++) {
        // creates a table row
        let row = document.createElement("tr");
        //creating individual cells, filing them up with data.
        if (this.startday == "sunday") {

          for (let j = 0; j < 7; j++) {
            if (i === 1 && j < daycount) {

              this.cell = document.createElement("td");
              if (this.currentstartweek < 2) {

                this.startdays.push(this.month + '-' + blankcell + "-" + this.year);
                this.render.addClass(this.cell, 'other_month');
              }
              this.cellText = document.createTextNode("" + blankcell);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              blankcell++;
              this.unique = Array.from(new Set(this.startdays))
              this.unique = this.startdays.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
              })


            } else if (date > this.daysInMonth(month_number, year)) {
              this.startdays.push(enddate + "-" + this.lastMonthAndYear);
              this.cell = document.createElement("td");
              this.render.addClass(this.cell, 'other_month');
              this.cellText = document.createTextNode("" + enddate);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              enddate++;
              this.unique = this.startdays.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
              })
              i++;
            } else {
              this.cell = document.createElement("td");
              this.cellText = document.createTextNode("" + date);
              if (date === this.today.getDate() && year === this.today.getFullYear() && month_number === this.today.getMonth()) {
                this.render.addClass(this.cell, "bg-info");
              } // color today's date
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              date++;

            }

          }
        }

        if (this.startday == 'monday') {
          blankcell = endOfLastMonth - daycount + 2;
          daycount = firstDay.getDay() - 1;


          for (let j = 0; j < 7; j++) {

            if (i === 1 && j < daycount) {


              this.cell = document.createElement("td");
              if (this.currentstartweek < 2) {
                this.startdays.push(this.month + '-' + blankcell + "-" + this.year);
                this.render.addClass(this.cell, 'other_month');
              }

              this.cellText = document.createTextNode("" + blankcell);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              blankcell++;

              this.unique = Array.from(new Set(this.startdays))
              this.unique = this.startdays.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
              })
            } else if (date > this.daysInMonth(month_number, year)) {
              this.unique = [];
              this.startdays.push(enddate + "-" + this.lastMonthAndYear);
              this.cell = document.createElement("td");
              this.render.addClass(this.cell, 'other_month');
              this.cellText = document.createTextNode("" + enddate);
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              enddate++;
              i++;
              this.unique = this.startdays.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
              })

            } else {


              this.cell = document.createElement("td");
              this.cellText = document.createTextNode("" + date);
              if (date === this.today.getDate() && year === this.today.getFullYear() && month_number === this.today.getMonth()) {
                this.render.addClass(this.cell, "bg-info");
              } // color today's date
              this.cell.appendChild(this.cellText);
              row.appendChild(this.cell);
              date++;
              if (date > this.daysInMonth(month_number, year)) {
                i++;
              }

            }

          }
        }
        for (let k = this.currentstartweek; k <= i; k++) {
          if (k == i) {
            tbl.appendChild(row); // appending each row into calendar body.
          }
        }

        //  display the blank cells code here 
        let classcount = document.getElementsByClassName("other_month").length;
        if (classcount === this.startcountcells.length) {
          this.startcountcells = [];
        } else {
          this.startcountcells = [];
        }
        for (let k = 0; k < classcount; k++) {
          this.startcountcells.push({ 'index': k, 'value': this.unique[k] });
        }


      }
      //  blank cell code is end here 

    }

    this.customizationData.emit(this.calendarcustomizationform.value);
  }

  daysInMonth(iMonth, iYear) {
    return new Date(iYear, iMonth, 0).getDate();
  }




  selectOption(index, value) {

    this.displaythefield = index;
    if (value == 'custom_text') {
      document.getElementById("field_countcell_" + index).parentElement.classList.remove('d-none');
      document.getElementById("field_countcell_" + index).style.display = 'block';
      document.getElementById("image_countcell_" + index).style.display = 'none';
    } else if (value == 'custom_photo') {
      document.getElementById("image_countcell_" + index).parentElement.classList.remove('d-none');
      document.getElementById("image_countcell_" + index).style.display = 'block';
      document.getElementById("field_countcell_" + index).style.display = 'none';
    } else {
      document.getElementById("field_countcell_" + index).parentElement.classList.add('d-none');
      document.getElementById("field_countcell_" + index).style.display = 'none';
      document.getElementById("image_countcell_" + index).style.display = 'none';
    }


    let blankPrevIndex = this.blank_cell.findIndex(item => {
      return item.index == index;
    });
    if (blankPrevIndex >= 0) {
      let splice_index = index + 1;
      this.blank_cell[blankPrevIndex].value = value;
      if (this.blank_cell[blankPrevIndex].value != 'custom_text') {

        this.textCell = this.textCell.filter(item => item.index != index);

      }
      if (this.blank_cell[blankPrevIndex].value != 'custom_photo') {

        this.imageCell = this.imageCell.filter(item => item.index != index);

      }

    } else {
      this.blank_cell.push({
        'index': index,
        'value': value
      });
    }



    let values = this.calendarcustomizationform.value

    this.concatArray = this.blank_cell.concat(this.imageCell);
    this.concatAllArray = this.concatArray.concat(this.textCell);




    let calendarformatformdata: any = {
      'blank_cells': JSON.stringify(this.concatAllArray),
      'custom_holidays': values.custom_holidays,
      'custom_holiday': values != null ? values.custom_holiday : ''
    }

    this.customizationData.emit(calendarformatformdata);

  }

  onKeydownEvent(event: any, index) {
    let values = this.calendarcustomizationform.value;
    //this.cutmotextdata += event.target.value;
    let finaldata = 'text,' + event.target.value;

    this.textCell.push({
      'index': index,
      'value': finaldata
    });

    this.concatArray = this.blank_cell.concat(this.imageCell);
    this.concatAllArray = this.concatArray.concat(this.textCell);
    let adddata: any = {
      'blank_cells': JSON.stringify(this.concatAllArray),
      'custom_holidays': values.custom_holidays,
      'custom_holiday': values.custom_holiday
    }

    this.customizationData.emit(adddata);

  }

  /* cutom Image*/
  onSelectLogoFile(event, index) {
    const file = event && event.target.files[0] || null;
    this.file = file;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed

        this.mediaInfo = new FormData();
        this.mediaInfo.append('image', this.file);
        this.mediaInfo.append('type', 'CalanderGenerator_blank_cell');
        this._commonService.uploadfiles(this.mediaInfo)
          .subscribe(uploadResponse => {
            this.uploadInfo.avatar.url = uploadResponse.media.image ? uploadResponse.media.image : "";
            if (uploadResponse.media.image) {

              //document.getElementById("image_disp_"+index).src = event.target.result;
              document.getElementById("image_disp_" + index).setAttribute('src', event.target.result);
              this.displayImage = true;
              let values = this.calendarcustomizationform.value;
              let imageurl = 'image,' + this.uploadInfo.avatar.url;


              this.imageCell.push({
                'index': index,
                'value': imageurl
              });
              this.concatArray = this.blank_cell.concat(this.imageCell);
              this.concatAllArray = this.concatArray.concat(this.textCell);
              let addimgdata: any = {

                'blank_cells': JSON.stringify(this.concatAllArray),
                'custom_holidays': values.custom_holidays,
                'custom_holiday': values.custom_holiday,

              }

              this.customizationData.emit(addimgdata);

            }
          });

      }
    }

  }

  // save the holidays value 
  Onsaveholiday() {
    this.holidaysarray = [];
    let dateholiday = this.calendarcustomizationform.get('custom_holidays').value;

    let holidaycurrentdate;
    let holiddaycurrentname;
    for (let index of dateholiday) {
      holidaycurrentdate = index.holiday_date;
      holiddaycurrentname = index.holiday_name;
      this.holidaysarray.push(
        {
          'holiday_name': holiddaycurrentname,
          'date': moment(holidaycurrentdate).format('YYYY-MMM-DD')
        }
      )
    }





    this.calendarService.saveholiday({ 'custom_holidays': JSON.stringify(this.holidaysarray), 'user_id': JSON.parse(localStorage.getItem('token')).user_id },
    ).subscribe(response => {
      if (response.message === 'Holiday created successfully' && response.status == 200) {

        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000

        });

      }
      this.displayholidaylist();
    },
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
          verticalPosition: 'top',
          duration: 2000
        });
      });

    this.customizationData.emit(this.calendarcustomizationform.value);

  }


  displayholidaylist() {

    this.calendarService.displayholiday(JSON.parse(localStorage.getItem('token')).user_id).subscribe(res => {

      this.displayholidaydata = res.data;

    })

  }


  onselelect(event, value) {
    this.deleteholiday.push(value);
    if (event.checked) {
      this.Checkeditems.push(value); //if value is not  checked..
    }
    if (!event.checked) {
      let index = this.Checkeditems.indexOf(value);
      if (index > -1) {
        this.Checkeditems.splice(index, 1); //if value is checked ...

      }

    }

    this.calendarcustomizationform.patchValue({ custom_holiday: this.Checkeditems.join() });
    let calendarformatformdata: any = {
      'blank_cells': JSON.stringify(this.concatAllArray),
      'custom_holiday': this.Checkeditems.join()
    }
    this.customizationData.emit(calendarformatformdata);
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }


}
