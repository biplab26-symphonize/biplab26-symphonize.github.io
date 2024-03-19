import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig, AuthService, ChatService, CommonService, GuestRoomService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SeasonalPricesComponent } from '../seasonal-prices/seasonal-prices.component';
import moment from 'moment';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.scss'],
  animations: fuseAnimations
})
export class AddPriceComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; //EXTRA Changes 
  title: string;
  public addPrices: FormGroup;
  public editPrice: boolean = false;
  public isSubmit: boolean = false;
  public url_id: any;
  public ab_value: any;
  seasonalFormArray: FormArray;
  default_price: FormArray;
  default_special_price: FormArray;
  seasonal_price: FormArray;
  seasonal_special_price: FormArray;
  public roomList: any;
  public specialPrices: any = [];
  public numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  specialItems: FormArray;
  optionItems: FormArray;
  public priceList: any;
  public isPrice: boolean = false;
  public adults: any = [];
  public children: any = [];
  public ad: any = [];
  public child: any = [];
  public roomIdTab: any;
  constructor(public _matDialog: MatDialog, private _commonService: CommonService, private _dialog: MatDialog, private _chatService: ChatService, private authenticationService: AuthService, private fb: FormBuilder, private _guestRoomService: GuestRoomService, private _matSnackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.title = 'Prices';
    if (this.route.routeConfig.path == 'admin/guest-room/edit-price/:id' && this.route.params['value'].id > 0) {
      // let url_room_id = this.route.params['value'].id; 
      // this.url_id = url_room_id.replace(/\s/g, "");
      this.url_id = Number(this.route.params['value'].id);      
    }
  }

  ngOnInit(): void {
    localStorage.removeItem("seasonalArr");
    this.setControls();
    this.getRoomsList();
    if (this.route.routeConfig.path == 'admin/guest-room/edit-price/:id') {
      this.addPrices.patchValue({ room_id: this.url_id });
      this.getPricesList(this.url_id);
      this.getAdultsChildren(this.url_id);
    }
  }
  setControls() {
    this.addPrices = this.fb.group({
      room_id: this.fb.control('', [Validators.required]),
      default_price: this.fb.array([this.createItem()]),
      default_special_price: this.fb.array([]),
      seasonalFormArray: this.fb.array([]),
      id: this.editPrice == true ? this.url_id : '',
    });
  }
  getRoomsList() {
    return this._guestRoomService.getRoomList({ 'status': 'A', 'direction': 'asc','column':'type' }).then(Response => {
      this.roomList = Response.data;
    });
  }
  patchSeason(item: any) {
    let optionsArray = [];
    if (item) {
      optionsArray.push(
        this.fb.group({
          season_default_price_one: item[0].monday,
          season_default_price_two: item[0].tuesday,
          season_default_price_three: item[0].wednesday,
          season_default_price_four: item[0].thursday,
          season_default_price_five: item[0].friday,
          season_default_price_six: item[0].saturday,
          season_default_price_seven: item[0].sunday
        })
      );
      return optionsArray;
    }
  }
  patchSpecialSeason(item: any) {
    let optionsArray = [];
    if (item) {
      item.map((element, index) => {
        if (index != 0) {
          optionsArray.push(
            this.fb.group({
              adults_season: element.adults,
              children_season: element.children,
              season_special_price_one: element.monday,
              season_special_price_two: element.tuesday,
              season_special_price_three: element.wednesday,
              season_special_price_four: element.thursday,
              season_special_price_five: element.friday,
              season_special_price_six: element.saturday,
              season_special_price_seven: element.sunday
            })
          );
        }
      });
      return optionsArray;
    }
  }
  getPricesList(room_id) {
    this.roomIdTab = room_id;
    return this._guestRoomService.getPriceList({ 'room_id': room_id }).then(Response => {
      let optionArray1 = this.addPrices.get('seasonalFormArray') as FormArray;
      optionArray1.clear();
      let optionArray2 = this.addPrices.get('default_price') as FormArray;
      optionArray2.clear();
      let optionArray3 = this.addPrices.get('default_special_price') as FormArray;
      optionArray3.clear();
      let formData = Response.priceinfo;
      let data = [];
      Object.keys(formData).map(function (key) {
        data.push(formData[key])
        return data;
      });      
      if (data.length > 0) {
        this.specialPrices = [];
        let i = 0;
        let k = 0;
        data.forEach(season => {
          if (k != 0) {
            this.specialPrices[i] = { 'tab_id': season[0].tab_id, 'tab_name': season[0].season, 'room_id': season[0].room_id };
            i = i + 1;
          }
          k = k + 1;
        });
        localStorage.setItem("seasonalArr", JSON.stringify(this.specialPrices));
        this.default_price = this.addPrices.get('default_price') as FormArray;
        this.default_special_price = this.addPrices.get('default_special_price') as FormArray;
        let counter = 0;

        data.map((item, index1) => {
          item.map((itemp, index2) => {
            if (itemp.season == 'default price') {
              if (itemp.adults == 0 && itemp.children == 0) {
                this.default_price.removeAt(0);
                const tempObj = {};
                tempObj['price_one'] = new FormControl(itemp.monday);
                tempObj['price_two'] = new FormControl(itemp.tuesday);
                tempObj['price_three'] = new FormControl(itemp.wednesday);
                tempObj['price_four'] = new FormControl(itemp.thursday);
                tempObj['price_five'] = new FormControl(itemp.friday);
                tempObj['price_six'] = new FormControl(itemp.saturday);
                tempObj['price_seven'] = new FormControl(itemp.sunday);
                this.default_price.push(this.fb.group(tempObj));
              } else {
                const tempObj = {};
                tempObj['adults'] = new FormControl(itemp.adults);
                tempObj['children'] = new FormControl(itemp.children);
                tempObj['guest_one'] = new FormControl(itemp.monday);
                tempObj['guest_two'] = new FormControl(itemp.tuesday);
                tempObj['guest_three'] = new FormControl(itemp.wednesday);
                tempObj['guest_four'] = new FormControl(itemp.thursday);
                tempObj['guest_five'] = new FormControl(itemp.friday);
                tempObj['guest_six'] = new FormControl(itemp.saturday);
                tempObj['guest_seven'] = new FormControl(itemp.sunday);
                this.default_special_price.push(this.fb.group(tempObj));
              }
            }
          });
        });

        data.map((item, index) => {
          this.seasonal_price = this.addPrices.get('seasonal_price') as FormArray;
          this.seasonal_special_price = this.addPrices.get('seasonal_special_price') as FormArray;
          this.seasonalFormArray = this.addPrices.get('seasonalFormArray') as FormArray;
          if (index != 0) {
            const tempObj = {};
            tempObj['season_title'] = new FormControl(item[0].season);
            tempObj['date_from'] = new FormControl(item[0].date_from);
            tempObj['date_to'] = new FormControl(item[0].date_to);
            tempObj['seasonal_price'] = this.fb.array(this.patchSeason(item));
            tempObj['seasonal_special_price'] = this.fb.array(this.patchSpecialSeason(item));
            this.seasonalFormArray.push(this.fb.group(tempObj));
          }
        });
      } else {
        this.onAddSelectRow();
      }
      this.isPrice = true;
    });
  }
  getAdultsChildren(room_id) {
    this._guestRoomService.getRoomsContents(room_id).subscribe(response => {
      let formData = response.roominfo;
      this.ad = formData.adults;
      this.child = formData.children;
      for (let i = 0; i <= this.ad; i++) {
        this.adults[i] = i;
      }
      for (let i = 0; i <= this.child; i++) {
        this.children[i] = i;
      }
    });
  }

  onSubmit() {    
    if (this.addPrices.valid) {
      this.isPrice = false;
      this.isSubmit = false;
      let data = this.addPrices.value;
      let seasonArr: any = [];
      seasonArr[0] = {
        'tab_id': 1,
        'season': 'default price',
        'date_from': '',
        'date_to': '',
        'adults': 0,
        'children': 0,
        'monday': data.default_price[0].price_one,
        'tuesday': data.default_price[0].price_two,
        'wednesday': data.default_price[0].price_three,
        'thursday': data.default_price[0].price_four,
        'friday': data.default_price[0].price_five,
        'saturday': data.default_price[0].price_six,
        'sunday': data.default_price[0].price_seven,
      };
      let i = 1;
      data.default_special_price.map((item, index) => {
        seasonArr[i] = {
          'tab_id': 1,
          'season': 'default price',
          'date_from': '',
          'date_to': '',
          'adults': data.default_special_price[0].adults,
          'children': data.default_special_price[0].children,
          'monday': data.default_special_price[0].guest_one,
          'tuesday': data.default_special_price[0].guest_two,
          'wednesday': data.default_special_price[0].guest_three,
          'thursday': data.default_special_price[0].guest_four,
          'friday': data.default_special_price[0].guest_five,
          'saturday': data.default_special_price[0].guest_six,
          'sunday': data.default_special_price[0].guest_seven,
        };
        i = i + 1;
      });

      let k = 2;
      data.seasonalFormArray.forEach(item => {
        item.seasonal_price.forEach(season1 => {
          seasonArr[i] = {
            'tab_id': k,
            'season': item.season_title,
            'date_from': moment(item.date_from).format('YYYY-MM-DD'),
            'date_to': moment(item.date_to).format('YYYY-MM-DD'),
            'adults': '',
            'children': '',
            'monday': season1.season_default_price_one,
            'tuesday': season1.season_default_price_two,
            'wednesday': season1.season_default_price_three,
            'thursday': season1.season_default_price_four,
            'friday': season1.season_default_price_five,
            'saturday': season1.season_default_price_six,
            'sunday': season1.season_default_price_seven,
          };
        });
        i = i + 1;
        if (item.seasonal_special_price.length > 0) {
          item.seasonal_special_price.forEach(season2 => {
            seasonArr[i] = {
              'tab_id': k,
              'season': item.season_title,
              'date_from': moment(item.date_from).format('YYYY-MM-DD'),
              'date_to': moment(item.date_to).format('YYYY-MM-DD'),
              'adults': season2.adults_season,
              'children': season2.children_season,
              'monday': season2.season_special_price_one,
              'tuesday': season2.season_special_price_two,
              'wednesday': season2.season_special_price_three,
              'thursday': season2.season_special_price_four,
              'friday': season2.season_special_price_five,
              'saturday': season2.season_special_price_six,
              'sunday': season2.season_special_price_seven,
            };
            i = i + 1;
          });
        }
        k = k + 1;
      });
      let dataArr: any = [];
      dataArr = {
        'room_id': data.room_id,
        'pricedata': seasonArr,
      };

      this._guestRoomService.addPrice(dataArr, this.editPrice).subscribe(response => {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration: 2000
        });
        let optionArray1 = this.addPrices.get('seasonalFormArray') as FormArray;
        optionArray1.clear();
        let optionArray2 = this.addPrices.get('default_price') as FormArray;
        optionArray2.clear();
        let optionArray3 = this.addPrices.get('default_special_price') as FormArray;
        optionArray3.clear();
        this.getPricesList(data.room_id);
        this.getAdultsChildren(data.room_id);
        //this.router.navigate(['/admin/guest-room/list']);
      },
        error => {
          //Show the error message
          this.isSubmit = false;
          this._matSnackBar.open(error.message, 'Retry', {
            verticalPosition: 'top',
            duration: 2000
          });
        });

    }
  }
  onSequenceChangeEvent(event) {
  }
  Cancel() {
    this.router.navigate(['/admin/guest-room/list']);
  }
  addSeasonal() {
    const dialogRef = this._dialog.open(SeasonalPricesComponent, {
      disableClose: true,
      width: '50%',
      panelClass: 'addseasonalprice',
      data: { filterData: '' }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result == 'Y') {
        setTimeout(() => {
          this.specialPrices = JSON.parse(localStorage.getItem("seasonalArr"));
          this.onAddFormArray();
        }, 300);
      }
    });
  }
  createItem() {
    return this.fb.group({
      price_one: ['', Validators.required],
      price_two: ['', Validators.required],
      price_three: ['', Validators.required],
      price_four: ['', Validators.required],
      price_five: ['', Validators.required],
      price_six: ['', Validators.required],
      price_seven: ['', Validators.required],
    })
  }
  onAddSelectRow() {
    this.default_price = this.addPrices.get('default_price') as FormArray;
    this.default_price.push(this.createItem());
  }
  onRemoveRow(index) {
    this.default_price.removeAt(index)
  }
  getControls() {
    return (this.addPrices.get('default_price') as FormArray).controls;
  }
  // for special price
  createSpecialPriceItem() {
    return this.fb.group({
      adults: ['', Validators.required],
      children: ['', Validators.required],
      guest_one: ['', Validators.required],
      guest_two: ['', Validators.required],
      guest_three: ['', Validators.required],
      guest_four: ['', Validators.required],
      guest_five: ['', Validators.required],
      guest_six: ['', Validators.required],
      guest_seven: ['', Validators.required],
    })
  }
  onAddSelectRowSpecialPrice() {
    this.default_special_price = this.addPrices.get('default_special_price') as FormArray;
    this.default_special_price.push(this.createSpecialPriceItem());
  }
  onRemoveRowSpecialPrice(index) {
    this.default_special_price.removeAt(index)
  }
  getSpecialControls() {
    return (this.addPrices.get('default_special_price') as FormArray).controls;
  }

  createSeasonFormArrayItem() {
    return this.fb.group({
      season_title: this.fb.control('', [Validators.required]),
      date_from: this.fb.control('', [Validators.required]),
      date_to: this.fb.control('', [Validators.required]),
      seasonal_price: this.fb.array([this.createSeasonDefaultPriceItem()]),
      seasonal_special_price: this.fb.array([this.createSeasonSpecialPriceItem()]),
    })
  }
  onAddFormArray() {
    this.seasonalFormArray = this.addPrices.get('seasonalFormArray') as FormArray;
    this.seasonalFormArray.push(this.createSeasonFormArrayItem());
  }

  // for seasonal default price
  createSeasonDefaultPriceItem() {
    return this.fb.group({
      season_default_price_one: ['', Validators.required],
      season_default_price_two: ['', Validators.required],
      season_default_price_three: ['', Validators.required],
      season_default_price_four: ['', Validators.required],
      season_default_price_five: ['', Validators.required],
      season_default_price_six: ['', Validators.required],
      season_default_price_seven: ['', Validators.required],
    })
  }
  onAddSelectRowSeasonDefaultPrice() {
    this.seasonal_price = this.addPrices.get('seasonal_price') as FormArray;
    this.seasonal_price.push(this.createSeasonDefaultPriceItem());
  }
  // onRemoveRowSeasonDefaultPrice(index) {
  //   this.seasonal_price.removeAt(index)
  // }
  // getSeasonDefaultPriceControls() {
  //   return (this.addPrices.get('seasonal_price') as FormArray).controls;
  // }



  // for seasonal special price
  createSeasonSpecialPriceItem() {
    return this.fb.group({
      adults_season: ['', Validators.required],
      children_season: ['', Validators.required],
      season_special_price_one: ['', Validators.required],
      season_special_price_two: ['', Validators.required],
      season_special_price_three: ['', Validators.required],
      season_special_price_four: ['', Validators.required],
      season_special_price_five: ['', Validators.required],
      season_special_price_six: ['', Validators.required],
      season_special_price_seven: ['', Validators.required],
    })
  }
  onAddSelectRowSeasonSpecialPrice(fieldIndex: number = 0) {
    let optionArray = this.addPrices.get('seasonalFormArray') as FormArray;
    this.seasonal_special_price = optionArray.controls[fieldIndex].get('seasonal_special_price') as FormArray;
    this.seasonal_special_price.push(this.createSeasonSpecialPriceItem());
  }
  onRemoveRowSeasonSpecialPrice(fieldIndex: number = 0, optionIndex: number = 0) {
    // this.seasonal_special_price.removeAt(index)
    let optionArray = this.addPrices.get('seasonalFormArray') as FormArray;
    this.seasonal_special_price = optionArray.controls[fieldIndex].get('seasonal_special_price') as FormArray;
    this.seasonal_special_price.removeAt(optionIndex);
    //  setTimeout(() => {
    //    this.prepareSpecialArray();
    //  }, 0);
  }
  closeTab(tab_id, room_id, remove_index,roomIdTab) {                
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete selected season? Please, note that you should click SAVE button to save the changes.Are you sure you want to delete selected Service?';
    this.confirmDialogRef.afterClosed()
      .subscribe(result => {        
        let flag = 0;
        if (result && room_id != '' && tab_id != '') {
          flag = 1;
          let deleteData = {
            'tab_id': tab_id,
            'room_id': room_id,
          };
          let deleteUrl = 'guestroom/delete/price';
          this._guestRoomService.deletePriceTab(deleteUrl, deleteData)
            .subscribe(deleteResponse => {
              this.isPrice = false;
              //this.seasonalFormArray.removeAt(remove_index);
              this.specialPrices.splice(remove_index, 1);
              localStorage.setItem("seasonalArr", JSON.stringify(this.specialPrices));
              let optionArray1 = this.addPrices.get('seasonalFormArray') as FormArray;
              optionArray1.clear();
              let optionArray2 = this.addPrices.get('default_price') as FormArray;
              optionArray2.clear();
              let optionArray3 = this.addPrices.get('default_special_price') as FormArray;
              optionArray3.clear();
              this.getPricesList(room_id);
              this.getAdultsChildren(room_id);
              this._matSnackBar.open(deleteResponse.message, 'CLOSE', {
                verticalPosition: 'top',
                duration: 2000
              });
            },
              error => {
                // Show the error message
                this._matSnackBar.open(error.message, 'Retry', {
                  verticalPosition: 'top',
                  duration: 2000
                });
              });
        }
        if(flag == 0){
          if (result) {
            this.isPrice = false;
            this.specialPrices.splice(remove_index, 1);
              localStorage.setItem("seasonalArr", JSON.stringify(this.specialPrices));
              let optionArray1 = this.addPrices.get('seasonalFormArray') as FormArray;
              optionArray1.clear();
              let optionArray2 = this.addPrices.get('default_price') as FormArray;
              optionArray2.clear();
              let optionArray3 = this.addPrices.get('default_special_price') as FormArray;
              optionArray3.clear();
              this.getPricesList(this.roomIdTab);
              this.getAdultsChildren(this.roomIdTab);
          }
        }
        // else {
        //   this.seasonalFormArray.removeAt(remove_index);
        //   this.specialPrices.splice(remove_index, 1);
        //   localStorage.setItem("seasonalArr", JSON.stringify(this.specialPrices));
        // }
        this.confirmDialogRef = null;
      });    
  }

  // getSeasonSpecialPriceControls() {
  //   return (this.addPrices.get('seasonal_special_price') as FormArray).controls;
  // }
}
