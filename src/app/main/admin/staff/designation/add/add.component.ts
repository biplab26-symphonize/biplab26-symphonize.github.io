import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MatDialog,  MatSnackBar} from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { CategoryService, CommonService, OptionsList } from 'app/_services';
import { Category } from 'app/_models';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  editForm: boolean = false;
  editUserId: number = 0;
  title: string;

  designationform: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;
  StatusList: any;

  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private _categoryService: CategoryService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    if (this.route.routeConfig.path == 'admin/title/edit/:id' && this.route.params['value'].id > 0) {
      this.editUserId = this.route.params['value'].id;
      this.editForm = true;
    }
    this.title = this.editForm == true ? 'Edit Title' : 'Add New Title';
  }

  logForm(value) {
    console.log(value);
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
  }

  /** define form group controls */
  setFormControls() {
    //Declare Form fields
    this.designationform = this._formBuilder.group({
      id: [null],
      category_name: ['', [Validators.required]],
      category_type: ['DESIGNATION', [Validators.required]],
      status: ['A', [Validators.required]],
    });
    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/title/edit/:id') {
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    var DesignationData = new Category().deserialize(this._categoryService.Category, 'single');
    this.designationform.patchValue(DesignationData);
  }

  /**SAVE FORM DATA */
  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.designationform.valid) {

      //modify Post Values Before Send to Http

      console.log(this.editForm);
      this._categoryService.createCategory(this.designationform.value, this.editForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              this.showSnackBar("Title added Successfully", 'CLOSE');
              this.router.navigate(['/admin/title/list']);
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
