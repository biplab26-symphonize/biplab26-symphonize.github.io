import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { OptionsList, CategoryService, CommonService } from 'app/_services';
import { Category } from 'app/_models';

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
  editCategoryForm: boolean = false;
  categoryform: FormGroup;
  StatusList: any;
  private _unsubscribeAll: Subject<any>;

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
    if (this.route.routeConfig.path == 'admin/files/categories/edit/:id' && this.route.params['value'].id > 0) {
      this.editCategoryForm = true;
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
  }

  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.categoryform = this._formBuilder.group({
      id: [null],
      category_name: ['', [Validators.required]],
      // description       : [''],
      category_type: ['D'],
      status: ['A', [Validators.required]],
    });
    //Load Edit Form Values
    if (this.route.routeConfig.path == 'admin/files/categories/edit/:id') {
      this.fillFormValues();
    }
  }
  /** FILL FORM FROM EDIT ROUTE */
  fillFormValues() {
    var categoryData = new Category().deserialize(this._categoryService.Category, 'single');
    this.categoryform.patchValue(categoryData);
  }

  /**SAVE FORM DATA */
  onSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.categoryform.valid) {
      this.isSubmit = true;
      this._categoryService.createCategory(this.categoryform.value, this.editCategoryForm)
        .pipe(first(), takeUntil(this._unsubscribeAll))
        .subscribe(
          data => {
            if (data.status == 200) {
              this.showSnackBar(data.message, 'CLOSE');
              this.router.navigate(['admin/files/categories/list']);
            }
            else {
              this.isSubmit = false;
              this.showSnackBar(data.message, 'CLOSE');
            }
          },
          error => {
            this.isSubmit = false;
            // Show the error message
            this.showSnackBar(error.message, 'CLOSE');
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
