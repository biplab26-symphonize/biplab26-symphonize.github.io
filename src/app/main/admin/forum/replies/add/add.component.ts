import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, AuthService, ReplyService, AnnouncementService, CommonService } from 'app/_services';
import { first, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Reply } from 'app/_models';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations
})
export class AddComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public ForumSettings: any;
  public replyform: FormGroup;
  public tinyMceSettings: {};
  public StatusList: any;
  public ReplyStatusList: any;
  public topicsList: any = [];
  public editForm: boolean = false;
  public currentUser: any;
  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _topicService: AnnouncementService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _authenticationService: AuthService,
    private _replyService: ReplyService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if (this.route.routeConfig.path == 'admin/forums/replies/edit/:id' && this.route.params['value'].id > 0) {
      this.editForm = true;
    }

    this.topicsList = this._topicService.topics.data;
    this.currentUser = this._authenticationService.currentUserValue.token.user;

    // LOAD TINYMCESETTING FROM COMMONUTILS
    this.tinyMceSettings = CommonUtils.getTinymceSetting('replies');
  }

  ngOnInit() {
    this.ForumSettings = OptionsList.Options.forumsettings;
    this.StatusList = OptionsList.Options.tables.status.users;
    this.ReplyStatusList = OptionsList.Options.tables.status.forums;

    this.setFormControl();
    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }

  setFormControl() {
    this.replyform = this._formBuilder.group({
      content_id: this._formBuilder.control(''),
      reply_id: this._formBuilder.control(''),
      title: this._formBuilder.control(''),
      user_id: this._formBuilder.control(this.currentUser.id),
      full_name: this._formBuilder.control(this.currentUser.first_name),
      email: this._formBuilder.control(this.currentUser.email),
      phone: this._formBuilder.control(this.currentUser.phone),
      message: this._formBuilder.control(''),
      rating: this._formBuilder.control(''),
      status: this._formBuilder.control('A', [Validators.required]),
      display_status: this._formBuilder.control('approved')
    });

    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/forums/replies/edit/:id') {
      this.editForm = true;
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    var forumData = new Reply().deserialize(this._replyService.reply, 'single');
    this.replyform.patchValue(forumData);
  }

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.replyform.valid) {

      //modify Post Values Before Send to Http

      this._replyService.saveReply(this.replyform.value, this.editForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              if (this.editForm) {
                this.showSnackBar("Reply Updated Successfully", 'CLOSE');
              }
              else {
                this.showSnackBar("Reply added Successfully", 'CLOSE');
              }
              this.router.navigate(['/admin/forums/replies/all']);
            }
            else {
              this.showSnackBar(data.message, 'CLOSE');
            }
          },
          error => {
            // Show the error message
            this._matSnackBar.open(error.message, 'Retry', {
              verticalPosition: 'top',
              duration: 2000
            });
          });
    }
    else {
      CommonUtils.validateAllFormFields(this.replyform);
    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
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


