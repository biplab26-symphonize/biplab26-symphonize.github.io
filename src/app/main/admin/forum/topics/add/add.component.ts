import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CategoryService, AuthService, AnnouncementService, ChatService, CommonService } from 'app/_services';
import { first, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Home, User } from 'app/_models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from 'app/main/admin/forms/add/edit-restriction/edit-restriction.component';
import { Observable, of } from 'rxjs';

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
  public topicform: FormGroup;
  public tinyMceSettings: {};
  public StatusList: any;
  public TopicStatusList: any;
  public forumList: any = [];
  public editForm: boolean = false;
  public user_id: number = 0;
  public userId: any;
  public url_id: any;
  public ForumList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    private _chatService: ChatService,
    private _formBuilder: FormBuilder,
    private _categoryService: CategoryService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _authenticationService: AuthService,
    private _topicService: AnnouncementService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if (this.route.routeConfig.path == 'admin/forums/topics/edit/:id' && this.route.params['value'].id > 0) {
      this.editForm = true;
      this.url_id = this.route.params['value'].id;
    }

    this.StatusList = OptionsList.Options.tables.status.users;
    this.TopicStatusList = OptionsList.Options.tables.status.forums;
    this.forumList = this._categoryService.Categorys.data;
    this.user_id = this._authenticationService.currentUserValue.token.user.id;
    // LOAD TINYMCESETTING FROM COMMONUTILS
    this.tinyMceSettings = CommonUtils.getTinymceSetting('topics');
  }

  ngOnInit() {
    this.ForumSettings = OptionsList.Options.forumsettings;
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
    this.topicform = this._formBuilder.group({
      content_id: this._formBuilder.control(''),
      content_type: this._formBuilder.control('forum'),
      content_title: this._formBuilder.control('', [Validators.required]),
      content_desc: this._formBuilder.control(''),
      status: this._formBuilder.control('A', [Validators.required]),
      forum_id: this._formBuilder.control(''),
      display_status: this._formBuilder.control('approved'),
      created_by: this._formBuilder.control(this.user_id)
    });

    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/forums/topics/edit/:id') {
      this.editForm = true;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      let edit: boolean = true;
      //this.fillFormValues(edit);
      this.getFilteredForms();
    }
    this.setUserInfo();
    this.EditRestrictionUpdateEvent();
  }
  getFilteredForms() {
    return this._topicService.getLists({ 'direction': 'desc', 'column': 'content_id', 'content_type': 'forum', 'admin': '1' }).then(Response => {
      this.ForumList = Response.data;
      this.userId = JSON.parse(localStorage.getItem('token')).user_id;
      console.log("ForumList", this.ForumList);
      this.ForumList.forEach(item => {
        console.log("url_id", this.url_id);
        console.log("item.content_id", item.content_id);
        if (this.url_id == item.content_id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.userId) {
              console.log("true");
              let edit: boolean = true;
              this.fillFormValues(edit);
            }
            if (item.editrestriction.user.id != this.userId) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {
            console.log("else");
            let edit: boolean = true;
            this.fillFormValues(edit);
          }
        }
      });
      this.showDialog();
    });

  }
  showDialog() {
    if (this.editRestrict == true) {
      const dialogRef = this._matDialog.open(TakeOverComponent, {
        disableClose: true,
        width: '50%',
        panelClass: 'printentries',
        data: { type: 'forumtopic', body: '<h2>Recurring Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/forums/topics/all']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictForum();
        }
      });
    }
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this._authenticationService.currentUserValue.token ? this._authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {
    this._chatService.listen(environment.pusher.forum_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {
      console.log("response", res);
      localStorage.setItem("second_user", res.user.username);
      this.pusherCounter = this.pusherCounter + 1;
      if (this.pusherCounter != 2) {
        this.showPopup();
      }

    });
  }
  showPopup() {
    const dialogRef = this._matDialog.open(EditRestrictionComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'printentries',
      data: { type: 'forumtopic', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/forums/topics/all']);
      }
    });
  }
  editRestrictForum() {
    this._topicService.updateForm(this.url_id, 'topic').subscribe(response => {
      let edit: boolean = true;
      this.fillFormValues(edit);
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.userId;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'topic';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  // fillFormValues(edit:any){
  //   var forumData = new Home().deserialize(this._topicService.topic,'single');
  //   this.topicform.patchValue(forumData);
  // }

  fillFormValues(edit: any) {
    this._topicService.getTopicContent(this.url_id, edit).then(response => {
      console.log("response", response);
      var forumData = new Home().deserialize(response.contentinfo, 'single');
      this.topicform.patchValue(forumData);
    });
  }

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.topicform.valid) {
      this._topicService.saveAnnouncement(this.topicform.value, this.editForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              if (this.editForm) {
                this.showSnackBar("Topic Updated Successfully", 'CLOSE');
              }
              else {
                this.showSnackBar("Topic added Successfully", 'CLOSE');
              }
              this.router.navigate(['/admin/forums/topics/all']);
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
      CommonUtils.validateAllFormFields(this.topicform);
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

