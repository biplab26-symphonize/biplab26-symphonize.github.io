import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { SlugifyPipe } from '@fuse/pipes/slugify.pipe';
import { CommonService, OptionsList, RolesService } from 'app/_services';
import { Roles } from 'app/_models';

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
  isSubmit: boolean = false;
  editRoleForm: boolean = false;
  roleform: FormGroup;
  StatusList: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private slugifyPipe: SlugifyPipe,
    private _rolesService: RolesService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    if (this.route.routeConfig.path == 'admin/roles/edit/:id' && this.route.params['value'].id > 0) {
      this.editRoleForm = true;
    }
  }

  ngOnInit() {
    this.StatusList = OptionsList.Options.tables.status.users;
    //Form Group
    this.setFormControls();

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };

    let checkelement = Array.from(document.getElementsByClassName('mat-paginator-icon') as HTMLCollectionOf<HTMLElement>);
    checkelement.forEach((element) => {
      element.style.backgroundColor = themeData.table_header_background_color;
      element.style.color = themeData.table_font_color;
      element.style.width = '24px';
    });
  }

  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.roleform = this._formBuilder.group({
      id: [null],
      role_type: ['U', [Validators.required]],
      role_key: ['', [Validators.required]],
      role_name: ['', [Validators.required]],
      status: ['A', [Validators.required]],
    });
    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/roles/edit/:id') {
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    var roleData = new Roles().deserialize(this._rolesService.role, 'single');
    console.log("roledata", roleData);
    this.roleform.patchValue(roleData);
  }

  /**SAVE FORM DATA */
  onSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.roleform.valid) {
      this.isSubmit = true;
      this._rolesService.saveRole(this.roleform.value, this.editRoleForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              this.showSnackBar(data.message, 'CLOSE');
              this.router.navigate(['/admin/roles/list']);
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
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }
  /**Create Slug of Role name To save in role_key */
  slugifyRoleKey() {
    this.roleform.get('role_key').setValue(this.slugifyPipe.transform(this.roleform.get('role_name').value) || "");
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
