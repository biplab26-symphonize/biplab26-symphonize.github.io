import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { OptionsList, AnnouncementService, CommonService } from 'app/_services';
import { FormGroup } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'widget-bulletins',
  templateUrl: './bulletins.component.html',
  styleUrls: ['./bulletins.component.scss'],
  animations : fuseAnimations
})
export class BulletinsComponent implements OnInit {
  @Input() homesettings: any;

  // Private
  private _unsubscribeAll: Subject<any>;
  public ForumSettings     : any;   
  public filterForm        : FormGroup;
  public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
  public bulletinsList     : any = [];
  public filterParams      : any={};
 
  @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    PaginationOpt: {'pageSize':'',pageSizeOptions:[],page:1}; //pagination size,page options  

    constructor(
        private _topicsService : AnnouncementService,
        private _commonService : CommonService,
        private router: Router) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
         //Deault DateTime Formats
       this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
        //Pagination options
        this.PaginationOpt      = {...OptionsList.Options.tables.pagination.options};
        this.ForumSettings      = OptionsList.Options.forumsettings;
        //Set Default pagination limit from settings
        setTimeout(() => {
          this.PaginationOpt.pageSize = this.homesettings.bulletin_limit || this.PaginationOpt.pageSize;
        
    
        this.getTopicsList(null);
        //get topicslist by filters and paigantion
        merge(this.paginator.page)
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe(res=>{          
            this.getTopicsList(res);
        }); 

      }, 1000);
    }
    //get Topiclist
    getTopicsList(res){
        //get Topiclist from Api
        this.filterParams['page']  = res == null ? 1 : res.pageIndex + 1; 
        this.filterParams['limit'] = res == null ? this.homesettings.bulletin_limit : res.pageSize; 
        this.filterParams['content_type'] = 'forum'
        this.filterParams['column'] = 'content_id'     
        
        this._topicsService.getLists(this.filterParams).then(response=>{   
          this.bulletinsList = response;
        })
    }
    //Reset PageIndex On Form Changes
    resetPageIndex(){
        this.paginator.pageIndex = 0;
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

