import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonUtils } from 'app/_helpers';
import { OptionsList, CategoryService, AuthService, ChatService, CommonService } from 'app/_services';
import { first, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Category, User } from 'app/_models';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TakeOverComponent } from '../../forms/add/take-over/take-over.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { EditRestrictionComponent } from '../../forms/add/edit-restriction/edit-restriction.component';

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
  public forumform: FormGroup;
  public ForumSettings: any;
  public userId: string = '';
  public tinyMceSettings: {};
  public StatusList: any;
  public forumList: any = [];
  public file;
  public editForm: boolean = false;
  public Imgname;
  public selectedFile;
  public filetype: boolean = false;
  public appConfig: any;
  public imgurl;
  public user_id: any;
  public url_id: any;
  public serviceList: any;
  savingEntry: any = false;
  public editRestrict: boolean = false;
  public userName: any;
  public firstUserId: any;
  loginUserInfo: any;
  public pusherCounter = 0;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  uploadInfo: any = {
    'avatar': { 'type': 'avatar', 'media_id': 0, 'formControlName': 'avatar_media_id', 'url': "", 'apimediaUrl': 'media/userupload' },
  };


  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _commonService: CommonService,
    public _matDialog: MatDialog,
    private _chatService: ChatService,
    private authenticationService: AuthService,
    private _formBuilder: FormBuilder,
    private _categoryService: CategoryService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

    if (this.route.routeConfig.path == 'admin/forums/edit/:id' && this.route.params['value'].id > 0) {
      this.editForm = true;
      this.url_id = this.route.params['value'].id;
    }

    this.StatusList = OptionsList.Options.tables.status.users;

    // LOAD TINYMCESETTING FROM COMMONUTILS
    this.tinyMceSettings = CommonUtils.getTinymceSetting('forum');
  }

  ngOnInit() {
    this.ForumSettings = OptionsList.Options.forumsettings;

    //FORUM LIST FOR PARENT DROPDOWN 
    this._categoryService.getCategorys({ status: 'A', category_type: 'FC', 'column': 'category_name' }).then(categoryInfo => {
      this.forumList = categoryInfo.data || [];
    });
    this.userId = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user.id : null;
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
    this.forumform = this._formBuilder.group({
      id: this._formBuilder.control(''),
      category_name: this._formBuilder.control('', [Validators.required]),
      description: this._formBuilder.control(''),
      status: this._formBuilder.control('A', [Validators.required]),
      category_type: this._formBuilder.control('FC'),
      parent_id: this._formBuilder.control(0),
      created_by: this._formBuilder.control(this.userId)
    });

    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/forums/edit/:id') {
      // this.fillFormValues();
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;
      this.getFilteredServices();
    }
    this.setUserInfo();    
    this.EditRestrictionUpdateEvent();
  }
  getFilteredServices() {
    return this._categoryService.getForums({ 'direction': 'desc', 'column': 'id', 'category_type': 'FC' }).then(Response => {
      this.serviceList = Response.data;
      this.user_id = JSON.parse(localStorage.getItem('token')).user_id;      
      this.serviceList.forEach(item => {
        if (this.url_id == item.id) {
          let editrestriction: any;
          editrestriction = item.editrestriction;
          if (editrestriction != null) {
            if (item.editrestriction.user.id == this.user_id) {              
              let edit: boolean = true;
              this.fillFormValues(edit);
            }
            if (item.editrestriction.user.id != this.user_id) {
              this.editRestrict = true;
              this.userName = item.editrestriction.user.username;
              localStorage.setItem("first_user", this.userName);
            }
          } else {            
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
        data: { type: 'UpdateForum', body: '<h2>Edit Confirmation</h2>' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'goback') {
          this.savingEntry = true;
          this.router.navigate(['/admin/forums/all']);
        }
        if (result == 'preview') {
          this.router.navigate(['/admin/forms/preview', this.url_id]);
        }
        if (result == 'takeover') {
          this.editRestrictStaff();
        }
      });
    }
  }
  editRestrictStaff() {
    this._categoryService.updateForm(this.url_id, 'forum').subscribe(response => {      
      let edit: boolean = true;
      this.fillFormValues(edit);
    });
  }
  setUserInfo() {
    //Set User Info to display on navbar
    let UserInfo = this.authenticationService.currentUserValue.token ? this.authenticationService.currentUserValue.token.user : null;
    this.loginUserInfo = new User().deserialize(UserInfo, 'single');
  }
  EditRestrictionUpdateEvent() {    
    this._chatService.listen(environment.pusher.forum_edit, environment.pusher.privateuserchannel + this.loginUserInfo.id, (res) => {      
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
      data: { type: 'UpdateForum', body: '<h2>Edit Confirmation</h2>' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'goback') {
        this.savingEntry = true;
        this.router.navigate(['/admin/forums/all']);
      }
    });
  }
  // discard Dialog
  confirmDialog(): Observable<boolean> {
    if (this.savingEntry == false) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Your changes not saved, want to discard changes?';
      this.confirmDialogRef.componentInstance.userId = this.user_id;
      this.confirmDialogRef.componentInstance.itemId = this.url_id;
      this.confirmDialogRef.componentInstance.confirmType = 'changes';
      this.confirmDialogRef.componentInstance.type = 'forum';
      return this.confirmDialogRef.afterClosed();
    }
    else {
      return of(true);
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  // fillFormValues() {
  //   var forumData = new Category().deserialize(this._categoryService.Category, 'single');  //   
  //   this.forumform.patchValue(forumData);
  // }
  fillFormValues(edit) {
    this._categoryService.getEditForum(this.url_id, edit).then(response => {      
      var forumData = new Category().deserialize(response.categoryinfo, 'single');      
      this.forumform.patchValue(forumData);

    });

  }


  onSubmit(event) {
    this.savingEntry = true;
    event.preventDefault();
    event.stopPropagation();
    if (this.forumform.valid) {

      //modify Post Values Before Send to Http
      
      this._categoryService.createCategory(this.forumform.value, this.editForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              if (this.editForm) {
                this.showSnackBar("Forum Updated Successfully", 'CLOSE');
              }
              else {
                this.showSnackBar("Forum added Successfully", 'CLOSE');
              }
              this.router.navigate(['/admin/forums/all']);
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
      CommonUtils.validateAllFormFields(this.forumform);
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
