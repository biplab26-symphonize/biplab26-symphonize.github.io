import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UsersService, OptionsList, GuestRoomService, CommonService, AuthService } from 'app/_services';
import { takeUntil, debounceTime, tap, switchMap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.scss'],
  animations: fuseAnimations
})
export class AddBuildingComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  public addBuilding: FormGroup;
  public title: string = '';
  public buttonTitle: any;
  public extra_prices: any = [];
  public disableSubmit: boolean = false;
  public editBuildingData: boolean = false;
  public url_id: any;
  public isSubmit: boolean = false;
  constructor(
    private authenticationService: AuthService,
    private fb: FormBuilder,
    private _userService: UsersService,
    private _guestroomService: GuestRoomService,
    private _matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _commonService: CommonService) {

    this.title = "Add Building";
    this.buttonTitle = "Save";
    if (this.route.routeConfig.path == 'admin/guest-room/building/edit/:id' && this.route.params['value'].id > 0) {
      this.url_id = this.route.params['value'].id;
      this.editBuildingData = true;
    }
  }

  ngOnInit(): void {
    this.extra_prices = OptionsList.Options.guest_room_extra_price;
    this.setControls();
  }
  setControls() {
    this.addBuilding = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      status: this.fb.control('', [Validators.required])
    });
    if (this.route.routeConfig.path == 'admin/guest-room/building/edit/:id') {
      this.fillRoomsValues();
    }
  }
  fillRoomsValues() {
    this._guestroomService.getBuildingContents(this.url_id).subscribe(response => {      
      let formData = response.buildingsinfo;
      this.addBuilding.patchValue(formData);
    });
  }

  onSaveFieldClick() {
    if (this.addBuilding.valid) {
      this.isSubmit = true;
      let value = this.addBuilding.value;
      let formData = {
        'name': value.name,
        'status': value.status,
        'id': this.editBuildingData == true ? this.url_id : '',
      }
      if (this.addBuilding.valid) {
        this._guestroomService.addBuilding(formData, this.editBuildingData)
          .subscribe(response => {
            this._matSnackBar.open(response.message, 'CLOSE', {
              verticalPosition: 'top',
              duration: 2000
            });
            if (response.status == 200) {
              this.router.navigate(['/admin/guest-room/building/list']);
            }else{
              this.isSubmit = false;
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
  }

}
