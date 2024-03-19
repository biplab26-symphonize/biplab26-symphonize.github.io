import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { FilesService, AppConfig, CommonService } from 'app/_services';
import { ActivatedRoute } from '@angular/router';
import { CommonUtils } from 'app/_helpers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-archieve',
  templateUrl: './archieve.component.html',
  styleUrls: ['./archieve.component.scss'], 
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class ArchieveComponent implements OnInit {
// Private
private _unsubscribeAll: Subject<any>;
public noRecords:boolean = false;
public archieveDocument :any[]=[];
public defaultDateTimeFormat: any = {date_format:'MM/dd/yyyy',time_format:"h:mm a"};
public mediaUrl: string;
public documentsUrl: string;
public slug:any;
pageName: string = '';
showEmptyMsg: boolean = false;
constructor(
    private _fuseConfigService: FuseConfigService,
    private route : ActivatedRoute,
    private _filesService: FilesService,
    private _commonService : CommonService,
    private _appConfig: AppConfig) {
    // Configure the layout
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if(this.route.routeConfig.path=='archive/:slug'){
      this.slug    = this.route.params['value'].slug;
    }
  }

  ngOnInit() {
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
    this.mediaUrl = AppConfig.Settings.url.mediaUrl;
    this.documentsUrl   = AppConfig.Settings.url.documentsUrl;

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        this.slug  = params && params['slug'] ? params['slug'] : '';
        this.getArchiveList();
    });
    
    this._appConfig.onMenuLoad
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((menusresponse) => {
        if (menusresponse !== null) {
          this.pageName = menusresponse.menu_title ? menusresponse.menu_title : this.slug;
        }
      });
  }
  getArchiveList(){
    this._filesService.archieveDocument({'slug':this.slug}).subscribe(response=>{
      if(response && response.status==200){
        this.archieveDocument = response.documentsinfo;
        //NO EVENTS MESSAGE
        this.showEmptyMsg = this.archieveDocument && this.archieveDocument.length==0 ? true : false;
      }
      else{
        this.showEmptyMsg = true;
      }
      
    });
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
