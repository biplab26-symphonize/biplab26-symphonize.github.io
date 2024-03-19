import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormsService, AuthService } from 'app/_services';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-viewform',
  templateUrl: './viewform.component.html',
  styleUrls: ['./viewform.component.scss']
})
export class ViewformComponent implements OnInit {


  form: FormGroup; 
  // Private
  private _unsubscribeAll: Subject<any>;
  public UserId: number;
  public viewForm: any;
  constructor(
    private route: ActivatedRoute,
    private _fuseConfigService: FuseConfigService,
    private _formService: FormsService,
    private authenticationService: AuthService
  ) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this._fuseConfigService.config = CommonUtils.setHorizontalLayout();
  }

  public ngOnInit(): void {

    //call get events list function
    this.route.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(params => {
        //get UserInfo from Authservice
        this.UserId = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user.id : null;
        this.viewForm = this._formService.form;
        if(this.viewForm){
          this.viewForm.created_by = this.UserId;
        }
    });
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
