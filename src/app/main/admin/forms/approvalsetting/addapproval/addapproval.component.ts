import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesService, UsersService, FormsService, ApprovalService, CommonService } from 'app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addapproval',
  templateUrl: './addapproval.component.html',
  styleUrls: ['./addapproval.component.scss'],
  animations: fuseAnimations
})
export class AddapprovalComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  public approvaldata: FormGroup;
  public RoleList: any = [];
  public Userlist: any = [];
  public selectedusers: any = [];
  public url_id

  constructor(
    private _commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _rolesService: RolesService,
    private _matSnackBar: MatSnackBar,
    private _formServices: FormsService,
    private _approvalService: ApprovalService,
    private _usersService: UsersService,
    public router: Router
  ) {

    this.route.params.subscribe(params => {
      this.url_id = params.id;
    });
  }

  ngOnInit() {

    this.RoleList = this._rolesService.roles.data;
    this.approvaldata = this.fb.group({

      id: this.fb.control(''),
      // description     : this.fb.control('',[Validators.required]),
      role_id: this.fb.control('', [Validators.required]),
      user_id: this.fb.control('', [Validators.required]),
      // condition       : this.fb.control('')
    })
    if (this.route.routeConfig.path == 'admin/addapproval/edit/:id') {

      this._approvalService.editapprovalsetting(this.url_id).subscribe(res => {
        this.approvalValues(res);
      })
    }

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    
  }

  approvalValues(res) {
    this.url_id = res.approvalsetting.form_id;

    this.approvaldata.patchValue({ 'role_id': res.approvalsetting.role_id, 'user_id': [res.approvalsetting.user_id] });
  }

  // aaccess the user according the rolls 
  selecteroll($event) {


    this._usersService.getUsers({ 'roles': $event }).then(Response => {

      this.Userlist = Response.data;

    });
  }

  selectesuser($event) {

    this.selectedusers = $event;


  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }


  onClickSave() {
    let value = this.approvaldata.value;


    let approvalsetting: any = {
      "id": value.id !== "" ? value.id : "",
      "form_id": this.url_id,
      "role_id": value.role_id,
      "user_id": value.user_id

    }

    this._approvalService.saveFormApprovalSettings(approvalsetting)
      .subscribe(response => {
        this.showSnackBar(response.message, 'CLOSE');
        this.router.navigate(['admin/form/approvals/', this.url_id]);
      },
        error => {
          // Show the error message
          this.showSnackBar(error.message, 'Retry');
        });
  }

}
