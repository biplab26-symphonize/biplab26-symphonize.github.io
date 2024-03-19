import { Component, OnInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { MeetingRoomService, CommonService, SettingsService, OptionsList } from 'app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  animations: fuseAnimations
})
export class RoomsComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public addRoom: FormGroup;
  public roomsData: any =[];
  public default_img: any;
  public order: any;
  public stepNumber: any = [];
  public items_per_page : any ;
  public ForumSettings: any;
  public limit : any ;
  @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    PaginationOpt: {'pageSize':'',pageSizeOptions:[],page:1}; //pagination size,page options  

  constructor(private fb: FormBuilder, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router, private _commonService: CommonService, private _fuseConfigService: FuseConfigService, private _meetingRoomService: MeetingRoomService, private _settingService: SettingsService) {
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.order = 'low';
    this.stepNumber[0] = 1;
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
   this._meetingRoomService.setEmptyListData();
    this._settingService.getMeetingRoomSetting({ meta_type: "meeting" }).then(res => {
      for (let item of res.data) {
        // if (JSON.stringify(item.meta_key) == 'Default_img') {
        //   this.default_img = item.meta_value;
        // }
        if(item.meta_key  == 'number_of_items_per_page'){
          this.items_per_page = item.meta_value;
        }
      }
      this.default_img = "src/assets/images/avatars/cover.jpg";    
    let pageLimit: any = [];
    pageLimit[0] =   this.items_per_page;
    this.limit =  this.items_per_page;
    //Pagination options
    this.PaginationOpt = { ...OptionsList.Options.tables.pagination.options };
    this.ForumSettings = OptionsList.Options.forumsettings;
    //Set Default pagination limit from settings
    setTimeout(() => {
      this.PaginationOpt.pageSize = pageLimit || this.PaginationOpt.pageSize;


      this.getRooms(null);
      //get topicslist by filters and paigantion
      merge(this.paginator.page)
        .pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(res => {
          this.getRooms(res);
        });

    }, 1000);
   });
    this.setControls();
  
  }
  setControls() {
    this.addRoom = this.fb.group({
      step: this.fb.control('step1'),
      order_by: this.fb.control('low'),
    });
  }
  getRooms(res) {
  let page  = res == null ? 1 : res.pageIndex + 1;  
    return this._meetingRoomService.getRoomsList({ 'status': 'A', 'trash': '', 'direction': 'asc','page':page,'limit':this.limit  }).then(Response => {
      this.roomsData = Response.data;
    });
  }
  getBookRoom(id) {
    this.router.navigate(['book-room/', id]);
  }
  getRoomsOrder(event) {    
    this.order = event.value;
    if (this.order == 'high') {
      return this._meetingRoomService.getRoomsList({ 'status': 'A', 'trash': '', 'direction': 'desc','column':'capacity' }).then(Response => {
        this.roomsData = '';
        this.roomsData = Response.data;
      });
    } else {
      return this._meetingRoomService.getRoomsList({ 'status': 'A', 'trash': '', 'direction': 'asc','column':'capacity' }).then(Response => {
        this.roomsData = '';
        this.roomsData = Response.data;
      });
    }
  }
}
