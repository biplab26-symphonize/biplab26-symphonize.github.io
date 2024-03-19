import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService, OptionsList, GuestRoomService, CommonService, AuthService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormFieldsComponent } from 'app/layout/components/form-fields/form-fields.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonUtils } from 'app/_helpers';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { TakeOverComponent } from 'app/main/admin/forms/add/take-over/take-over.component';
import moment from 'moment';

@Component({
  selector: 'app-add-more-price',
  templateUrl: './add-more-price.component.html',
  styleUrls: ['./add-more-price.component.scss'],
  animations: fuseAnimations
})
export class AddMorePriceComponent implements OnInit {

  public addPackageItem: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editPackageItem: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  public rooms: any = [];
  public package_id: any;
  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _guestroomService: GuestRoomService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService
  ) {
    this.title = "Add Item";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/more-price/edit/:package_id/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editPackageItem = true;      
    }
    this.package_id = this.route.params['value'].package_id;    
  }

  ngOnInit(): void {
    this.setControls();
  }
  setControls() {
    this.addPackageItem = this.fb.group({
      adults: this.fb.control('', [Validators.required]),
      child: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      package_id: this.fb.control(''),
    });
    if (this.route.routeConfig.path == 'admin/guest-room/more-price/edit/:package_id/:id') {
      this.fillRoomsValues();
    }
  }
  fillRoomsValues() {
    this._guestroomService.getPackageItemContents(this.url_id).subscribe(response => {      
      let formData = response.packagesiteminfo;
       this.addPackageItem.patchValue(formData);
      //this.addPackageItem.patchValue({ rooms: editUnavaliableRooms });
    });
  }
  setReadonly(){
    return false;
  }
  onSaveFieldClick() {
    if (this.addPackageItem.valid) {
      this.isSubmit = true;
      let data = this.addPackageItem.value;
      data.package_id = this.package_id;      
      data['id'] = this.editPackageItem == true ? this.url_id : '',        
      this._guestroomService.addPackageItem(data, this.editPackageItem)
        .subscribe(response => {
          this._matSnackBar.open(response.message, 'CLOSE', {
            verticalPosition: 'top',
            duration: 2000
          });
          this.router.navigate(['/admin/guest-room/more-price/list/',this.package_id]);

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

}

