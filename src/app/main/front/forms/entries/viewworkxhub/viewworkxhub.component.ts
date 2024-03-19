import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { ActivatedRoute } from '@angular/router';
import { FormentriesService, CommonService, AppConfig } from 'app/_services';
import { FormGroup} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-viewworkxhub',
  templateUrl: './viewworkxhub.component.html',
  styleUrls: ['./viewworkxhub.component.scss'],
  animations : fuseAnimations
})
export class ViewworkxhubComponent implements OnInit {
  public url_id: any;
  public workxhub: any;

  public Department
  public Description
  public Details
  public EntryComments
  public LastOutcomeDate
  public LastOutcomeNotes
  public LastOutcomeStatus
  public LocationDescription
  public PermissionToEnter
  public RequestDateTime
  public defaultDateTimeFormat: any = { date_format: 'MM/dd/yyyy', time_format: "h:mm a" };
  public RequestedFor
  public  Number ;
  constructor(
    private route              : ActivatedRoute,
    private _fuseConfigService : FuseConfigService,
    private _formsEntryService : FormentriesService,
    private  _commonService    : CommonService,
    private dynamiclist        : CommonService)
 { 
  this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
    this.route.params.subscribe( params => {
      this.url_id = params.id;
    });
    //Deault DateTime Formats
    this.defaultDateTimeFormat = this._commonService.getDefaultDateTimeFormat;
  }

  ngOnInit() {
    setTimeout(() => {
      this._formsEntryService.getWorkXHubContent(this.url_id).subscribe(response => {
              this.workxhub              = response.workxhubentryinfo;
              this.Department            = this.workxhub.Department;
              this.Description           = this.workxhub.Description;
              this.Details               = this.workxhub.Details;
              // this.EntryComments         = this.workxhub.EntryComments;
              this.LastOutcomeDate       = this.workxhub.LastOutcomeDate;
              this.LastOutcomeNotes      = this.workxhub.LastOutcomeNotes
              this.LastOutcomeStatus     = this.workxhub.LastOutcomeStatus;
              this.LocationDescription   = this.workxhub.LocationDescription;
              this.PermissionToEnter     = this.workxhub.PermissionToEnter;
              this.RequestDateTime       = this.workxhub.RequestDateTime;
              this.RequestedFor          = this.workxhub.RequestedFor;
              this.Number                = this.workxhub.Number;
      });
    }, 1000);
   
  }
}
