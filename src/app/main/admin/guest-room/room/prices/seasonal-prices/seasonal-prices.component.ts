import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormsService } from 'app/_services';
import moment from 'moment';

@Component({
  selector: 'app-seasonal-prices',
  templateUrl: './seasonal-prices.component.html',
  styleUrls: ['./seasonal-prices.component.scss']
})
export class SeasonalPricesComponent implements OnInit {
  public filterData: any;
  public addSeasonalPrice: FormGroup;
  public seasonalArr: any = [];
  constructor(private fb: FormBuilder,
    public router: Router,
    public dialogRef: MatDialogRef<SeasonalPricesComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _formsService: FormsService) {
     }

  ngOnInit(): void {
    this.filterData = this.data.filterData;
    this.setControls();
  }
  setControls() {        
    this.addSeasonalPrice = this.fb.group({
      seasonal_price: this.fb.control('', [Validators.required]),
    });
  }
  onSaveFieldClick() {
    if (this.addSeasonalPrice.valid) {
      let data = this.addSeasonalPrice.value;      
      if (localStorage.getItem("seasonalArr") === null) {        
        this.seasonalArr[0] = {'tab_id': '','tab_name': data.seasonal_price,'room_id': ''};        
        localStorage.setItem("seasonalArr", JSON.stringify(this.seasonalArr));
      } else {        
         this.seasonalArr =JSON.parse(localStorage.getItem("seasonalArr"));
        let len = this.seasonalArr.length;
        this.seasonalArr[len] = {'tab_id': '','tab_name': data.seasonal_price,'room_id': ''};
        localStorage.setItem("seasonalArr",JSON.stringify(this.seasonalArr));

      }
      this.dialogRef.close('Y');
    }
  }
  Close() {
    this.dialogRef.close('N');
  }
}
